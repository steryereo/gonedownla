CREATE TABLE IF NOT EXISTS "statuses" (
	"id" serial PRIMARY KEY NOT NULL,
	"status" varchar(255) NOT NULL,
	"within_hours" boolean,
	"created_at" timestamp with time zone DEFAULT now()
);
