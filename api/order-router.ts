import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { orders, orderItems, products } from "@db/schema";
import { eq, desc } from "drizzle-orm";

export const orderRouter = createRouter({
  // Create a new order
  create: publicQuery
    .input(
      z.object({
        customerName: z.string().min(1),
        customerEmail: z.string().email(),
        customerPhone: z.string().min(1),
        deliveryType: z.enum(["DELIVERY", "PICKUP"]),
        deliveryAddress: z.string().optional(),
        deliveryDate: z.string().optional(),
        deliveryTimeSlot: z.string().optional(),
        notes: z.string().optional(),
        items: z.array(
          z.object({
            productId: z.number(),
            quantity: z.number().min(1),
            weightKg: z.number().optional(),
            unitPrice: z.number(),
            totalPrice: z.number(),
          })
        ),
        totalAmount: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();

      // Insert order
      const [order] = await db.insert(orders).values({
        customerName: input.customerName,
        customerEmail: input.customerEmail,
        customerPhone: input.customerPhone,
        deliveryType: input.deliveryType,
        deliveryAddress: input.deliveryAddress,
        deliveryDate: input.deliveryDate,
        deliveryTimeSlot: input.deliveryTimeSlot,
        totalAmount: String(input.totalAmount),
        notes: input.notes,
      }).returning({ id: orders.id });

      const orderId = order.id;

      // Get product names for order items
      const productList = await db
        .select({ id: products.id, name: products.name })
        .from(products);
      const productMap = new Map(productList.map((p) => [p.id, p.name]));

      // Insert order items
      for (const item of input.items) {
        await db.insert(orderItems).values({
          orderId,
          productId: item.productId,
          productName: productMap.get(item.productId) ?? "Unknown",
          quantity: item.quantity,
          weightKg: item.weightKg ? String(item.weightKg) : null,
          unitPrice: String(item.unitPrice),
          totalPrice: String(item.totalPrice),
        });
      }

      return { orderId, success: true };
    }),

  // List all orders (for admin)
  list: publicQuery.query(async () => {
    const db = getDb();
    const allOrders = await db
      .select()
      .from(orders)
      .orderBy(desc(orders.createdAt));

    // Fetch items for each order
    const result = [];
    for (const order of allOrders) {
      const items = await db
        .select()
        .from(orderItems)
        .where(eq(orderItems.orderId, order.id));
      result.push({ ...order, items });
    }
    return result;
  }),

  // Update order status
  updateStatus: publicQuery
    .input(
      z.object({
        orderId: z.number(),
        status: z.enum([
          "PENDING", "CONFIRMED", "PREPARING", "READY", "DELIVERED", "CANCELLED",
        ]),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      await db
        .update(orders)
        .set({ status: input.status })
        .where(eq(orders.id, input.orderId));
      return { success: true };
    }),
});
