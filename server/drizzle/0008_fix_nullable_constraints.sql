-- Directly modify the columns to be nullable
ALTER TABLE "account" ALTER COLUMN "access_token_expires_at" DROP NOT NULL;
ALTER TABLE "account" ALTER COLUMN "refresh_token_expires_at" DROP NOT NULL;