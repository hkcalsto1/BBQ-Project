import { z } from "zod";
import { createRouter, publicQuery, adminQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { menuItems } from "@db/schema";
import { eq, asc } from "drizzle-orm";

const defaultItems = [
  { category: "MEAT", name: "Smoked Brisket", price: 1600, priceUnit: "KG", priceSuffix: "/KG", isActive: true, sortOrder: 1 },
  { category: "MEAT", name: "Smoked Beef Short Rib", price: 1425, priceUnit: "RACK", priceSuffix: "/RACK", isActive: true, sortOrder: 2 },
  { category: "MEAT", name: "Smoked Beef Blade Wagyu", price: 625, priceUnit: "KG", priceSuffix: "/KG", isActive: true, sortOrder: 3 },
  { category: "MEAT", name: "Smoked Pork Belly", price: 425, priceUnit: "KG", priceSuffix: "/KG", isActive: true, sortOrder: 4 },
  { category: "MEAT", name: "Smoked Pork Rib", price: 425, priceUnit: "RACK", priceSuffix: "/RACK", isActive: true, sortOrder: 5 },
  { category: "MEAT", name: "Smoked Pulled Pork", price: 300, priceUnit: "KG", priceSuffix: "/KG", isActive: true, sortOrder: 6 },
  { category: "SIDES", name: "Mac N Cheese", price: 450, priceUnit: "TRAY", priceSuffix: "", isActive: true, sortOrder: 1 },
  { category: "SIDES", name: "BBQ Beans", price: 350, priceUnit: "TRAY", priceSuffix: "", isActive: true, sortOrder: 2 },
  { category: "SIDES", name: "Corn Bread", price: 179, priceUnit: "TRAY", priceSuffix: "", isActive: true, sortOrder: 3 },
  { category: "SIDES", name: "Potato Salad", price: 230, priceUnit: "TRAY", priceSuffix: "", isActive: true, sortOrder: 4 },
  { category: "SIDES", name: "Cob Salad", price: 225, priceUnit: "TRAY", priceSuffix: "", isActive: true, sortOrder: 5 },
  { category: "SIDES", name: "Coleslaw", price: 225, priceUnit: "TRAY", priceSuffix: "", isActive: true, sortOrder: 6 },
  { category: "SLIDERS", name: "Smoked Pulled Pork", price: 625, priceUnit: "SLIDER_ORDER", priceSuffix: "", isActive: true, sortOrder: 1 },
  { category: "SLIDERS", name: "Smoked Brisket", price: 675, priceUnit: "SLIDER_ORDER", priceSuffix: "", isActive: true, sortOrder: 2 },
  { category: "SLIDERS", name: "Chicken Salad", price: 600, priceUnit: "SLIDER_ORDER", priceSuffix: "", isActive: true, sortOrder: 3 },
  { category: "SLIDERS", name: "Beef Burger", price: 875, priceUnit: "SLIDER_ORDER", priceSuffix: "", isActive: true, sortOrder: 4 },
  { category: "SLIDERS", name: "Chicken Burger", price: 800, priceUnit: "SLIDER_ORDER", priceSuffix: "", isActive: true, sortOrder: 5 },
  { category: "OTHER", name: "Smoked Chicken Wings", price: 395, priceUnit: "PC", priceSuffix: "/ 40 PC", isActive: true, sortOrder: 1 },
  { category: "OTHER", name: "Smoked Pork Belly Pinwheels", price: 410, priceUnit: "KG", priceSuffix: "/KG", isActive: true, sortOrder: 2 },
  { category: "OTHER", name: "Chicken Fingers", price: 385, priceUnit: "PC", priceSuffix: "/50 PC", isActive: true, sortOrder: 3 },
];

export const menuRouter = createRouter({
  list: publicQuery.query(async () => {
    return getDb()
      .select()
      .from(menuItems)
      .where(eq(menuItems.isActive, true))
      .orderBy(asc(menuItems.category), asc(menuItems.sortOrder));
  }),

  listAll: adminQuery.query(async () => {
    return getDb()
      .select()
      .from(menuItems)
      .orderBy(asc(menuItems.category), asc(menuItems.sortOrder));
  }),

  upsert: adminQuery
    .input(z.object({
      id: z.number().optional(),
      category: z.string().min(1),
      name: z.string().min(1),
      price: z.number().int().positive(),
      priceUnit: z.string().min(1),
      priceSuffix: z.string().default(""),
      image: z.string().optional().nullable(),
      isActive: z.boolean().default(true),
      sortOrder: z.number().int().default(0),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      const { id, ...data } = input;
      if (id) {
        const [item] = await db.update(menuItems).set(data).where(eq(menuItems.id, id)).returning();
        return item;
      }
      const [item] = await db.insert(menuItems).values(data).returning();
      return item;
    }),

  delete: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await getDb().delete(menuItems).where(eq(menuItems.id, input.id));
      return { success: true };
    }),

  seed: adminQuery.mutation(async () => {
    const db = getDb();
    const existing = await db.select().from(menuItems).limit(1);
    if (existing.length > 0) return { skipped: true, count: 0 };
    await db.insert(menuItems).values(defaultItems);
    return { skipped: false, count: defaultItems.length };
  }),
});
