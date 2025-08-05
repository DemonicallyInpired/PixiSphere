import { pgTable, serial, varchar, text, timestamp, boolean, integer, decimal, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enums
export const userRoleEnum = pgEnum('user_role', ['client', 'partner', 'admin']);
export const verificationStatusEnum = pgEnum('verification_status', ['pending', 'verified', 'rejected']);
export const inquiryStatusEnum = pgEnum('inquiry_status', ['new', 'responded', 'booked', 'closed']);
export const categoryEnum = pgEnum('category', ['wedding', 'maternity', 'portrait', 'event', 'commercial', 'fashion']);

// Users table
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  role: userRoleEnum('role').notNull().default('client'),
  firstName: varchar('first_name', { length: 100 }),
  lastName: varchar('last_name', { length: 100 }),
  phone: varchar('phone', { length: 15 }),
  city: varchar('city', { length: 100 }),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Partner profiles table
export const partnerProfiles = pgTable('partner_profiles', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  businessName: varchar('business_name', { length: 255 }),
  description: text('description'),
  experience: integer('experience'), // years of experience
  basePrice: decimal('base_price', { precision: 10, scale: 2 }),
  serviceCategories: text('service_categories'), // JSON string of categories
  aadharNumber: varchar('aadhar_number', { length: 12 }),
  panNumber: varchar('pan_number', { length: 10 }),
  gstNumber: varchar('gst_number', { length: 15 }),
  verificationStatus: verificationStatusEnum('verification_status').default('pending'),
  verificationComment: text('verification_comment'),
  isFeatured: boolean('is_featured').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Portfolio table
export const portfolios = pgTable('portfolios', {
  id: serial('id').primaryKey(),
  partnerId: integer('partner_id').references(() => partnerProfiles.id).notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  imageUrl: varchar('image_url', { length: 500 }).notNull(),
  category: categoryEnum('category').notNull(),
  displayOrder: integer('display_order').default(0),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Inquiries table
export const inquiries = pgTable('inquiries', {
  id: serial('id').primaryKey(),
  clientId: integer('client_id').references(() => users.id).notNull(),
  category: categoryEnum('category').notNull(),
  eventDate: timestamp('event_date'),
  budget: decimal('budget', { precision: 10, scale: 2 }),
  city: varchar('city', { length: 100 }).notNull(),
  description: text('description'),
  referenceImageUrl: varchar('reference_image_url', { length: 500 }),
  status: inquiryStatusEnum('status').default('new'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Lead assignments table
export const leadAssignments = pgTable('lead_assignments', {
  id: serial('id').primaryKey(),
  inquiryId: integer('inquiry_id').references(() => inquiries.id).notNull(),
  partnerId: integer('partner_id').references(() => partnerProfiles.id).notNull(),
  isResponded: boolean('is_responded').default(false),
  responseMessage: text('response_message'),
  quotedPrice: decimal('quoted_price', { precision: 10, scale: 2 }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Reviews table (for admin moderation)
export const reviews = pgTable('reviews', {
  id: serial('id').primaryKey(),
  clientId: integer('client_id').references(() => users.id).notNull(),
  partnerId: integer('partner_id').references(() => partnerProfiles.id).notNull(),
  rating: integer('rating').notNull(), // 1-5 stars
  comment: text('comment'),
  isModerated: boolean('is_moderated').default(false),
  isVisible: boolean('is_visible').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Categories table (for admin management)
export const categories = pgTable('categories', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull().unique(),
  description: text('description'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Locations table (for admin management)
export const locations = pgTable('locations', {
  id: serial('id').primaryKey(),
  city: varchar('city', { length: 100 }).notNull(),
  state: varchar('state', { length: 100 }).notNull(),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ one, many }) => ({
  partnerProfile: one(partnerProfiles, {
    fields: [users.id],
    references: [partnerProfiles.userId],
  }),
  inquiries: many(inquiries),
  reviews: many(reviews),
}));

export const partnerProfilesRelations = relations(partnerProfiles, ({ one, many }) => ({
  user: one(users, {
    fields: [partnerProfiles.userId],
    references: [users.id],
  }),
  portfolios: many(portfolios),
  leadAssignments: many(leadAssignments),
  reviews: many(reviews),
}));

export const portfoliosRelations = relations(portfolios, ({ one }) => ({
  partner: one(partnerProfiles, {
    fields: [portfolios.partnerId],
    references: [partnerProfiles.id],
  }),
}));

export const inquiriesRelations = relations(inquiries, ({ one, many }) => ({
  client: one(users, {
    fields: [inquiries.clientId],
    references: [users.id],
  }),
  leadAssignments: many(leadAssignments),
}));

export const leadAssignmentsRelations = relations(leadAssignments, ({ one }) => ({
  inquiry: one(inquiries, {
    fields: [leadAssignments.inquiryId],
    references: [inquiries.id],
  }),
  partner: one(partnerProfiles, {
    fields: [leadAssignments.partnerId],
    references: [partnerProfiles.id],
  }),
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
  client: one(users, {
    fields: [reviews.clientId],
    references: [users.id],
  }),
  partner: one(partnerProfiles, {
    fields: [reviews.partnerId],
    references: [partnerProfiles.id],
  }),
}));
