import { Hono } from "hono";
import { getDB } from "@/db/client";
import {
  classAttendance,
  eventAttendance,
  classes,
  events,
  users,
} from "@/db/schema";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { authMiddleware } from "@/middleware/auth";
import { attendanceSchema, validate } from "@/middleware/validate";
import type { AttendanceRequestBody } from "@/types/attendance";

const attendanceRoutes = new Hono<{ Bindings: Env }>();

// ✅ POST /api/attendance/:id — handles both class and event attendance
attendanceRoutes.post(
  "/:id",
  authMiddleware("admin"),
  validate(attendanceSchema),
  async (c) => {
    const db = getDB(c.env);
    const id = c.req.param("id");
    const body = c.get("validatedBody") as AttendanceRequestBody;
    const { date, attendees } = body;

    // Check if it's a class
    const isClass = await db
      .select({ id: classes.id })
      .from(classes)
      .where(eq(classes.id, id));

    // If not a class, check events
    const isEvent = !isClass.length
      ? await db.select({ id: events.id }).from(events).where(eq(events.id, id))
      : [];

    if (!isClass.length && !isEvent.length) {
      return c.json({ error: "Invalid class or event ID" }, 404);
    }

    const values = attendees.map((a) => ({
      id: `attendance_${nanoid()}`,
      userId: a.userId,
      ...(isClass.length
        ? { classId: id, sessionDate: date }
        : { eventId: id, checkedInAt: date }),
      attended: a.attended,
    }));

    if (isClass.length) {
      await db.insert(classAttendance).values(values);
    } else {
      await db.insert(eventAttendance).values(values);
    }

    return c.json({ success: true, count: values.length });
  }
);

// ✅ GET /api/attendance/class/:id — get attendees with user info
attendanceRoutes.get("/class/:id", authMiddleware("admin"), async (c) => {
  const db = getDB(c.env);
  const id = c.req.param("id");

  const result = await db
    .select({
      id: classAttendance.id,
      userId: classAttendance.userId,
      sessionDate: classAttendance.sessionDate,
      attended: classAttendance.attended,
      userName: users.firstName,
      userEmail: users.email,
    })
    .from(classAttendance)
    .innerJoin(users, eq(classAttendance.userId, users.id))
    .where(eq(classAttendance.classId, id));

  return c.json(result);
});

// ✅ GET /api/attendance/event/:id — get attendees with user info
attendanceRoutes.get("/event/:id", authMiddleware("admin"), async (c) => {
  const db = getDB(c.env);
  const id = c.req.param("id");

  const result = await db
    .select({
      id: eventAttendance.id,
      userId: eventAttendance.userId,
      checkedInAt: eventAttendance.checkedInAt,
      attended: eventAttendance.attended,
      userName: users.firstName,
      userEmail: users.email,
    })
    .from(eventAttendance)
    .innerJoin(users, eq(eventAttendance.userId, users.id))
    .where(eq(eventAttendance.eventId, id));

  return c.json(result);
});

export default attendanceRoutes;
