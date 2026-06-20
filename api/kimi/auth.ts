import * as cookie from "cookie";
import { env } from "../lib/env";
import { Errors } from "@contracts/errors";
import { Session } from "@contracts/constants";
import { verifySessionToken } from "./session";
import type { User } from "@db/schema";

export async function authenticateRequest(headers: Headers): Promise<User> {
  const cookies = cookie.parse(headers.get("cookie") || "");
  const token = cookies[Session.cookieName];
  if (!token) throw Errors.forbidden("Not authenticated.");

  const claim = await verifySessionToken(token);
  if (!claim) throw Errors.forbidden("Invalid session.");

  return {
    id: 1,
    unionId: env.adminEmail,
    name: "Admin",
    email: env.adminEmail,
    avatar: null,
    role: claim.role as "admin" | "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignInAt: new Date(),
  };
}
