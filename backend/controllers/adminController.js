import { db } from '../config/database.js';
import { 
  users, 
  partnerProfiles, 
  inquiries, 
  reviews, 
  categories, 
  locations,
  leadAssignments 
} from '../models/schema.js';
import { eq, count, and, desc } from 'drizzle-orm';
import logger from '../utils/logger.js';

// Get dashboard KPIs
export const getDashboardKPIs = async (req, res) => {
  try {
    // Get total counts
    const [
      totalClients,
      totalPartners,
      pendingVerifications,
      totalInquiries,
      totalReviews,
    ] = await Promise.all([
      db.select({ count: count() }).from(users).where(eq(users.role, 'client')),
      db.select({ count: count() }).from(users).where(eq(users.role, 'partner')),
      db.select({ count: count() }).from(partnerProfiles).where(eq(partnerProfiles.verificationStatus, 'pending')),
      db.select({ count: count() }).from(inquiries),
      db.select({ count: count() }).from(reviews),
    ]);

    // Get recent activity counts (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [
      recentClients,
      recentPartners,
      recentInquiries,
    ] = await Promise.all([
      db.select({ count: count() }).from(users).where(
        and(
          eq(users.role, 'client'),
          // Note: Using a simple comparison since drizzle-orm might not have gte function
        )
      ),
      db.select({ count: count() }).from(users).where(
        and(
          eq(users.role, 'partner'),
        )
      ),
      db.select({ count: count() }).from(inquiries),
    ]);

    const kpis = {
      totalUsers: {
        clients: totalClients[0].count,
        partners: totalPartners[0].count,
        total: totalClients[0].count + totalPartners[0].count,
      },
      verifications: {
        pending: pendingVerifications[0].count,
      },
      inquiries: {
        total: totalInquiries[0].count,
        recent: recentInquiries[0].count,
      },
      reviews: {
        total: totalReviews[0].count,
      },
      recentActivity: {
        newClients: recentClients[0].count,
        newPartners: recentPartners[0].count,
        newInquiries: recentInquiries[0].count,
      },
    };

    logger.info('Admin dashboard KPIs fetched');

    res.json({
      success: true,
      data: { kpis },
    });
  } catch (error) {
    logger.error('Get dashboard KPIs error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

// Get pending partner verifications
export const getPendingVerifications = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const pendingPartners = await db.select({
      id: partnerProfiles.id,
      businessName: partnerProfiles.businessName,
      description: partnerProfiles.description,
      experience: partnerProfiles.experience,
      basePrice: partnerProfiles.basePrice,
      serviceCategories: partnerProfiles.serviceCategories,
      aadharNumber: partnerProfiles.aadharNumber,
      panNumber: partnerProfiles.panNumber,
      gstNumber: partnerProfiles.gstNumber,
      verificationStatus: partnerProfiles.verificationStatus,
      verificationComment: partnerProfiles.verificationComment,
      createdAt: partnerProfiles.createdAt,
      user: {
        id: users.id,
        email: users.email,
        firstName: users.firstName,
        lastName: users.lastName,
        phone: users.phone,
        city: users.city,
      },
    })
    .from(partnerProfiles)
    .innerJoin(users, eq(partnerProfiles.userId, users.id))
    .where(eq(partnerProfiles.verificationStatus, 'pending'))
    .orderBy(desc(partnerProfiles.createdAt))
    .limit(limit)
    .offset(offset);

    // Parse service categories
    const partnersWithParsedCategories = pendingPartners.map(partner => ({
      ...partner,
      serviceCategories: JSON.parse(partner.serviceCategories || '[]'),
    }));

    res.json({
      success: true,
      data: {
        pendingVerifications: partnersWithParsedCategories,
        pagination: {
          page,
          limit,
          total: pendingPartners.length,
        },
      },
    });
  } catch (error) {
    logger.error('Get pending verifications error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

// Verify partner (approve/reject)
export const verifyPartner = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, comment } = req.body;

    // Validate status
    if (!['verified', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status must be either verified or rejected',
      });
    }

    // Check if partner profile exists
    const partnerProfile = await db.select()
      .from(partnerProfiles)
      .where(eq(partnerProfiles.id, parseInt(id)))
      .limit(1);

    if (!partnerProfile.length) {
      return res.status(404).json({
        success: false,
        message: 'Partner profile not found',
      });
    }

    // Update verification status
    const updatedProfile = await db.update(partnerProfiles)
      .set({
        verificationStatus: status,
        verificationComment: comment,
        updatedAt: new Date(),
      })
      .where(eq(partnerProfiles.id, parseInt(id)))
      .returning();

    logger.info(`Partner ${id} verification status updated to: ${status} by admin`);

    res.json({
      success: true,
      message: `Partner ${status} successfully`,
      data: {
        profile: updatedProfile[0],
      },
    });
  } catch (error) {
    logger.error('Verify partner error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

// Get all reviews for moderation
export const getReviewsForModeration = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const { moderated } = req.query;

    let whereCondition = [];
    if (moderated !== undefined) {
      whereCondition.push(eq(reviews.isModerated, moderated === 'true'));
    }

    const reviewsData = await db.select({
      id: reviews.id,
      rating: reviews.rating,
      comment: reviews.comment,
      isModerated: reviews.isModerated,
      isVisible: reviews.isVisible,
      createdAt: reviews.createdAt,
      client: {
        id: users.id,
        firstName: users.firstName,
        lastName: users.lastName,
        email: users.email,
      },
      partner: {
        id: partnerProfiles.id,
        businessName: partnerProfiles.businessName,
      },
    })
    .from(reviews)
    .innerJoin(users, eq(reviews.clientId, users.id))
    .innerJoin(partnerProfiles, eq(reviews.partnerId, partnerProfiles.id))
    .where(whereCondition.length > 0 ? and(...whereCondition) : undefined)
    .orderBy(desc(reviews.createdAt))
    .limit(limit)
    .offset(offset);

    res.json({
      success: true,
      data: {
        reviews: reviewsData,
        pagination: {
          page,
          limit,
          total: reviewsData.length,
        },
      },
    });
  } catch (error) {
    logger.error('Get reviews for moderation error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

// Moderate review (hide/show)
export const moderateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { isVisible, isModerated = true } = req.body;

    // Check if review exists
    const review = await db.select()
      .from(reviews)
      .where(eq(reviews.id, parseInt(id)))
      .limit(1);

    if (!review.length) {
      return res.status(404).json({
        success: false,
        message: 'Review not found',
      });
    }

    // Update review moderation status
    const updatedReview = await db.update(reviews)
      .set({
        isVisible: isVisible !== undefined ? isVisible : review[0].isVisible,
        isModerated,
        updatedAt: new Date(),
      })
      .where(eq(reviews.id, parseInt(id)))
      .returning();

    logger.info(`Review ${id} moderated by admin`);

    res.json({
      success: true,
      message: 'Review moderated successfully',
      data: {
        review: updatedReview[0],
      },
    });
  } catch (error) {
    logger.error('Moderate review error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

// Delete review
export const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if review exists
    const review = await db.select()
      .from(reviews)
      .where(eq(reviews.id, parseInt(id)))
      .limit(1);

    if (!review.length) {
      return res.status(404).json({
        success: false,
        message: 'Review not found',
      });
    }

    // Delete review
    await db.delete(reviews).where(eq(reviews.id, parseInt(id)));

    logger.info(`Review ${id} deleted by admin`);

    res.json({
      success: true,
      message: 'Review deleted successfully',
    });
  } catch (error) {
    logger.error('Delete review error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

// Manage categories - Get all
export const getCategories = async (req, res) => {
  try {
    const categoriesData = await db.select().from(categories).orderBy(categories.name);

    res.json({
      success: true,
      data: {
        categories: categoriesData,
      },
    });
  } catch (error) {
    logger.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

// Create category
export const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    // Check if category already exists
    const existingCategory = await db.select()
      .from(categories)
      .where(eq(categories.name, name))
      .limit(1);

    if (existingCategory.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Category already exists',
      });
    }

    // Create category
    const newCategory = await db.insert(categories).values({
      name,
      description,
    }).returning();

    logger.info(`Category created: ${name}`);

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: {
        category: newCategory[0],
      },
    });
  } catch (error) {
    logger.error('Create category error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

// Update category
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, isActive } = req.body;

    // Check if category exists
    const category = await db.select()
      .from(categories)
      .where(eq(categories.id, parseInt(id)))
      .limit(1);

    if (!category.length) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    // Update category
    const updatedCategory = await db.update(categories)
      .set({
        name: name || category[0].name,
        description: description !== undefined ? description : category[0].description,
        isActive: isActive !== undefined ? isActive : category[0].isActive,
        updatedAt: new Date(),
      })
      .where(eq(categories.id, parseInt(id)))
      .returning();

    logger.info(`Category ${id} updated`);

    res.json({
      success: true,
      message: 'Category updated successfully',
      data: {
        category: updatedCategory[0],
      },
    });
  } catch (error) {
    logger.error('Update category error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

// Delete category
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if category exists
    const category = await db.select()
      .from(categories)
      .where(eq(categories.id, parseInt(id)))
      .limit(1);

    if (!category.length) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    // Delete category
    await db.delete(categories).where(eq(categories.id, parseInt(id)));

    logger.info(`Category ${id} deleted`);

    res.json({
      success: true,
      message: 'Category deleted successfully',
    });
  } catch (error) {
    logger.error('Delete category error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

// Manage locations - Get all
export const getLocations = async (req, res) => {
  try {
    const locationsData = await db.select().from(locations).orderBy(locations.state, locations.city);

    res.json({
      success: true,
      data: {
        locations: locationsData,
      },
    });
  } catch (error) {
    logger.error('Get locations error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

// Create location
export const createLocation = async (req, res) => {
  try {
    const { city, state } = req.body;

    // Create location
    const newLocation = await db.insert(locations).values({
      city,
      state,
    }).returning();

    logger.info(`Location created: ${city}, ${state}`);

    res.status(201).json({
      success: true,
      message: 'Location created successfully',
      data: {
        location: newLocation[0],
      },
    });
  } catch (error) {
    logger.error('Create location error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

// Update location
export const updateLocation = async (req, res) => {
  try {
    const { id } = req.params;
    const { city, state, isActive } = req.body;

    // Check if location exists
    const location = await db.select()
      .from(locations)
      .where(eq(locations.id, parseInt(id)))
      .limit(1);

    if (!location.length) {
      return res.status(404).json({
        success: false,
        message: 'Location not found',
      });
    }

    // Update location
    const updatedLocation = await db.update(locations)
      .set({
        city: city || location[0].city,
        state: state || location[0].state,
        isActive: isActive !== undefined ? isActive : location[0].isActive,
        updatedAt: new Date(),
      })
      .where(eq(locations.id, parseInt(id)))
      .returning();

    logger.info(`Location ${id} updated`);

    res.json({
      success: true,
      message: 'Location updated successfully',
      data: {
        location: updatedLocation[0],
      },
    });
  } catch (error) {
    logger.error('Update location error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

// Delete location
export const deleteLocation = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if location exists
    const location = await db.select()
      .from(locations)
      .where(eq(locations.id, parseInt(id)))
      .limit(1);

    if (!location.length) {
      return res.status(404).json({
        success: false,
        message: 'Location not found',
      });
    }

    // Delete location
    await db.delete(locations).where(eq(locations.id, parseInt(id)));

    logger.info(`Location ${id} deleted`);

    res.json({
      success: true,
      message: 'Location deleted successfully',
    });
  } catch (error) {
    logger.error('Delete location error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

// Promote partner as featured
export const promotePartner = async (req, res) => {
  try {
    const { id } = req.params;
    const { isFeatured } = req.body;

    // Check if partner profile exists
    const partnerProfile = await db.select()
      .from(partnerProfiles)
      .where(eq(partnerProfiles.id, parseInt(id)))
      .limit(1);

    if (!partnerProfile.length) {
      return res.status(404).json({
        success: false,
        message: 'Partner profile not found',
      });
    }

    // Update featured status
    const updatedProfile = await db.update(partnerProfiles)
      .set({
        isFeatured: isFeatured !== undefined ? isFeatured : !partnerProfile[0].isFeatured,
        updatedAt: new Date(),
      })
      .where(eq(partnerProfiles.id, parseInt(id)))
      .returning();

    logger.info(`Partner ${id} featured status updated to: ${updatedProfile[0].isFeatured}`);

    res.json({
      success: true,
      message: `Partner ${updatedProfile[0].isFeatured ? 'promoted as featured' : 'removed from featured'}`,
      data: {
        profile: updatedProfile[0],
      },
    });
  } catch (error) {
    logger.error('Promote partner error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};
