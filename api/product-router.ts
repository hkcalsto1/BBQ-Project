import { z } from "zod";
import { createRouter, publicQuery, adminQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { products, categories } from "@db/schema";
import { eq, and, asc } from "drizzle-orm";

export const productRouter = createRouter({
  // List all active products with their categories
  list: publicQuery
    .input(
      z.object({
        section: z.enum(["SMOKEHOUSE", "BUTCHER"]).optional(),
        categoryId: z.number().optional(),
      }).optional()
    )
    .query(async ({ input }) => {
      const db = getDb();
      const where = [];
      if (input?.section) {
        where.push(eq(products.section, input.section));
      }
      if (input?.categoryId) {
        where.push(eq(products.categoryId, input.categoryId));
      }
      where.push(eq(products.isActive, "true"));

      const result = await db
        .select({
          id: products.id,
          name: products.name,
          description: products.description,
          price: products.price,
          priceUnit: products.priceUnit,
          minWeightKg: products.minWeightKg,
          maxWeightKg: products.maxWeightKg,
          weightStep: products.weightStep,
          categoryId: products.categoryId,
          section: products.section,
          images: products.images,
          sortOrder: products.sortOrder,
        })
        .from(products)
        .where(where.length > 0 ? and(...where) : undefined)
        .orderBy(asc(products.sortOrder));

      return result;
    }),

  // Get single product by ID
  byId: publicQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const result = await db
        .select()
        .from(products)
        .where(eq(products.id, input.id))
        .limit(1);
      return result[0] ?? null;
    }),

  // Admin: list ALL products including inactive
  listAll: adminQuery.query(async () => {
    return getDb().select().from(products).orderBy(asc(products.section), asc(products.sortOrder));
  }),

  // Admin: create or update product
  upsert: adminQuery
    .input(z.object({
      id: z.number().optional(),
      name: z.string().min(1),
      description: z.string().optional().nullable(),
      price: z.string(),
      priceUnit: z.enum(["PER_KG", "PER_PIECE", "PER_PACK", "PER_TRAY", "PER_PORTION"]),
      minWeightKg: z.string().optional().nullable(),
      maxWeightKg: z.string().optional().nullable(),
      weightStep: z.string().optional().nullable(),
      categoryId: z.number(),
      section: z.enum(["SMOKEHOUSE", "BUTCHER"]),
      isActive: z.enum(["true", "false"]).default("true"),
      sortOrder: z.number().default(0),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      const { id, ...data } = input;
      if (id) {
        const [p] = await db.update(products).set(data).where(eq(products.id, id)).returning();
        return p;
      }
      const [p] = await db.insert(products).values(data).returning();
      return p;
    }),

  // Admin: delete product
  delete: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await getDb().delete(products).where(eq(products.id, input.id));
      return { success: true };
    }),

  // Admin: list ALL categories including inactive
  categoriesAll: adminQuery.query(async () => {
    return getDb().select().from(categories).orderBy(asc(categories.section), asc(categories.sortOrder));
  }),

  // Admin: create or update category
  upsertCategory: adminQuery
    .input(z.object({
      id: z.number().optional(),
      name: z.string().min(1),
      section: z.enum(["SMOKEHOUSE", "BUTCHER"]),
      slug: z.string().min(1),
      sortOrder: z.number().default(0),
      isActive: z.enum(["true", "false"]).default("true"),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      const { id, ...data } = input;
      if (id) {
        const [c] = await db.update(categories).set(data).where(eq(categories.id, id)).returning();
        return c;
      }
      const [c] = await db.insert(categories).values(data).returning();
      return c;
    }),

  // Admin: delete category
  deleteCategory: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await getDb().delete(categories).where(eq(categories.id, input.id));
      return { success: true };
    }),

  // Admin: seed default categories if empty
  seedCategories: adminQuery.mutation(async () => {
    const db = getDb();
    const existing = await db.select().from(categories).limit(1);
    if (existing.length > 0) return { skipped: true, count: 0 };
    const defaults = [
      { name: "Smoked Meats", section: "SMOKEHOUSE" as const, slug: "smoked-meats", sortOrder: 1, isActive: "true" as const },
      { name: "Sides", section: "SMOKEHOUSE" as const, slug: "sides", sortOrder: 2, isActive: "true" as const },
      { name: "Sliders", section: "SMOKEHOUSE" as const, slug: "sliders", sortOrder: 3, isActive: "true" as const },
      { name: "Other", section: "SMOKEHOUSE" as const, slug: "other", sortOrder: 4, isActive: "true" as const },
      { name: "Beef", section: "BUTCHER" as const, slug: "beef", sortOrder: 1, isActive: "true" as const },
      { name: "Pork", section: "BUTCHER" as const, slug: "pork", sortOrder: 2, isActive: "true" as const },
      { name: "Poultry", section: "BUTCHER" as const, slug: "poultry", sortOrder: 3, isActive: "true" as const },
      { name: "Specialty", section: "BUTCHER" as const, slug: "specialty", sortOrder: 4, isActive: "true" as const },
    ];
    await db.insert(categories).values(defaults);
    return { skipped: false, count: defaults.length };
  }),

  // List categories
  categories: publicQuery
    .input(
      z.object({
        section: z.enum(["SMOKEHOUSE", "BUTCHER"]).optional(),
      }).optional()
    )
    .query(async ({ input }) => {
      const db = getDb();
      const where = [eq(categories.isActive, "true")];
      if (input?.section) {
        where.push(eq(categories.section, input.section));
      }
      return db
        .select()
        .from(categories)
        .where(and(...where))
        .orderBy(asc(categories.sortOrder));
    }),
});
