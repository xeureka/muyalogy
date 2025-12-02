CREATE TABLE "catagories" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"slug" varchar(128) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"sku" varchar(64) NOT NULL,
	"quantity" integer DEFAULT 0 NOT NULL,
	"price" numeric(12, 2) DEFAULT 0 NOT NULL,
	"category_id" integer,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DROP TABLE "posts_table" CASCADE;--> statement-breakpoint
DROP TABLE "users_table" CASCADE;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_category_id_catagories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."catagories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "categories_name_unique" ON "catagories" USING btree ("name");--> statement-breakpoint
CREATE UNIQUE INDEX "categories_slug_unique" ON "catagories" USING btree ("slug");--> statement-breakpoint
CREATE UNIQUE INDEX "products_sku_unique" ON "products" USING btree ("sku");--> statement-breakpoint
CREATE UNIQUE INDEX "products_category_idx" ON "products" USING btree ("category_id");