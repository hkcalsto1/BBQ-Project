import type { Hono } from "hono";
import type { HttpBindings } from "@hono/node-server";
import { promises as fs } from "fs";
import path from "path";
import { authenticateRequest } from "./kimi/auth";

type App = Hono<{ Bindings: HttpBindings }>;

const UPLOAD_DIR = process.env.UPLOAD_DIR ?? path.resolve(import.meta.dirname, "../uploads");
const MAX_BYTES = 8 * 1024 * 1024;
const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

export function registerUploadRoute(app: App) {
  app.post("/api/upload", async (c) => {
    const user = await authenticateRequest(c.req.raw.headers).catch(() => null);
    if (!user || user.role !== "admin") {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const formData = await c.req.raw.formData().catch(() => null);
    const file = formData?.get("file");
    if (!(file instanceof File)) {
      return c.json({ error: "No file provided" }, 400);
    }

    const ext = ALLOWED_TYPES[file.type];
    if (!ext) {
      return c.json({ error: "Only JPEG, PNG, WebP, or GIF images are allowed" }, 400);
    }
    if (file.size > MAX_BYTES) {
      return c.json({ error: "File too large (max 8MB)" }, 400);
    }

    await fs.mkdir(UPLOAD_DIR, { recursive: true });
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(path.join(UPLOAD_DIR, filename), buffer);

    return c.json({ url: `/uploads/${filename}` });
  });
}
