ALTER TABLE "school" ADD COLUMN "country_code" varchar(2) NOT NULL;--> statement-breakpoint
ALTER TABLE "school" ADD COLUMN "region_code" varchar(2);--> statement-breakpoint
ALTER TABLE "school" ADD COLUMN "city" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "country_code" varchar(2);