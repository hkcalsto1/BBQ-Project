import { authRouter } from "./auth-router";
import { productRouter } from "./product-router";
import { orderRouter } from "./order-router";
import { menuRouter } from "./menu-router";
import { cateringRouter } from "./catering-router";
import { createRouter, publicQuery } from "./middleware";

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),
  auth: authRouter,
  product: productRouter,
  order: orderRouter,
  menu: menuRouter,
  catering: cateringRouter,
});

export type AppRouter = typeof appRouter;
