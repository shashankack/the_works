import { MiddlewareHandler } from "hono";
import { verifyJWT } from "../lib/auth";

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

    if (requiredRole && payload.role !== requiredRole) {
      return c.json({ error: "Forbidden: Insufficient permissions" }, 403);
    }

    c.set("user", payload);
    await next();
  };
};
