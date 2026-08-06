-- Add new columns to users table
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "name" varchar(255);
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "avatar_url" text;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "must_change_password" boolean DEFAULT false NOT NULL;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "ai_model" varchar(100);
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "bio" text;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "phone" varchar(50);
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "currency" varchar(3) DEFAULT 'USD';

-- Add last_active_at column to sessions table
ALTER TABLE "sessions" ADD COLUMN IF NOT EXISTS "last_active_at" timestamp;

-- Rename ai_credits_used to used_ai_credits in subscriptions table
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'subscriptions' AND column_name = 'ai_credits_used') THEN
        ALTER TABLE "subscriptions" RENAME COLUMN "ai_credits_used" TO "used_ai_credits";
    END IF;
END $$;

-- Add plan_id column to subscriptions table
ALTER TABLE "subscriptions" ADD COLUMN IF NOT EXISTS "plan_id" uuid;

-- Create plans table
CREATE TABLE IF NOT EXISTS "plans" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"price_usd" numeric(10, 2) NOT NULL,
	"accounts_limit" integer DEFAULT 2 NOT NULL,
	"posts_limit" integer DEFAULT 30 NOT NULL,
	"ai_credits_limit" integer DEFAULT 50 NOT NULL,
	"is_popular" boolean DEFAULT false NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

-- Create indexes for plans table
CREATE UNIQUE INDEX IF NOT EXISTS "plans_name_idx" ON "plans" USING btree ("name");
CREATE INDEX IF NOT EXISTS "plans_is_active_idx" ON "plans" USING btree ("is_active");

-- Add foreign key constraint for subscriptions.plan_id
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_plan_id_plans_id_fk" 
FOREIGN KEY ("plan_id") REFERENCES "public"."plans"("id") ON DELETE restrict ON UPDATE no action;

-- Create index for subscriptions.plan_id
CREATE INDEX IF NOT EXISTS "subscriptions_plan_id_idx" ON "subscriptions" USING btree ("plan_id");

-- Update audit_logs table structure
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'audit_logs' AND column_name = 'user_id') THEN
        ALTER TABLE "audit_logs" RENAME COLUMN "user_id" TO "actor_id";
    END IF;
END $$;

-- Remove unused columns from audit_logs if they exist
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'audit_logs' AND column_name = 'resource') THEN
        ALTER TABLE "audit_logs" DROP COLUMN "resource";
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'audit_logs' AND column_name = 'resource_id') THEN
        ALTER TABLE "audit_logs" RENAME COLUMN "resource_id" TO "target_id";
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'audit_logs' AND column_name = 'ip_address') THEN
        ALTER TABLE "audit_logs" DROP COLUMN "ip_address";
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'audit_logs' AND column_name = 'user_agent') THEN
        ALTER TABLE "audit_logs" DROP COLUMN "user_agent";
    END IF;
END $$;

-- Create index for audit_logs.actor_id
DROP INDEX IF EXISTS "audit_logs_user_id_idx";
CREATE INDEX IF NOT EXISTS "audit_logs_actor_id_idx" ON "audit_logs" USING btree ("actor_id");

-- Insert default plans
INSERT INTO "plans" ("name", "price_usd", "accounts_limit", "posts_limit", "ai_credits_limit", "is_popular", "is_active")
VALUES 
    ('Free', 0.00, 2, 30, 50, false, true),
    ('Starter', 9.99, 5, 100, 500, false, true),
    ('Pro', 29.99, 10, 500, 2000, true, true),
    ('Business', 99.99, 25, 2000, 10000, false, true),
    ('Enterprise', 299.99, -1, -1, -1, false, true)
ON CONFLICT ("name") DO NOTHING;
