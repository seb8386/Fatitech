import {
  pgTable,
  text,
  varchar,
  integer,
  bigint,
  boolean,
  timestamp,
  jsonb,
  uuid,
  pgEnum,
  decimal,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ─── Enums ─────────────────────────────────────────────────────────────────

export const userRoleEnum = pgEnum("user_role", [
  "super_admin",
  "admin",
  "user",
]);

export const subscriptionPlanEnum = pgEnum("subscription_plan", [
  "free",
  "starter",
  "pro",
  "business",
  "enterprise",
]);

export const subscriptionStatusEnum = pgEnum("subscription_status", [
  "active",
  "inactive",
  "cancelled",
  "past_due",
  "trialing",
]);

export const socialPlatformEnum = pgEnum("social_platform", [
  "tiktok",
  "youtube",
  "facebook",
  "instagram",
  "twitter",
  "linkedin",
  "pinterest",
  "threads",
]);

export const postStatusEnum = pgEnum("post_status", [
  "draft",
  "scheduled",
  "published",
  "failed",
  "cancelled",
]);

export const postTypeEnum = pgEnum("post_type", [
  "text",
  "image",
  "video",
  "reel",
  "story",
  "short",
  "carousel",
  "community",
]);

export const notificationTypeEnum = pgEnum("notification_type", [
  "post_published",
  "post_failed",
  "comment_received",
  "ai_recommendation",
  "subscription_alert",
  "security_alert",
  "system",
]);

export const campaignStatusEnum = pgEnum("campaign_status", [
  "draft",
  "active",
  "paused",
  "completed",
  "cancelled",
]);

export const ticketStatusEnum = pgEnum("ticket_status", [
  "open",
  "in_progress",
  "resolved",
  "closed",
]);

export const aiTaskTypeEnum = pgEnum("ai_task_type", [
  "generate_ideas",
  "create_script",
  "generate_description",
  "generate_hashtags",
  "generate_title",
  "analyze_trends",
  "schedule_optimization",
  "comment_response",
  "thumbnail_generation",
  "content_calendar",
]);

// ─── Users ──────────────────────────────────────────────────────────────────

export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 255 }),
    email: varchar("email", { length: 255 }).notNull(),
    passwordHash: text("password_hash"),
    avatarUrl: text("avatar_url"),
    role: userRoleEnum("role").notNull().default("user"),
    isActive: boolean("is_active").notNull().default(true),
    mustChangePassword: boolean("must_change_password").notNull().default(false),
    language: varchar("language", { length: 10 }).default("fr"),
    aiModel: varchar("ai_model", { length: 100 }),
    timezone: varchar("timezone", { length: 100 }).default("UTC"),
    bio: text("bio"),
    phone: varchar("phone", { length: 50 }),
    domain: varchar("domain", { length: 255 }),
    currency: varchar("currency", { length: 3 }).default("USD"),
    firstName: varchar("first_name", { length: 100 }),
    lastName: varchar("last_name", { length: 100 }),
    avatar: text("avatar"),
    isEmailVerified: boolean("is_email_verified").notNull().default(false),
    twoFactorEnabled: boolean("two_factor_enabled").notNull().default(false),
    twoFactorSecret: text("two_factor_secret"),
    adminId: uuid("admin_id"),
    targetAudience: text("target_audience"),
    objectives: text("objectives"),
    lastLoginAt: timestamp("last_login_at"),
    lastLoginIp: varchar("last_login_ip", { length: 45 }),
    suspendedAt: timestamp("suspended_at"),
    suspendedReason: text("suspended_reason"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (t) => [
    uniqueIndex("users_email_idx").on(t.email),
    index("users_role_idx").on(t.role),
    index("users_admin_id_idx").on(t.adminId),
  ]
);

// ─── Workspaces (multi-tenant SaaS) ─────────────────────────────────────────

