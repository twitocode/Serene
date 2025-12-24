ALTER TABLE "verification" ALTER COLUMN "updated_at" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "profile" ALTER COLUMN "updated_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "checkins" ADD COLUMN "user_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "profile" ADD COLUMN "koala_color" text DEFAULT '#5EEAD4';--> statement-breakpoint
ALTER TABLE "profile" ADD COLUMN "user_id" text;--> statement-breakpoint
ALTER TABLE "safety-plan" ADD COLUMN "user_id" text;--> statement-breakpoint
ALTER TABLE "checkins" ADD CONSTRAINT "checkins_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profile" ADD CONSTRAINT "profile_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "safety-plan" ADD CONSTRAINT "safety-plan_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "account" DROP COLUMN "access_token_expires_at";--> statement-breakpoint
ALTER TABLE "account" DROP COLUMN "refresh_token_expires_at";--> statement-breakpoint
ALTER TABLE "account" DROP COLUMN "scope";--> statement-breakpoint
ALTER TABLE "achievements" DROP COLUMN "description";--> statement-breakpoint
ALTER TABLE "achievements" DROP COLUMN "created_at";--> statement-breakpoint
ALTER TABLE "profile" DROP COLUMN "created_at";--> statement-breakpoint
ALTER TABLE "safety-plan" DROP COLUMN "created_at";--> statement-breakpoint
ALTER TABLE "safety-plan" DROP COLUMN "updated_at";