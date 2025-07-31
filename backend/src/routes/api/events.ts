import { Hono } from "hono";
import { getDB } from "@/db/client";
import { events } from "@/db/schema";
import { eq } from "drizzle-orm";
import { authMiddleware } from "@/middleware/auth";
import { validate, eventSchema } from "@/middleware/validate";
import { nanoid } from "nanoid";

const eventRoutes = new Hono<{ Bindings: Env }>();

// ✅ Public: GET /api/events
eventRoutes.get("/", async (c) => {
  const db = getDB(c.env);
  const result = await db.select().from(events).where(eq(events.isActive, 1));
  return c.json(result);
});

// ✅ Public: GET /api/events/:id
eventRoutes.get("/:id", async (c) => {
  const db = getDB(c.env);
  const id = c.req.param("id");
  const result = await db.select().from(events).where(eq(events.id, id));

  if (!result.length || result[0].isActive !== 1) {
    return c.json({ error: "Event not found" }, 404);
  }

  return c.json(result[0]);
});

// ✅ Admin: POST /api/events
eventRoutes.post(
  "/",
  authMiddleware("admin"),
  validate(eventSchema),
  async (c) => {
    const db = getDB(c.env);
    const body = c.get("validatedBody");

    const newEvent = {
      id: `event_${nanoid()}`,
      title: body.title,
      description: body.description,
      instructions: body.instructions,
      location: body.location,
      thumbnail: body.thumbnail || null,
      gallery: body.gallery || [],
      isRecurring: body.isRecurring || false,
      repeatPattern: body.repeatPattern || null,
      startDateTime: body.startDateTime,
      endDateTime: body.endDateTime,
      maxSpots: body.maxSpots,
      bookedSpots: 0,
      isActive: 1,
      createdAt: new Date().toISOString(),
    };

    await db.insert(events).values(newEvent);
    return c.json(newEvent, 201);
  }
);

// ✅ Admin: PUT /api/events/:id
eventRoutes.put("/:id", authMiddleware("admin"), async (c) => {
  const db = getDB(c.env);
  const id = c.req.param("id");
  const body = await c.req.json();

  // Build only the fields that are provided
  const updateData: Partial<typeof events.$inferInsert> = {};

  if (body.title !== undefined) updateData.title = body.title;
  if (body.description !== undefined) updateData.description = body.description;
  if (body.instructions !== undefined)
    updateData.instructions = body.instructions;
  if (body.location !== undefined) updateData.location = body.location;
  if (body.thumbnail !== undefined) updateData.thumbnail = body.thumbnail;
  if (body.gallery !== undefined) updateData.gallery = body.gallery;
  if (body.isRecurring !== undefined) updateData.isRecurring = body.isRecurring;
  if (body.repeatPattern !== undefined)
    updateData.repeatPattern = body.repeatPattern;
  if (body.startDateTime !== undefined)
    updateData.startDateTime = body.startDateTime;
  if (body.endDateTime !== undefined) updateData.endDateTime = body.endDateTime;
  if (body.maxSpots !== undefined) updateData.maxSpots = body.maxSpots;
  if (body.bookedSpots !== undefined) updateData.bookedSpots = body.bookedSpots;
  if (body.isActive !== undefined) updateData.isActive = body.isActive ? 1 : 0;

  if (Object.keys(updateData).length === 0) {
    return c.json({ error: "No valid fields to update" }, 400);
  }

  await db.update(events).set(updateData).where(eq(events.id, id));
  return c.json({
    success: true,
    message: "Event updated",
    updatedFields: updateData,
  });
});

// ✅ Admin: DELETE /api/events/:id
eventRoutes.delete("/:id", authMiddleware("admin"), async (c) => {
  const db = getDB(c.env);
  const id = c.req.param("id");

  await db.delete(events).where(eq(events.id, id));
  return c.json({ success: true, message: "Event permanently deleted" });
});

export default eventRoutes;
