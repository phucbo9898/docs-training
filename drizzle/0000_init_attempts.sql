CREATE TABLE "attempts" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"exam_id" text NOT NULL,
	"mode" text DEFAULT 'exam' NOT NULL,
	"score" smallint NOT NULL,
	"total" smallint NOT NULL,
	"answers" jsonb NOT NULL,
	"duration_s" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "attempts_mode_check" CHECK ("attempts"."mode" in ('practice', 'exam'))
);
--> statement-breakpoint
CREATE INDEX "attempts_user_created_idx" ON "attempts" USING btree ("user_id","created_at" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "attempts_user_exam_created_idx" ON "attempts" USING btree ("user_id","exam_id","created_at" DESC NULLS LAST);