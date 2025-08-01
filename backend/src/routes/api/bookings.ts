import { Hono } from "hono";
import { nanoid } from "nanoid";
import { getDB, Env } from "@/db/client";
import { bookings, bookingAddOns } from "@/db/schema";
import { authMiddleware } from "@/middleware/auth";
import { eq } from "drizzle-orm";
import { validate, bookingSchema } from "@/middleware/validate";

// Define the context variables that our middleware will set
type Variables = {
  user: { userId: string; role: string };
  validatedBody: any;
};

const bookingRoutes = new Hono<{ Bindings: Env; Variables: Variables }>();

// ✅ Create a new booking (user) - Requires authentication
bookingRoutes.post("/", authMiddleware("user"), validate(bookingSchema), async (c) => {
  const db = getDB(c.env);
  const user = c.get("user");
  const body = c.get("validatedBody");

  // Validate that either classId or eventId is provided
  if (!body.classId && !body.eventId) {
    return c.json(
      {
        error: "Either classId or eventId is required to create a booking",
      },
      400
    );
  }

  // Ensure only one activity type is selected
  if (body.classId && body.eventId) {
    return c.json(
      {
        error: "Cannot book both a class and event in the same booking",
      },
      400
    );
  }

  // Validate required payment ID
  if (!body.paymentId) {
    return c.json(
      {
        error: "Payment ID is required to create a booking",
      },
      400
    );
  }

  // Create the booking with authenticated user's ID
  const bookingId = `booking_${nanoid()}`;
  const booking = {
    id: bookingId,
    userId: user.userId, // This comes from the authenticated user context
    classId: body.classId || null,
    eventId: body.eventId || null,
    packId: body.classPackId || null, // Map classPackId to packId for database
    scheduleId: body.scheduleId || null, // Add schedule ID
    paymentId: body.paymentId,
    status: "pending", // Default status
    createdAt: new Date().toISOString(),
  };

  try {
    // Start transaction by creating the booking first
    await db.insert(bookings).values(booking);

    // If there are addons, insert them into booking_addons table
    if (
      body.addonIds &&
      Array.isArray(body.addonIds) &&
      body.addonIds.length > 0
    ) {
      const addonRecords = body.addonIds.map((addonId: string) => ({
        bookingId: bookingId,
        addonId: addonId,
      }));

      await db.insert(bookingAddOns).values(addonRecords);
    }

    // Return the complete booking with success message
    return c.json(
      {
        id: bookingId,
        message: "Booking created successfully",
        booking: booking,
        addonsAttached: body.addonIds?.length || 0,
      },
      201
    );
  } catch (error) {
    console.error("Error creating booking:", error);
    return c.json(
      {
        error: "Failed to create booking. Please try again.",
      },
      500
    );
  }
});

// ✅ Get all bookings for current user
bookingRoutes.get("/me", authMiddleware("user"), async (c) => {
  const db = getDB(c.env);
  const user = c.get("user");

  const result = await db.query.bookings.findMany({
    where: eq(bookings.userId, user.userId),
  });

  return c.json(result);
});

// ✅ Get a specific booking with addons for current user
bookingRoutes.get("/me/:id", authMiddleware("user"), async (c) => {
  const db = getDB(c.env);
  const user = c.get("user");
  const bookingId = c.req.param("id");

  const booking = await db.query.bookings.findFirst({
    where: eq(bookings.id, bookingId),
    with: {
      bookingAddOns: {
        with: {
          addon: true,
        },
      },
    },
  });

  if (!booking || booking.userId !== user.userId) {
    return c.json({ error: "Booking not found" }, 404);
  }

  return c.json(booking);
});

// ✅ Admin: get all bookings (with optional status filter)
bookingRoutes.get("/", authMiddleware("admin"), async (c) => {
  const db = getDB(c.env);
  const url = new URL(c.req.url);
  const status = url.searchParams.get("status");

  const whereClause = status ? eq(bookings.status, status) : undefined;

  const result = await db.query.bookings.findMany({
    where: whereClause,
  });

  return c.json(result);
});

// ✅ Admin: confirm booking
bookingRoutes.put("/:id/confirm", authMiddleware("admin"), async (c) => {
  const db = getDB(c.env);
  const id = c.req.param("id");

  await db
    .update(bookings)
    .set({ status: "confirmed" })
    .where(eq(bookings.id, id));

  return c.json({ message: "Booking confirmed" });
});

// ✅ Admin: cancel booking
bookingRoutes.put("/:id/cancel", authMiddleware("admin"), async (c) => {
  const db = getDB(c.env);
  const id = c.req.param("id");

  await db
    .update(bookings)
    .set({ status: "cancelled" })
    .where(eq(bookings.id, id));

  return c.json({ message: "Booking cancelled" });
});

export default bookingRoutes;
