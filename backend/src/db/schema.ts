import {
  sqliteTable,
  text,
  integer,
  primaryKey,
} from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone").unique(),
  passwordHash: text("password_hash").notNull(),
  role: text("role").default("user").notNull(), // "user" or "admin"
  createdAt: text("created_at").default(new Date().toISOString()),
});

export const classes = sqliteTable("classes", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  instructions: text("instructions"),
  location: text("location").notNull(),
  thumbnail: text("thumbnail"),
  gallery: text("gallery", { mode: "json" }).$type<string[]>(),
  maxSpots: integer("max_spots").notNull(),
  bookedSpots: integer("booked_spots").default(0).notNull(),
  isActive: integer("is_active", { mode: "boolean" }).default(true),
  trainerId: text("trainer_id"),
  classPackIds: text("class_pack_ids").default("[]"),
  classScheduleIds: text("class_schedule_ids").default("[]"),
  createdAt: text("created_at").default(new Date().toISOString()),
});

export const classSchedules = sqliteTable("class_schedules", {
  id: text("id").primaryKey(),
  dayOfWeek: integer("day_of_week").notNull(), // 0-6 (Sunday-Saturday)
  startTime: text("start_time").notNull(), // (HH:mm)
  endTime: text("end_time").notNull(), // (HH:mm)
  isActive: integer("is_active").default(1).notNull(), // 1-active, 0-inactive
});

export const classPacks = sqliteTable("class_packs", {
  id: text("id").primaryKey(),
  classType: text("class_type").$type<"solo" | "group">().notNull(),
  title: text("title").notNull(),
  description: text("description"),
  numberOfSessions: integer("number_of_sessions").notNull(),
  price: integer("price").notNull(),
  duration: integer("duration").notNull(),
  isActive: integer("is_active").default(1).notNull(),
});

export const events = sqliteTable("events", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  instructions: text("instructions"),
  location: text("location"),
  thumbnail: text("thumbnail"),
  gallery: text("gallery", { mode: "json" }).$type<string[]>(),
  isRecurring: integer("is_recurring", { mode: "boolean" }).default(false),
  repeatPattern: text("repeat_pattern"),
  startDateTime: text("start_datetime").notNull(),
  endDateTime: text("end_datetime"),
  addonIds: text("addon_ids", { mode: "json" }).$type<string[]>().default([]),
  maxSpots: integer("max_spots").notNull(),
  bookedSpots: integer("booked_spots").default(0),
  isActive: integer("is_active").default(1).notNull(),
  createdAt: text("created_at").default(new Date().toISOString()),
});

export const addons = sqliteTable("addons", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  price: integer("price").notNull(),
  isActive: integer("is_active", { mode: "boolean" }).default(true).notNull(),
});

export const bookings = sqliteTable("bookings", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  classId: text("class_id"),
  eventId: text("event_id"),
  packId: text("pack_id"),
  scheduleId: text("schedule_id"),
  paymentId: text("payment_id"),
  status: text("status").default("pending"),
  createdAt: text("created_at").default(new Date().toISOString()),
});

export const bookingAddOns = sqliteTable(
  "booking_addons",
  {
    bookingId: text("booking_id")
      .notNull()
      .references(() => bookings.id),
    addonId: text("addon_id")
      .notNull()
      .references(() => addons.id),
  },
  (table) => ({
    pk: primaryKey({
      columns: [table.bookingId, table.addonId],
    }),
  })
);

export const classAttendance = sqliteTable("class_attendance", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  classId: text("class_id")
    .notNull()
    .references(() => classes.id),
  sessionDate: text("session_date").notNull(),
  attended: integer("attended", { mode: "boolean" }).default(true),
});

export const eventAttendance = sqliteTable("event_attendance", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  eventId: text("event_id")
    .notNull()
    .references(() => events.id),
  checkedInAt: text("checked_in_at").notNull(),
  attended: integer("attended", { mode: "boolean" }).default(true),
});

export const trainers = sqliteTable("trainers", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  bio: text("bio"),
  phone: text("phone").unique(),
  email: text("email").notNull().unique(),
  profileImage: text("profile_image"),
  specializations: text("specializations", { mode: "json" }).$type<string[]>(),
  createdAt: text("created_at").default(new Date().toISOString()),
});

export const enquiries = sqliteTable("enquiries", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  message: text("message").notNull(),
  createdAt: text("created_at").default(new Date().toISOString()),
});
