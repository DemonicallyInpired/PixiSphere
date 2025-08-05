import { db } from '../config/database.js';
import { partnerProfiles, portfolios, leadAssignments, inquiries, users } from '../models/schema.js';
import { eq, and, desc } from 'drizzle-orm';
import logger from '../utils/logger.js';

// Create or update partner profile
export const createPartnerProfile = async (req, res) => {
  try {
    const {
      businessName,
      description,
      experience,
      basePrice,
      serviceCategories,
      aadharNumber,
      panNumber,
      gstNumber,
    } = req.body;

    const userId = req.user.id;

    // Check if partner profile already exists
    const existingProfile = await db.select().from(partnerProfiles).where(eq(partnerProfiles.userId, userId)).limit(1);

    let result;
    if (existingProfile.length > 0) {
      // Update existing profile
      result = await db.update(partnerProfiles)
        .set({
          businessName,
          description,
          experience,
          basePrice,
          serviceCategories: JSON.stringify(serviceCategories),
          aadharNumber,
          panNumber,
          gstNumber,
          updatedAt: new Date(),
        })
        .where(eq(partnerProfiles.userId, userId))
        .returning();
    } else {
      // Create new profile
      result = await db.insert(partnerProfiles).values({
        userId,
        businessName,
        description,
        experience,
        basePrice,
        serviceCategories: JSON.stringify(serviceCategories),
        aadharNumber,
        panNumber,
        gstNumber,
      }).returning();
    }

    logger.info(`Partner profile ${existingProfile.length > 0 ? 'updated' : 'created'} for user: ${userId}`);

    res.status(existingProfile.length > 0 ? 200 : 201).json({
      success: true,
      message: `Partner profile ${existingProfile.length > 0 ? 'updated' : 'created'} successfully`,
      data: {
        profile: {
          ...result[0],
          serviceCategories: JSON.parse(result[0].serviceCategories || '[]'),
        },
      },
    });
  } catch (error) {
    logger.error('Create/Update partner profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

// Get partner profile
export const getPartnerProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const profile = await db.select().from(partnerProfiles).where(eq(partnerProfiles.userId, userId)).limit(1);

    if (!profile.length) {
      return res.status(404).json({
        success: false,
        message: 'Partner profile not found',
      });
    }

    res.json({
      success: true,
      data: {
        profile: {
          ...profile[0],
          serviceCategories: JSON.parse(profile[0].serviceCategories || '[]'),
        },
      },
    });
  } catch (error) {
    logger.error('Get partner profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

// Get assigned leads for partner
export const getAssignedLeads = async (req, res) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    // Get partner profile
    const partnerProfile = await db.select().from(partnerProfiles).where(eq(partnerProfiles.userId, userId)).limit(1);

    if (!partnerProfile.length) {
      return res.status(404).json({
        success: false,
        message: 'Partner profile not found',
      });
    }

    // Get assigned leads with inquiry details
    const leads = await db.select({
      id: leadAssignments.id,
      inquiryId: leadAssignments.inquiryId,
      isResponded: leadAssignments.isResponded,
      responseMessage: leadAssignments.responseMessage,
      quotedPrice: leadAssignments.quotedPrice,
      assignedAt: leadAssignments.createdAt,
      inquiry: {
        id: inquiries.id,
        category: inquiries.category,
        eventDate: inquiries.eventDate,
        budget: inquiries.budget,
        city: inquiries.city,
        description: inquiries.description,
        referenceImageUrl: inquiries.referenceImageUrl,
        status: inquiries.status,
        createdAt: inquiries.createdAt,
      },
      client: {
        firstName: users.firstName,
        lastName: users.lastName,
        email: users.email,
        phone: users.phone,
      },
    })
    .from(leadAssignments)
    .innerJoin(inquiries, eq(leadAssignments.inquiryId, inquiries.id))
    .innerJoin(users, eq(inquiries.clientId, users.id))
    .where(eq(leadAssignments.partnerId, partnerProfile[0].id))
    .orderBy(desc(leadAssignments.createdAt))
    .limit(limit)
    .offset(offset);

    res.json({
      success: true,
      data: {
        leads,
        pagination: {
          page,
          limit,
          total: leads.length,
        },
      },
    });
  } catch (error) {
    logger.error('Get assigned leads error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

// Respond to a lead
export const respondToLead = async (req, res) => {
  try {
    const { id } = req.params;
    const { responseMessage, quotedPrice } = req.body;
    const userId = req.user.id;

    // Get partner profile
    const partnerProfile = await db.select().from(partnerProfiles).where(eq(partnerProfiles.userId, userId)).limit(1);

    if (!partnerProfile.length) {
      return res.status(404).json({
        success: false,
        message: 'Partner profile not found',
      });
    }

    // Check if lead assignment exists and belongs to this partner
    const leadAssignment = await db.select()
      .from(leadAssignments)
      .where(and(
        eq(leadAssignments.id, parseInt(id)),
        eq(leadAssignments.partnerId, partnerProfile[0].id)
      ))
      .limit(1);

    if (!leadAssignment.length) {
      return res.status(404).json({
        success: false,
        message: 'Lead assignment not found',
      });
    }

    // Update lead assignment with response
    const updatedLead = await db.update(leadAssignments)
      .set({
        isResponded: true,
        responseMessage,
        quotedPrice,
        updatedAt: new Date(),
      })
      .where(eq(leadAssignments.id, parseInt(id)))
      .returning();

    // Update inquiry status to 'responded'
    await db.update(inquiries)
      .set({
        status: 'responded',
        updatedAt: new Date(),
      })
      .where(eq(inquiries.id, leadAssignment[0].inquiryId));

    logger.info(`Partner ${userId} responded to lead ${id}`);

    res.json({
      success: true,
      message: 'Response submitted successfully',
      data: {
        leadAssignment: updatedLead[0],
      },
    });
  } catch (error) {
    logger.error('Respond to lead error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

// Add portfolio item
export const addPortfolioItem = async (req, res) => {
  try {
    const { title, description, imageUrl, category, displayOrder } = req.body;
    const userId = req.user.id;

    // Get partner profile
    const partnerProfile = await db.select().from(partnerProfiles).where(eq(partnerProfiles.userId, userId)).limit(1);

    if (!partnerProfile.length) {
      return res.status(404).json({
        success: false,
        message: 'Partner profile not found',
      });
    }

    // Mock image URL if using mock upload
    const finalImageUrl = process.env.MOCK_FILE_UPLOAD === 'true' 
      ? `https://picsum.photos/800/600?random=${Date.now()}` 
      : imageUrl;

    // Create portfolio item
    const portfolioItem = await db.insert(portfolios).values({
      partnerId: partnerProfile[0].id,
      title,
      description,
      imageUrl: finalImageUrl,
      category,
      displayOrder: displayOrder || 0,
    }).returning();

    logger.info(`Portfolio item added for partner: ${userId}`);

    res.status(201).json({
      success: true,
      message: 'Portfolio item added successfully',
      data: {
        portfolioItem: portfolioItem[0],
      },
    });
  } catch (error) {
    logger.error('Add portfolio item error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

// Get portfolio items
export const getPortfolioItems = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get partner profile
    const partnerProfile = await db.select().from(partnerProfiles).where(eq(partnerProfiles.userId, userId)).limit(1);

    if (!partnerProfile.length) {
      return res.status(404).json({
        success: false,
        message: 'Partner profile not found',
      });
    }

    // Get portfolio items
    const portfolioItems = await db.select()
      .from(portfolios)
      .where(eq(portfolios.partnerId, partnerProfile[0].id))
      .orderBy(portfolios.displayOrder, portfolios.createdAt);

    res.json({
      success: true,
      data: {
        portfolioItems,
      },
    });
  } catch (error) {
    logger.error('Get portfolio items error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

// Update portfolio item
export const updatePortfolioItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, imageUrl, category, displayOrder } = req.body;
    const userId = req.user.id;

    // Get partner profile
    const partnerProfile = await db.select().from(partnerProfiles).where(eq(partnerProfiles.userId, userId)).limit(1);

    if (!partnerProfile.length) {
      return res.status(404).json({
        success: false,
        message: 'Partner profile not found',
      });
    }

    // Check if portfolio item exists and belongs to this partner
    const existingItem = await db.select()
      .from(portfolios)
      .where(and(
        eq(portfolios.id, parseInt(id)),
        eq(portfolios.partnerId, partnerProfile[0].id)
      ))
      .limit(1);

    if (!existingItem.length) {
      return res.status(404).json({
        success: false,
        message: 'Portfolio item not found',
      });
    }

    // Update portfolio item
    const updatedItem = await db.update(portfolios)
      .set({
        title,
        description,
        imageUrl,
        category,
        displayOrder,
        updatedAt: new Date(),
      })
      .where(eq(portfolios.id, parseInt(id)))
      .returning();

    logger.info(`Portfolio item ${id} updated for partner: ${userId}`);

    res.json({
      success: true,
      message: 'Portfolio item updated successfully',
      data: {
        portfolioItem: updatedItem[0],
      },
    });
  } catch (error) {
    logger.error('Update portfolio item error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

// Delete portfolio item
export const deletePortfolioItem = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Get partner profile
    const partnerProfile = await db.select().from(partnerProfiles).where(eq(partnerProfiles.userId, userId)).limit(1);

    if (!partnerProfile.length) {
      return res.status(404).json({
        success: false,
        message: 'Partner profile not found',
      });
    }

    // Check if portfolio item exists and belongs to this partner
    const existingItem = await db.select()
      .from(portfolios)
      .where(and(
        eq(portfolios.id, parseInt(id)),
        eq(portfolios.partnerId, partnerProfile[0].id)
      ))
      .limit(1);

    if (!existingItem.length) {
      return res.status(404).json({
        success: false,
        message: 'Portfolio item not found',
      });
    }

    // Delete portfolio item
    await db.delete(portfolios).where(eq(portfolios.id, parseInt(id)));

    logger.info(`Portfolio item ${id} deleted for partner: ${userId}`);

    res.json({
      success: true,
      message: 'Portfolio item deleted successfully',
    });
  } catch (error) {
    logger.error('Delete portfolio item error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};
