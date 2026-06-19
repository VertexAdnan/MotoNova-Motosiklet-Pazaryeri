import { boolean, integer, pgTable, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";
import { users } from "./users";

export const catalogModels = pgTable(
  "catalog_models",
  {
    id: text("id").primaryKey(),
    brandName: text("brand_name").notNull(),
    modelName: text("model_name").notNull(),
    yearFrom: integer("year_from"),
    yearTo: integer("year_to"),
    source: text("source").notNull().default("manual"),
    requestId: text("request_id"),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("catalog_models_brand_model_unique").on(table.brandName, table.modelName),
  ]
);

export const catalogModelRequests = pgTable("catalog_model_requests", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  brandName: text("brand_name").notNull(),
  modelName: text("model_name").notNull(),
  yearFrom: integer("year_from"),
  yearTo: integer("year_to"),
  notes: text("notes"),
  status: text("status").notNull().default("pending"),
  adminNotes: text("admin_notes"),
  reviewedBy: text("reviewed_by"),
  reviewedAt: timestamp("reviewed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type CatalogModelRow = typeof catalogModels.$inferSelect;
export type CatalogModelRequestRow = typeof catalogModelRequests.$inferSelect;
