CREATE TABLE "pastes" (
	"id" uuid PRIMARY KEY NOT NULL,
	"content" text NOT NULL,
	"expires_at" timestamp,
	"max_views" integer,
	"views" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
