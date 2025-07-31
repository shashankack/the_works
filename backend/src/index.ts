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

import { hash } from "bcrypt-ts";

import { cors } from "./lib/cors";
import addonRoutes from "@/routes/api/addons";

const app = new Hono();

app.use("*", cors());

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

app.get("/hash/:password", async (c) => {
  const password = c.req.param("password");
  if (!password) {
    return c.json({ error: "Password is required" }, 400);
  }
  const hashedPassword = await hash(password, 10);
  return c.json({ hashedPassword });
});

export default app;
