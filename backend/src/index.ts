import { Hono } from "hono";
import attendanceRoutes from "@/routes/api/attendance";
import auth from "@/routes/api/auth";
import bookingRoutes from "@/routes/api/bookings";
import packRoutes from "@/routes/api/class-packs";
import scheduleRoutes from "@/routes/api/class-schedules";
import classRoutes from "@/routes/api/classes";
import eventRoutes from "@/routes/api/events";
import enquiryRoutes from "@/routes/api/enquiries";
import trainerRoutes from "@/routes/api/trainers";
import uploadRoutes from "@/routes/api/uploads";
import usersRoutes from "@/routes/api/users";

import { hash } from "bcrypt-ts";
import { nanoid } from "nanoid";
import { getDB } from "@/db/client";
import { users } from "@/db/schema";

import { cors } from "./lib/cors";
import addonRoutes from "@/routes/api/addons";

const app = new Hono();

app.use("*", cors());

// Handle preflight requests explicitly
app.options("*", (c) => {
  return new Response(null, { status: 204 });
});

app.route("/api/addons", addonRoutes);
app.route("/api/attendance", attendanceRoutes);
app.route("/api/auth", auth);
app.route("/api/bookings", bookingRoutes);
app.route("/api/class-packs", packRoutes);
app.route("/api/class-schedules", scheduleRoutes);
app.route("/api/classes", classRoutes);
app.route("/api/events", eventRoutes);
app.route("/api/enquiries", enquiryRoutes);
app.route("/api/trainers", trainerRoutes);
app.route("/api/uploads", uploadRoutes);
app.route("/api/users", usersRoutes);

app.get("/hash/:password", async (c) => {
  const password = c.req.param("password");
  if (!password) {
    return c.json({ error: "Password is required" }, 400);
  }
  const hashedPassword = await hash(password, 10);
  return c.json({ hashedPassword });
});

// Debug route to check if user exists and their role
app.get("/debug/check-user/:email", async (c) => {
  const email = c.req.param("email");
  if (!email) {
    return c.json({ error: "Email is required" }, 400);
  }

  try {
    const db = getDB(c.env as any);
    const user = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.email, email),
    });

    if (!user) {
      return c.json({ message: "User not found", email });
    }

    return c.json({
      exists: true,
      email: user.email,
      role: user.role,
      id: user.id,
      createdAt: user.createdAt
    });
  } catch (error) {
    return c.json({ error: "Database query failed" });
  }
});

export default app;
