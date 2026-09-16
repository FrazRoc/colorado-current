CREATE TABLE "rejected_companies" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"reason" text NOT NULL,
	"source_url" text,
	"rejected_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "rejected_companies_name_unique" UNIQUE("name")
);
