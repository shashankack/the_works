import { MiddlewareHandler } from "hono";
import { verifyJWT } from "../lib/auth";
import { getDB } from "../db/client";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";

export const authMiddleware = (
  requiredRole?: "admin" | "user"
): MiddlewareHandler => {
  return async (c, next) => {
    const authHeader = c.req.header("Authorization");
    const token = authHeader?.replace("Bearer ", "");

    if (!token) {
      return c.json({ error: "Authorization token is required" }, 401);
    }

    const payload = await verifyJWT<{ userId: string; role: string }>(
      token,
      c.env.JWT_SECRET
    );

    if (!payload) {
      return c.json({ error: "Invalid or expired token" }, 401);
    }

    // For admin routes, verify the role from database (more secure)
    if (requiredRole === "admin") {
      const db = getDB(c.env);
      const user = await db.query.users.findFirst({
        where: eq(users.id, payload.userId),
      });

      if (!user) {
        return c.json({ error: "User not found" }, 401);
      }

      if (user.role !== "admin") {
        return c.json({ error: "Forbidden: Admin access required" }, 403);
      }

      // Set the fresh user data
      c.set("user", { userId: user.id, role: user.role });
    } else {
      // For regular user routes, JWT role is sufficient
      if (requiredRole && payload.role !== requiredRole) {
        return c.json({ error: "Forbidden: Insufficient permissions" }, 403);
      }
      
      c.set("user", payload);
    }

    await next();
  };
};
