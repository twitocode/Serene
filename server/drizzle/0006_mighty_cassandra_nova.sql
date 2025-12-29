CREATE TYPE "public"."gender" AS ENUM('Male', 'Female', 'Non-Binary', 'Prefer not to say');--> statement-breakpoint
CREATE TABLE "school" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text
);
--> statement-breakpoint
ALTER TABLE "profile" ALTER COLUMN "koala_color" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "profile" ALTER COLUMN "current_streak" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "profile" ALTER COLUMN "longest_streak" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "profile" ADD COLUMN "gender" "gender" NOT NULL;--> statement-breakpoint
ALTER TABLE "profile" ADD COLUMN "pronouns" varchar(50) NOT NULL;--> statement-breakpoint
ALTER TABLE "profile" ADD COLUMN "dob" date NOT NULL;--> statement-breakpoint
ALTER TABLE "profile" ADD COLUMN "school_id" text;--> statement-breakpoint
ALTER TABLE "profile" ADD CONSTRAINT "profile_school_id_school_id_fk" FOREIGN KEY ("school_id") REFERENCES "public"."school"("id") ON DELETE set null ON UPDATE no action;