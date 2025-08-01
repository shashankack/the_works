import { Hono } from "hono";
import { getDB } from "@/db/client";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { authMiddleware } from "@/middleware/auth";

const usersRouter = new Hono();

// GET /api/users/:id - Get user by ID (admin only)
usersRouter.get("/:id", authMiddleware(), async (c: any) => {
  const userPayload = c.get("user") as { userId: string; role: string };
  const userId = c.req.param("id");
  const db = getDB(c.env);

  // Check if user is admin
  if (userPayload.role !== "admin") {
    return c.json({ error: "Unauthorized. Admin access required." }, 403);
  }

  try {
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    if (!user) {
      return c.json({ error: "User not found" }, 404);
    }

    const safeUser = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      role: user.role,
      createdAt: user.createdAt,
    };

    return c.json(safeUser);
  } catch (error) {
    console.error("Error fetching user:", error);
    return c.json({ error: "Failed to fetch user" }, 500);
  }
});

export default usersRouter;