export const workspaces = pgTable(
  "workspaces",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    ownerId: uuid("owner_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 255 }).notNull().default("Mon espace"),
    slug: varchar("slug", { length: 255 }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (t) => [
    uniqueIndex("workspaces_owner_id_idx").on(t.ownerId),
    index("workspaces_slug_idx").on(t.slug),
  ]
);

// ─── OAuth Accounts ──────────────────────────────────────────────────────────

export const oauthAccounts = pgTable(
  "oauth_accounts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    provider: varchar("provider", { length: 50 }).notNull(),
    providerAccountId: text("provider_account_id").notNull(),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    expiresAt: timestamp("expires_at"),
    scope: text("scope"),
    tokenType: varchar("token_type", { length: 50 }).default("Bearer"),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [
    uniqueIndex("oauth_provider_account_idx").on(
      t.provider,
      t.providerAccountId
    ),
    index("oauth_user_id_idx").on(t.userId),
    index("oauth_user_provider_idx").on(t.userId, t.provider),
  ]
);

// ─── Sessions ────────────────────────────────────────────────────────────────

export const sessions = pgTable(
  "sessions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    token: text("token").notNull(),
    ipAddress: varchar("ip_address", { length: 45 }),
    userAgent: text("user_agent"),
    lastActiveAt: timestamp("last_active_at"),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [
    uniqueIndex("sessions_token_idx").on(t.token),
    index("sessions_user_id_idx").on(t.userId),
  ]
);

// ─── Plans ───────────────────────────────────────────────────────────────────

export const plans = pgTable(
  "plans",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 255 }).notNull(),
    priceUsd: decimal("price_usd", { precision: 10, scale: 2 }).notNull(),
    accountsLimit: integer("accounts_limit").notNull().default(2),
    postsLimit: integer("posts_limit").notNull().default(30),
    aiCreditsLimit: integer("ai_credits_limit").notNull().default(50),
    isPopular: boolean("is_popular").notNull().default(false),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (t) => [
    uniqueIndex("plans_name_idx").on(t.name),
    index("plans_is_active_idx").on(t.isActive),
  ]
);

// ─── Subscriptions ───────────────────────────────────────────────────────────

