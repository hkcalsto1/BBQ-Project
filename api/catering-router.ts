import { z } from "zod";
import { createRouter, publicQuery, adminQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { cateringEnquiries } from "@db/schema";
import { desc, eq } from "drizzle-orm";

export const cateringRouter = createRouter({
  submit: publicQuery
    .input(z.object({
      customerName: z.string().min(1),
      customerEmail: z.string().email(),
      customerPhone: z.string().min(1),
      eventDate: z.string().min(1),
      eventType: z.string().min(1),
      guestCount: z.number().int().positive(),
      serviceType: z.string().min(1),
      deliveryAddress: z.string().optional().nullable(),
      notes: z.string().optional().nullable(),
      items: z.array(z.object({
        name: z.string(),
        quantity: z.number().int().positive(),
        price: z.number().int(),
        total: z.number().int(),
      })),
      subtotal: z.number().int(),
      deliveryFee: z.number().int(),
      total: z.number().int(),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      const [enquiry] = await db.insert(cateringEnquiries).values({
        customerName: input.customerName,
        customerEmail: input.customerEmail,
        customerPhone: input.customerPhone,
        eventDate: input.eventDate,
        eventType: input.eventType,
        guestCount: input.guestCount,
        serviceType: input.serviceType,
        deliveryAddress: input.deliveryAddress ?? null,
        notes: input.notes ?? null,
        items: input.items,
        subtotal: input.subtotal,
        deliveryFee: input.deliveryFee,
        total: input.total,
      }).returning({ id: cateringEnquiries.id });
      return { success: true, id: enquiry.id };
    }),

  list: adminQuery.query(async () => {
    return getDb()
      .select()
      .from(cateringEnquiries)
      .orderBy(desc(cateringEnquiries.createdAt));
  }),

  updateStatus: adminQuery
    .input(z.object({ id: z.number(), status: z.string() }))
    .mutation(async ({ input }) => {
      await getDb()
        .update(cateringEnquiries)
        .set({ status: input.status })
        .where(eq(cateringEnquiries.id, input.id));
      return { success: true };
    }),
});
