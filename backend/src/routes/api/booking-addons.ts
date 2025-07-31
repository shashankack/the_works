// routes/api/booking-addons.ts

import { Hono } from "hono";
import { getDB, Env } from "@/db/client";
import { authMiddleware } from "@/middleware/auth";
import { bookingAddOns, bookings } from "@/db/schema";
import { and, eq } from "drizzle-orm";

// Define the context variables that our middleware will set
type Variables = {
  user: { userId: string; role: string };
};

const bookingAddonRoutes = new Hono<{ Bindings: Env; Variables: Variables }>();

// POST /api/bookings/:id/addons – User attach addons
bookingAddonRoutes.post("/:id/addons", authMiddleware("user"), async (c) => {
  const db = getDB(c.env);
  const user = c.get("user");
  const bookingId = c.req.param("id");
  const { addonIds } = await c.req.json<{ addonIds: string[] }>();

  // Validate ownership - check that the booking belongs to the authenticated user
  const booking = await db.query.bookings.findFirst({
    where: and(
      eq(bookings.id, bookingId),
      eq(bookings.userId, user.userId)
    ),
  });

  if (!booking) {
    return c.json({ error: "Booking not found or unauthorized" }, 403);
  }

  const records = addonIds.map((addonId) => ({
    bookingId,
    addonId,
  }));

  await db.insert(bookingAddOns).values(records);
  return c.json({ message: "Addons added" });
});

export default bookingAddonRoutes;
