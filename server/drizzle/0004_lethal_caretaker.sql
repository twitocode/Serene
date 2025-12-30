ALTER TABLE "user" ALTER COLUMN "age" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "gender" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "pronouns" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "onboarding_completed" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "onboarding_step" integer DEFAULT 1 NOT NULL;