export const subscriptions = pgTable(
  "subscriptions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    planId: uuid("plan_id").references(() => plans.id, { onDelete: "restrict" }),
    plan: subscriptionPlanEnum("plan").notNull().default("free"),
    status: subscriptionStatusEnum("status").notNull().default("active"),
    stripeCustomerId: text("stripe_customer_id"),
    stripeSubscriptionId: text("stripe_subscription_id"),
    paypalSubscriptionId: text("paypal_subscription_id"),
    currentPeriodStart: timestamp("current_period_start"),
    currentPeriodEnd: timestamp("current_period_end"),
    maxSocialAccounts: integer("max_social_accounts").notNull().default(2),
    maxPostsPerMonth: integer("max_posts_per_month").notNull().default(30),
    aiCreditsPerMonth: integer("ai_credits_per_month").notNull().default(50),
    usedAiCredits: integer("used_ai_credits").notNull().default(0),
    cancelledAt: timestamp("cancelled_at"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (t) => [
    index("subscriptions_user_id_idx").on(t.userId),
    index("subscriptions_plan_id_idx").on(t.planId),
  ]
);

// ─── Social Accounts ─────────────────────────────────────────────────────────

export const socialAccounts = pgTable(
  "social_accounts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    platform: socialPlatformEnum("platform").notNull(),
    accountName: varchar("account_name", { length: 255 }).notNull(),
    accountId: text("account_id").notNull(),
    accountUrl: text("account_url"),
    avatar: text("avatar"),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    tokenExpiresAt: timestamp("token_expires_at"),
    isActive: boolean("is_active").notNull().default(true),
    followersCount: integer("followers_count").default(0),
    followingCount: integer("following_count").default(0),
    postsCount: integer("posts_count").default(0),
    lastSyncAt: timestamp("last_sync_at"),
    metadata: jsonb("metadata"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (t) => [
    index("social_accounts_user_id_idx").on(t.userId),
    index("social_accounts_platform_idx").on(t.platform),
  ]
);

// ─── Posts ───────────────────────────────────────────────────────────────────

export const posts = pgTable(
  "posts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    socialAccountId: uuid("social_account_id").references(
      () => socialAccounts.id,
      { onDelete: "set null" }
    ),
    title: text("title"),
    content: text("content").notNull(),
    hashtags: text("hashtags").array(),
    mediaUrls: text("media_urls").array(),
    thumbnailUrl: text("thumbnail_url"),
    postType: postTypeEnum("post_type").notNull().default("text"),
    status: postStatusEnum("status").notNull().default("draft"),
    scheduledAt: timestamp("scheduled_at"),
    publishedAt: timestamp("published_at"),
    externalPostId: text("external_post_id"),
    isAiGenerated: boolean("is_ai_generated").notNull().default(false),
    isAutoRepost: boolean("is_auto_repost").notNull().default(false),
    originalPostId: uuid("original_post_id"),
    seoTitle: text("seo_title"),
    seoDescription: text("seo_description"),
    targetAudience: text("target_audience"),
    errorMessage: text("error_message"),
    viewsCount: integer("views_count").default(0),
    likesCount: integer("likes_count").default(0),
    commentsCount: integer("comments_count").default(0),
    sharesCount: integer("shares_count").default(0),
    metadata: jsonb("metadata"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (t) => [
    index("posts_user_id_idx").on(t.userId),
    index("posts_social_account_id_idx").on(t.socialAccountId),
    index("posts_status_idx").on(t.status),
    index("posts_scheduled_at_idx").on(t.scheduledAt),
  ]
);

// ─── Comments ────────────────────────────────────────────────────────────────

export const comments = pgTable(
  "comments",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    postId: uuid("post_id")
      .notNull()
      .references(() => posts.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    externalCommentId: text("external_comment_id"),
    authorName: varchar("author_name", { length: 255 }),
    authorAvatar: text("author_avatar"),
    content: text("content").notNull(),
    isSpam: boolean("is_spam").notNull().default(false),
    isToxic: boolean("is_toxic").notNull().default(false),
    isHidden: boolean("is_hidden").notNull().default(false),
    isImportant: boolean("is_important").notNull().default(false),
    aiResponse: text("ai_response"),
    respondedAt: timestamp("responded_at"),
    platform: socialPlatformEnum("platform"),
    sentimentScore: decimal("sentiment_score", { precision: 3, scale: 2 }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [
    index("comments_post_id_idx").on(t.postId),
    index("comments_user_id_idx").on(t.userId),
  ]
);

// ─── Analytics ───────────────────────────────────────────────────────────────

export const analytics = pgTable(
  "analytics",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    socialAccountId: uuid("social_account_id").references(
      () => socialAccounts.id,
      { onDelete: "cascade" }
    ),
    postId: uuid("post_id").references(() => posts.id, { onDelete: "cascade" }),
    date: timestamp("date").notNull(),
    followersCount: integer("followers_count").default(0),
    followersGrowth: integer("followers_growth").default(0),
    viewsCount: bigint("views_count", { mode: "number" }).default(0),
    likesCount: integer("likes_count").default(0),
    commentsCount: integer("comments_count").default(0),
    sharesCount: integer("shares_count").default(0),
    impressionsCount: bigint("impressions_count", { mode: "number" }).default(
      0
    ),
    reachCount: bigint("reach_count", { mode: "number" }).default(0),
    engagementRate: decimal("engagement_rate", { precision: 5, scale: 2 }),
    watchTimeMinutes: integer("watch_time_minutes").default(0),
    revenueUsd: decimal("revenue_usd", { precision: 10, scale: 2 }),
    platform: socialPlatformEnum("platform"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [
    index("analytics_user_id_idx").on(t.userId),
    index("analytics_date_idx").on(t.date),
    index("analytics_social_account_id_idx").on(t.socialAccountId),
  ]
);

// ─── AI Tasks ────────────────────────────────────────────────────────────────

export const aiTasks = pgTable(
  "ai_tasks",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    taskType: aiTaskTypeEnum("task_type").notNull(),
    prompt: text("prompt"),
    result: jsonb("result"),
    tokensUsed: integer("tokens_used").default(0),
    model: varchar("model", { length: 100 }),
    status: varchar("status", { length: 50 }).notNull().default("pending"),
    errorMessage: text("error_message"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    completedAt: timestamp("completed_at"),
  },
  (t) => [index("ai_tasks_user_id_idx").on(t.userId)]
);

// ─── Notifications ───────────────────────────────────────────────────────────

export const notifications = pgTable(
  "notifications",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: notificationTypeEnum("type").notNull(),
    title: varchar("title", { length: 255 }).notNull(),
    message: text("message").notNull(),
    isRead: boolean("is_read").notNull().default(false),
    actionUrl: text("action_url"),
    metadata: jsonb("metadata"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [
    index("notifications_user_id_idx").on(t.userId),
    index("notifications_is_read_idx").on(t.isRead),
  ]
);

// ─── Campaigns ───────────────────────────────────────────────────────────────

export const campaigns = pgTable(
  "campaigns",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 255 }).notNull(),
    description: text("description"),
    status: campaignStatusEnum("status").notNull().default("draft"),
    platform: socialPlatformEnum("platform"),
    budget: decimal("budget", { precision: 10, scale: 2 }),
    budgetSpent: decimal("budget_spent", { precision: 10, scale: 2 }).default(
      "0"
    ),
    targetAudience: jsonb("target_audience"),
    objectives: text("objectives"),
    startDate: timestamp("start_date"),
    endDate: timestamp("end_date"),
    impressions: bigint("impressions", { mode: "number" }).default(0),
    clicks: integer("clicks").default(0),
    conversions: integer("conversions").default(0),
    ctr: decimal("ctr", { precision: 5, scale: 2 }),
    roi: decimal("roi", { precision: 5, scale: 2 }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (t) => [index("campaigns_user_id_idx").on(t.userId)]
);

// ─── Payments ────────────────────────────────────────────────────────────────

export const paymentMethodEnum = pgEnum("payment_method", ["mpesa", "card", "paypal", "bank_transfer"]);
export const paymentStatusEnum = pgEnum("payment_status", ["pending", "completed", "failed", "refunded"]);

export const payments = pgTable(
  "payments",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
    currency: varchar("currency", { length: 3 }).notNull().default("KES"),
    method: paymentMethodEnum("method").notNull(),
    status: paymentStatusEnum("status").notNull().default("pending"),
    transactionRef: varchar("transaction_ref", { length: 255 }).notNull().unique(),
    phoneNumber: varchar("phone_number", { length: 20 }),
    metadata: jsonb("metadata"),
    completedAt: timestamp("completed_at"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (t) => [
    index("payments_user_id_idx").on(t.userId),
    index("payments_status_idx").on(t.status),
    index("payments_transaction_ref_idx").on(t.transactionRef),
  ]
);

// ─── Audit Logs ──────────────────────────────────────────────────────────────

export const auditLogs = pgTable(
  "audit_logs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    actorId: uuid("actor_id").references(() => users.id, { onDelete: "set null" }),
    action: varchar("action", { length: 255 }).notNull(),
    targetId: uuid("target_id"),
    details: jsonb("details"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [
    index("audit_logs_actor_id_idx").on(t.actorId),
    index("audit_logs_created_at_idx").on(t.createdAt),
  ]
);

// ─── Support Tickets ─────────────────────────────────────────────────────────

export const supportTickets = pgTable(
  "support_tickets",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    adminId: uuid("admin_id").references(() => users.id, {
      onDelete: "set null",
    }),
    subject: varchar("subject", { length: 255 }).notNull(),
    message: text("message").notNull(),
    status: ticketStatusEnum("status").notNull().default("open"),
    response: text("response"),
    respondedAt: timestamp("responded_at"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (t) => [
    index("support_tickets_user_id_idx").on(t.userId),
    index("support_tickets_admin_id_idx").on(t.adminId),
  ]
);

// ─── Content Calendar ────────────────────────────────────────────────────────

export const contentCalendar = pgTable(
  "content_calendar",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    postId: uuid("post_id").references(() => posts.id, { onDelete: "set null" }),
    title: varchar("title", { length: 255 }).notNull(),
    description: text("description"),
    platform: socialPlatformEnum("platform"),
    postType: postTypeEnum("post_type"),
    scheduledAt: timestamp("scheduled_at").notNull(),
    color: varchar("color", { length: 20 }).default("#6366f1"),
    isAiGenerated: boolean("is_ai_generated").notNull().default(false),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [
    index("content_calendar_user_id_idx").on(t.userId),
    index("content_calendar_scheduled_at_idx").on(t.scheduledAt),
  ]
);

// ─── AI Chat Messages ─────────────────────────────────────────────────────────

export const aiChatMessages = pgTable(
  "ai_chat_messages",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    role: varchar("role", { length: 20 }).notNull(),
    content: text("content").notNull(),
    tokensUsed: integer("tokens_used").default(0),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [index("ai_chat_messages_user_id_idx").on(t.userId)]
);

// ─── Relations ────────────────────────────────────────────────────────────────

export const usersRelations = relations(users, ({ many, one }) => ({
  oauthAccounts: many(oauthAccounts),
  sessions: many(sessions),
  subscription: one(subscriptions, {
    fields: [users.id],
    references: [subscriptions.userId],
  }),
  socialAccounts: many(socialAccounts),
  posts: many(posts),
  comments: many(comments),
  analytics: many(analytics),
  aiTasks: many(aiTasks),
  notifications: many(notifications),
  campaigns: many(campaigns),
  auditLogs: many(auditLogs),
  supportTickets: many(supportTickets),
  contentCalendar: many(contentCalendar),
  aiChatMessages: many(aiChatMessages),
}));

export const plansRelations = relations(plans, ({ many }) => ({
  subscriptions: many(subscriptions),
}));

export const socialAccountsRelations = relations(
  socialAccounts,
  ({ one, many }) => ({
    user: one(users, {
      fields: [socialAccounts.userId],
      references: [users.id],
    }),
    posts: many(posts),
    analytics: many(analytics),
  })
);

export const postsRelations = relations(posts, ({ one, many }) => ({
  user: one(users, { fields: [posts.userId], references: [users.id] }),
  socialAccount: one(socialAccounts, {
    fields: [posts.socialAccountId],
    references: [socialAccounts.id],
  }),
  comments: many(comments),
  analytics: many(analytics),
}));

export const subscriptionsRelations = relations(subscriptions, ({ one }) => ({
  user: one(users, {
    fields: [subscriptions.userId],
    references: [users.id],
  }),
  plan: one(plans, {
    fields: [subscriptions.planId],
    references: [plans.id],
  }),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id],
  }),
}));

export const analyticsRelations = relations(analytics, ({ one }) => ({
  user: one(users, { fields: [analytics.userId], references: [users.id] }),
  socialAccount: one(socialAccounts, {
    fields: [analytics.socialAccountId],
    references: [socialAccounts.id],
  }),
  post: one(posts, { fields: [analytics.postId], references: [posts.id] }),
}));
