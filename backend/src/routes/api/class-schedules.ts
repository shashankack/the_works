import { Hono } from "hono";
import { getDB } from "@/db/client";
import { classSchedules } from "@/db/schema";
import { authMiddleware } from "@/middleware/auth";
import {
  validate,
  classScheduleSchema,
  classScheduleUpdateSchema,
} from "@/middleware/validate";
import { nanoid } from "nanoid";
import { eq } from "drizzle-orm";

const scheduleRoutes = new Hono<{ Bindings: Env }>();

// ✅ GET all schedules (admin)
scheduleRoutes.get("/", authMiddleware("admin"), async (c) => {
  const db = getDB(c.env);
  const result = await db.select().from(classSchedules);
  return c.json(result);
});

// ✅ GET public active schedules (no filtering by classId)
scheduleRoutes.get("/public", async (c) => {
  const db = getDB(c.env);
  const result = await db
    .select()
    .from(classSchedules)
    .where(eq(classSchedules.isActive, 1));
  return c.json(result);
});

// ✅ GET one schedule by ID
scheduleRoutes.get("/:id", authMiddleware("admin"), async (c) => {
  const db = getDB(c.env);
  const id = c.req.param("id");

  const result = await db
    .select()
    .from(classSchedules)
    .where(eq(classSchedules.id, id));

  if (!result.length) return c.json({ error: "Not found" }, 404);
  return c.json(result[0]);
});

// ✅ POST — create a schedule (no classId)
scheduleRoutes.post(
  "/",
  authMiddleware("admin"),
  validate(classScheduleSchema),
  async (c) => {
    const db = getDB(c.env);
    const body = c.get("validatedBody");

    const schedule = {
      id: `class_schedule_${nanoid()}`,
      dayOfWeek: body.dayOfWeek,
      startTime: body.startTime,
      endTime: body.endTime,
      isActive: 1, // default active
    };

    await db.insert(classSchedules).values(schedule);
    return c.json(schedule, 201);
  }
);

// ✅ PUT — replace full schedule (no classId)
scheduleRoutes.put(
  "/:id",
  authMiddleware("admin"),
  validate(classScheduleSchema),
  async (c) => {
    const db = getDB(c.env);
    const id = c.req.param("id");
    const body = c.get("validatedBody");

    const update = {
      dayOfWeek: body.dayOfWeek,
      startTime: body.startTime,
      endTime: body.endTime,
    };

    await db
      .update(classSchedules)
      .set(update)
      .where(eq(classSchedules.id, id));
    return c.json({ success: true });
  }
);

// ✅ PATCH — toggle active status
scheduleRoutes.patch("/:id/active", authMiddleware("admin"), async (c) => {
  const db = getDB(c.env);
  const id = c.req.param("id");
  const { isActive } = await c.req.json<{ isActive: boolean }>();

  await db
    .update(classSchedules)
    .set({ isActive: isActive ? 1 : 0 })
    .where(eq(classSchedules.id, id));

  return c.json({ success: true, updated: { id, isActive } });
});

// ✅ PATCH — partial update
scheduleRoutes.patch(
  "/:id",
  authMiddleware("admin"),
  validate(classScheduleUpdateSchema),
  async (c) => {
    const db = getDB(c.env);
    const id = c.req.param("id");
    const body = c.get("validatedBody");

    const update: Partial<typeof classSchedules.$inferInsert> = {};

    if (body.dayOfWeek !== undefined) update.dayOfWeek = body.dayOfWeek;
    if (body.startTime !== undefined && body.startTime !== "")
      update.startTime = body.startTime;
    if (body.endTime !== undefined && body.endTime !== "")
      update.endTime = body.endTime;

    await db
      .update(classSchedules)
      .set(update)
      .where(eq(classSchedules.id, id));

    return c.json({ success: true, message: "Schedule updated" });
  }
);

// ✅ DELETE — permanently delete schedule
scheduleRoutes.delete("/:id", authMiddleware("admin"), async (c) => {
  const db = getDB(c.env);
  await db
    .delete(classSchedules)
    .where(eq(classSchedules.id, c.req.param("id")));
  return c.json({ success: true });
});

export default scheduleRoutes;
