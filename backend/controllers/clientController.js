import { db } from '../config/database.js';
import { inquiries, partnerProfiles, leadAssignments, users } from '../models/schema.js';
import { eq, and, ilike, or } from 'drizzle-orm';
import logger from '../utils/logger.js';

// Submit service inquiry
export const submitInquiry = async (req, res) => {
  try {
    const {
      category,
      eventDate,
      budget,
      city,
      description,
      referenceImageUrl,
    } = req.body;

    const clientId = req.user.id;

    // Mock reference image URL if using mock upload
    const finalReferenceImageUrl = process.env.MOCK_FILE_UPLOAD === 'true' && !referenceImageUrl
      ? `https://picsum.photos/600/400?random=${Date.now()}`
      : referenceImageUrl;

    // Create inquiry
    const inquiry = await db.insert(inquiries).values({
      clientId,
      category,
      eventDate: eventDate ? new Date(eventDate) : null,
      budget,
      city,
      description,
      referenceImageUrl: finalReferenceImageUrl,
    }).returning();

    // Find matching partners based on category and location
    const matchingPartners = await db.select({
      id: partnerProfiles.id,
      userId: partnerProfiles.userId,
      businessName: partnerProfiles.businessName,
      serviceCategories: partnerProfiles.serviceCategories,
      basePrice: partnerProfiles.basePrice,
      user: {
        city: users.city,
      },
    })
    .from(partnerProfiles)
    .innerJoin(users, eq(partnerProfiles.userId, users.id))
    .where(and(
      eq(partnerProfiles.verificationStatus, 'verified'),
      or(
        ilike(users.city, `%${city}%`),
        ilike(partnerProfiles.serviceCategories, `%${category}%`)
      )
    ));

    // Create lead assignments for matching partners
    const leadAssignmentPromises = matchingPartners.map(partner => {
      const serviceCategories = JSON.parse(partner.serviceCategories || '[]');
      
      // Check if partner serves this category
      if (serviceCategories.includes(category) || serviceCategories.length === 0) {
        return db.insert(leadAssignments).values({
          inquiryId: inquiry[0].id,
          partnerId: partner.id,
        });
      }
      return null;
    }).filter(Boolean);

    // Execute all lead assignments
    await Promise.all(leadAssignmentPromises);

    logger.info(`Inquiry submitted by client ${clientId}, assigned to ${leadAssignmentPromises.length} partners`);

    res.status(201).json({
      success: true,
      message: 'Inquiry submitted successfully',
      data: {
        inquiry: inquiry[0],
        assignedPartners: leadAssignmentPromises.length,
      },
    });
  } catch (error) {
    logger.error('Submit inquiry error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

// Get client's inquiries
export const getMyInquiries = async (req, res) => {
  try {
    const clientId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    // Get client's inquiries with lead assignment count
    const clientInquiries = await db.select({
      id: inquiries.id,
      category: inquiries.category,
      eventDate: inquiries.eventDate,
      budget: inquiries.budget,
      city: inquiries.city,
      description: inquiries.description,
      referenceImageUrl: inquiries.referenceImageUrl,
      status: inquiries.status,
      createdAt: inquiries.createdAt,
    })
    .from(inquiries)
    .where(eq(inquiries.clientId, clientId))
    .orderBy(inquiries.createdAt)
    .limit(limit)
    .offset(offset);

    // Get response count for each inquiry
    const inquiriesWithResponses = await Promise.all(
      clientInquiries.map(async (inquiry) => {
        const responses = await db.select()
          .from(leadAssignments)
          .where(and(
            eq(leadAssignments.inquiryId, inquiry.id),
            eq(leadAssignments.isResponded, true)
          ));

        return {
          ...inquiry,
          responseCount: responses.length,
        };
      })
    );

    res.json({
      success: true,
      data: {
        inquiries: inquiriesWithResponses,
        pagination: {
          page,
          limit,
          total: clientInquiries.length,
        },
      },
    });
  } catch (error) {
    logger.error('Get my inquiries error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

// Get responses for a specific inquiry
export const getInquiryResponses = async (req, res) => {
  try {
    const { id } = req.params;
    const clientId = req.user.id;

    // Verify inquiry belongs to client
    const inquiry = await db.select()
      .from(inquiries)
      .where(and(
        eq(inquiries.id, parseInt(id)),
        eq(inquiries.clientId, clientId)
      ))
      .limit(1);

    if (!inquiry.length) {
      return res.status(404).json({
        success: false,
        message: 'Inquiry not found',
      });
    }

    // Get responses with partner details
    const responses = await db.select({
      id: leadAssignments.id,
      isResponded: leadAssignments.isResponded,
      responseMessage: leadAssignments.responseMessage,
      quotedPrice: leadAssignments.quotedPrice,
      respondedAt: leadAssignments.updatedAt,
      partner: {
        id: partnerProfiles.id,
        businessName: partnerProfiles.businessName,
        description: partnerProfiles.description,
        experience: partnerProfiles.experience,
        basePrice: partnerProfiles.basePrice,
        isFeatured: partnerProfiles.isFeatured,
        user: {
          firstName: users.firstName,
          lastName: users.lastName,
          city: users.city,
          phone: users.phone,
        },
      },
    })
    .from(leadAssignments)
    .innerJoin(partnerProfiles, eq(leadAssignments.partnerId, partnerProfiles.id))
    .innerJoin(users, eq(partnerProfiles.userId, users.id))
    .where(and(
      eq(leadAssignments.inquiryId, parseInt(id)),
      eq(leadAssignments.isResponded, true)
    ));

    res.json({
      success: true,
      data: {
        inquiry: inquiry[0],
        responses,
      },
    });
  } catch (error) {
    logger.error('Get inquiry responses error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

// Browse partners (public endpoint with optional auth)
export const browsePartners = async (req, res) => {
  try {
    const { category, city, page = 1, limit = 10 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    let whereConditions = [eq(partnerProfiles.verificationStatus, 'verified')];

    // Add category filter
    if (category) {
      whereConditions.push(ilike(partnerProfiles.serviceCategories, `%${category}%`));
    }

    // Add city filter
    if (city) {
      whereConditions.push(ilike(users.city, `%${city}%`));
    }

    // Get partners with their basic info and portfolio count
    const partners = await db.select({
      id: partnerProfiles.id,
      businessName: partnerProfiles.businessName,
      description: partnerProfiles.description,
      experience: partnerProfiles.experience,
      basePrice: partnerProfiles.basePrice,
      serviceCategories: partnerProfiles.serviceCategories,
      isFeatured: partnerProfiles.isFeatured,
      user: {
        firstName: users.firstName,
        lastName: users.lastName,
        city: users.city,
      },
    })
    .from(partnerProfiles)
    .innerJoin(users, eq(partnerProfiles.userId, users.id))
    .where(and(...whereConditions))
    .orderBy(partnerProfiles.isFeatured, partnerProfiles.createdAt)
    .limit(parseInt(limit))
    .offset(offset);

    // Parse service categories for each partner
    const partnersWithParsedCategories = partners.map(partner => ({
      ...partner,
      serviceCategories: JSON.parse(partner.serviceCategories || '[]'),
    }));

    res.json({
      success: true,
      data: {
        partners: partnersWithParsedCategories,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: partners.length,
        },
        filters: {
          category,
          city,
        },
      },
    });
  } catch (error) {
    logger.error('Browse partners error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

// Get partner details with portfolio
export const getPartnerDetails = async (req, res) => {
  try {
    const { id } = req.params;

    // Get partner details
    const partner = await db.select({
      id: partnerProfiles.id,
      businessName: partnerProfiles.businessName,
      description: partnerProfiles.description,
      experience: partnerProfiles.experience,
      basePrice: partnerProfiles.basePrice,
      serviceCategories: partnerProfiles.serviceCategories,
      isFeatured: partnerProfiles.isFeatured,
      verificationStatus: partnerProfiles.verificationStatus,
      createdAt: partnerProfiles.createdAt,
      user: {
        firstName: users.firstName,
        lastName: users.lastName,
        city: users.city,
      },
    })
    .from(partnerProfiles)
    .innerJoin(users, eq(partnerProfiles.userId, users.id))
    .where(and(
      eq(partnerProfiles.id, parseInt(id)),
      eq(partnerProfiles.verificationStatus, 'verified')
    ))
    .limit(1);

    if (!partner.length) {
      return res.status(404).json({
        success: false,
        message: 'Partner not found',
      });
    }

    // Get partner's portfolio
    const portfolio = await db.select()
      .from(portfolios)
      .where(eq(portfolios.partnerId, parseInt(id)))
      .orderBy(portfolios.displayOrder, portfolios.createdAt);

    res.json({
      success: true,
      data: {
        partner: {
          ...partner[0],
          serviceCategories: JSON.parse(partner[0].serviceCategories || '[]'),
        },
        portfolio,
      },
    });
  } catch (error) {
    logger.error('Get partner details error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};
