import { boolean, integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { users } from "./users";

export const listings = pgTable("listings", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  brand: text("brand").notNull(),
  model: text("model"),
  city: text("city").notNull(),
  district: text("district"),
  motorType: text("motor_type").notNull(),
  conditionType: text("condition_type").notNull(),
  damageState: text("damage_state").notNull(),
  timingType: text("timing_type").notNull(),
  transmission: text("transmission").notNull(),
  fuelType: text("fuel_type"),
  color: text("color").notNull(),
  origin: text("origin").notNull(),
  year: integer("year").notNull(),
  km: integer("km"),
  engineCc: integer("engine_cc").notNull(),
  priceValue: integer("price_value").notNull(),
  description: text("description"),
  images: text("images").array().notNull(),
  status: text("status").notNull().default("published"),
  featured: boolean("featured").notNull().default(false),
  views: integer("views").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Listing = typeof listings.$inferSelect;
export type NewListing = typeof listings.$inferInsert;
