CREATE TABLE "job_board_checks" (
	"id" serial PRIMARY KEY NOT NULL,
	"company_id" integer NOT NULL,
	"checked_at" timestamp DEFAULT now() NOT NULL,
	"status" text NOT NULL,
	"error" text,
	"colorado_count" integer DEFAULT 0 NOT NULL,
	"all_locations_count" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
ALTER TABLE "companies" ADD COLUMN "ats_type" text;--> statement-breakpoint
ALTER TABLE "companies" ADD COLUMN "ats_slug" text;--> statement-breakpoint
ALTER TABLE "companies" ADD COLUMN "ats_remote_nationwide" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "job_board_checks" ADD CONSTRAINT "job_board_checks_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE no action ON UPDATE no action;