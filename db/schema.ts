import {
  pgTable,
  pgEnum,
  serial,
  varchar,
  text,
  timestamp,
  integer,
  numeric,
  jsonb,
  boolean,
} from "drizzle-orm/pg-core";

// ── Enums ──
export const roleEnum = pgEnum("role", ["user", "admin"]);
export const sectionEnum = pgEnum("section", ["SMOKEHOUSE", "BUTCHER"]);
export const isActiveEnum = pgEnum("is_active", ["true", "false"]);
export const priceUnitEnum = pgEnum("price_unit", [
  "PER_KG", "PER_PIECE", "PER_PACK", "PER_TRAY", "PER_PORTION",
]);
export const deliveryTypeEnum = pgEnum("delivery_type", ["DELIVERY", "PICKUP"]);
export const orderStatusEnum = pgEnum("order_status", [
  "PENDING", "CONFIRMED", "PREPARING", "READY", "DELIVERED", "CANCELLED",
]);

// ── Users ──
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  unionId: varchar("unionId", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 320 }),
  avatar: text("avatar"),
  role: roleEnum("role").default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  lastSignInAt: timestamp("lastSignInAt").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ── Categories ──
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  section: sectionEnum("section").notNull(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  image: text("image"),
  sortOrder: integer("sortOrder").default(0).notNull(),
  isActive: isActiveEnum("isActive").default("true").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Category = typeof categories.$inferSelect;

// ── Products ──
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  priceUnit: priceUnitEnum("priceUnit").notNull(),
  minWeightKg: numeric("minWeightKg", { precision: 6, scale: 2 }),
  maxWeightKg: numeric("maxWeightKg", { precision: 6, scale: 2 }),
  weightStep: numeric("weightStep", { precision: 6, scale: 2 }).default("0.5"),
  categoryId: integer("categoryId").notNull(),
  section: sectionEnum("section").notNull(),
  images: jsonb("images").$type<string[]>(),
  isActive: isActiveEnum("isActive").default("true").notNull(),
  sortOrder: integer("sortOrder").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Product = typeof products.$inferSelect;

// ── Orders ──
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  customerName: varchar("customerName", { length: 255 }).notNull(),
  customerEmail: varchar("customerEmail", { length: 320 }).notNull(),
  customerPhone: varchar("customerPhone", { length: 50 }).notNull(),
  deliveryType: deliveryTypeEnum("deliveryType").notNull(),
  deliveryAddress: text("deliveryAddress"),
  deliveryDate: varchar("deliveryDate", { length: 50 }),
  deliveryTimeSlot: varchar("deliveryTimeSlot", { length: 50 }),
  status: orderStatusEnum("status").default("PENDING").notNull(),
  totalAmount: numeric("totalAmount", { precision: 10, scale: 2 }).notNull(),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type Order = typeof orders.$inferSelect;

// ── Order Items ──
export const orderItems = pgTable("orderItems", {
  id: serial("id").primaryKey(),
  orderId: integer("orderId").notNull(),
  productId: integer("productId").notNull(),
  productName: varchar("productName", { length: 255 }).notNull(),
  quantity: integer("quantity").default(1).notNull(),
  weightKg: numeric("weightKg", { precision: 6, scale: 2 }),
  unitPrice: numeric("unitPrice", { precision: 10, scale: 2 }).notNull(),
  totalPrice: numeric("totalPrice", { precision: 10, scale: 2 }).notNull(),
  notes: text("notes"),
});

export type OrderItem = typeof orderItems.$inferSelect;

// ── Catering Menu Items ──
export const menuItems = pgTable("menu_items", {
  id: serial("id").primaryKey(),
  category: varchar("category", { length: 50 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  price: integer("price").notNull(),
  priceUnit: varchar("priceUnit", { length: 50 }).notNull(),
  priceSuffix: varchar("priceSuffix", { length: 100 }).default("").notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  sortOrder: integer("sortOrder").default(0).notNull(),
});

export type DbMenuItem = typeof menuItems.$inferSelect;
export type InsertMenuItem = typeof menuItems.$inferInsert;
