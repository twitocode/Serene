-- Make timestamp fields nullable in account table for Better Auth compatibility
ALTER TABLE "account" ALTER COLUMN "access_token_expires_at" DROP NOT NULL;
ALTER TABLE "account" ALTER COLUMN "refresh_token_expires_at" DROP NOT NULL;