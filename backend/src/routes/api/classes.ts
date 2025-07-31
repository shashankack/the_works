import { Hono } from "hono";
import { getDB } from "@/db/client";
import { classes } from "@/db/schema";
import { eq } from "drizzle-orm";
import { authMiddleware } from "@/middleware/auth";
import { validate, classSchema } from "@/middleware/validate";
import { nanoid } from "nanoid";

const classRoutes = new Hono<{ Bindings: Env }>();

// ✅ Public: GET /api/classes
classRoutes.get("/", async (c) => {
  const db = getDB(c.env);
  const result = await db.select().from(classes).where(eq(classes.isActive, 1));
  return c.json(result);
});

// ✅ Public: GET /api/classes/:id
classRoutes.get("/:id", async (c) => {
  const db = getDB(c.env);
  const id = c.req.param("id");
  const result = await db.select().from(classes).where(eq(classes.id, id));

  if (!result.length || !result[0].isActive) {
    return c.json({ error: "Class not found" }, 404);
  }
  return c.json(result[0]);
});

// ✅ Admin: POST /api/classes
classRoutes.post(
  "/",
  authMiddleware("admin"),
  validate(classSchema),
  async (c) => {
    const db = getDB(c.env);
    const body = c.get("validatedBody");

    const newClass = {
      id: `class_${nanoid()}`,
      title: body.title,
      classType: body.classType,
      description: body.description,
      instructions: body.instructions,
      location:
        body.location ||
        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.0181960939412!2d77.60356488538241!3d12.970687382283348!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae16807d7b900b%3A0xba7b97b63f0ea410!2sMount%20Blue!5e0!3m2!1sen!2sin!4v1752046004362!5m2!1sen!2sin",
      thumbnail: body.thumbnail || null,
      gallery: body.gallery || [],
      maxSpots: body.maxSpots || 10,
      isActive: 1,
      createdAt: new Date().toISOString(),

      // ✅ New fields for schema save point
      trainerId: body.trainerId || null,
      classPackIds: JSON.stringify(body.classPackIds || []),
      classScheduleIds: JSON.stringify(body.classScheduleIds || []),
    };

    await db.insert(classes).values(newClass);
    return c.json(newClass, 201);
  }
);

// ✅ Admin: PUT /api/classes/:id
classRoutes.put(
  "/:id",
  authMiddleware("admin"),
  validate(classSchema),
  async (c) => {
    const db = getDB(c.env);
    const id = c.req.param("id");
    const body = c.get("validatedBody");

    const updateData: Partial<typeof classes.$inferInsert> = {};

    if (body.title !== undefined) updateData.title = body.title;
    if (body.description !== undefined)
      updateData.description = body.description;
    if (body.classType !== undefined) updateData.classType = body.classType;
    if (body.instructions !== undefined)
      updateData.instructions = body.instructions;

    updateData.location =
      body.location?.trim() === "" || body.location === undefined
        ? "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.0181960939412!2d77.60356488538241!3d12.970687382283348!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae16807d7b900b%3A0xba7b97b63f0ea410!2sMount%20Blue!5e0!3m2!1sen!2sin!4v1752046004362!5m2!1sen!2sin"
        : body.location;

    if (body.thumbnail !== undefined) updateData.thumbnail = body.thumbnail;
    if (body.gallery !== undefined) updateData.gallery = body.gallery;
    if (body.maxSpots !== undefined) updateData.maxSpots = body.maxSpots;
    if (body.isActive !== undefined)
      updateData.isActive = body.isActive ? 1 : 0;

    // ✅ Handle updates to pack/schedule references
    if (body.trainerId !== undefined) updateData.trainerId = body.trainerId;
    if (body.classPackIds !== undefined)
      updateData.classPackIds = JSON.stringify(body.classPackIds);
    if (body.classScheduleIds !== undefined)
      updateData.classScheduleIds = JSON.stringify(body.classScheduleIds);

    await db.update(classes).set(updateData).where(eq(classes.id, id));
    return c.json({ success: true, message: "Class updated" });
  }
);

// ✅ Admin: DELETE /api/classes/:id
classRoutes.delete("/:id", authMiddleware("admin"), async (c) => {
  const db = getDB(c.env);
  const id = c.req.param("id");

  await db.update(classes).set({ isActive: 0 }).where(eq(classes.id, id));
  return c.json({ success: true, message: "Class deactivated" });
});

export default classRoutes;
