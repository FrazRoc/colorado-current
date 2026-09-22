CREATE TABLE "people" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"linkedin_url" text,
	"twitter_url" text,
	"website_url" text,
	"bio" text,
	"notes" text,
	"last_updated" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "people_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "people_roles" (
	"id" serial PRIMARY KEY NOT NULL,
	"person_id" integer NOT NULL,
	"company_id" integer NOT NULL,
	"title" text NOT NULL,
	"role_type" text NOT NULL,
	"is_current" boolean DEFAULT true NOT NULL,
	"start_date" text,
	"end_date" text,
	"source_url" text,
	"last_updated" text
);
--> statement-breakpoint
ALTER TABLE "people_roles" ADD CONSTRAINT "people_roles_person_id_people_id_fk" FOREIGN KEY ("person_id") REFERENCES "public"."people"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "people_roles" ADD CONSTRAINT "people_roles_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE no action ON UPDATE no action;