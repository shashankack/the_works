import z from "zod";
import { MiddlewareHandler } from "hono";

// Reusable validator middleware
export const validate =
  <T extends z.ZodTypeAny>(schema: T): MiddlewareHandler =>
  async (c, next) => {
    const body = await c.req.json();
    const result = schema.safeParse(body);
    if (!result.success) {
      return c.json({ error: result.error.errors }, 400);
    }
    c.set("validatedBody", result.data);
    await next();
  };

//
// ✅ Auth
//
export const registerSchema = z
  .object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    email: z.string().email(),
    phone: z.string().optional(),
    password: z.string().min(6),
  })
  .strict();

export const loginSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(1),
  })
  .strict();

//
// ✅ Class
//
export const classSchema = z
  .object({
    title: z.string(),
    description: z.string().optional(),
    instructions: z.string().optional(),
    location: z.string().optional(),
    thumbnail: z.string().optional(),
    gallery: z.array(z.string()).optional(),
    maxSpots: z.number().int().min(1).default(10),
    isActive: z.boolean().default(true),
    trainerId: z.string().optional(),
    classPackIds: z.array(z.string()).optional(),
    classScheduleIds: z.array(z.string()).optional(),
  })
  .strict();

//
// ✅ Class Schedule
//
export const classScheduleSchema = z
  .object({
    dayOfWeek: z.number().int().min(0).max(6),
    startTime: z.string().time(), // Zod v4
    endTime: z.string().time(),
  })
  .strict();

export const classScheduleUpdateSchema = z
  .object({
    dayOfWeek: z.number().int().min(0).max(6).optional(),
    startTime: z.string().time().optional(),
    endTime: z.string().time().optional(),
  })
  .strict();

//
// ✅ Class Pack
//
export const classPackSchema = z
  .object({
    title: z.string(),
    description: z.string().optional(),
    numberOfSessions: z.coerce.number().int().min(1),
    price: z.coerce.number().int().min(0),
    duration: z.coerce.number().int().min(1), // in days
    classType: z.enum(["solo", "group"]),
    isActive: z.boolean().optional().default(true),
  })
  .strict();

//
// ✅ Event
//
export const eventSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  instructions: z.string().optional(),
  location: z.string().optional(),
  thumbnail: z.string().nullable().optional(),
  gallery: z.array(z.string()).optional(),
  isRecurring: z.boolean().optional(),
  repeatPattern: z.string().nullable().optional(),
  startDateTime: z.string(), // ✅ datetime in ISO format
  endDateTime: z.string().nullable().optional(),
  addonIds: z.array(z.string()).optional(),
  maxSpots: z.number(),
});

//
// ✅ Booking
//
export const bookingSchema = z
  .object({
    classId: z.string().optional(),
    eventId: z.string().optional(),
    classTypeId: z.string().optional(),
    classPackId: z.string().optional(),
    scheduleId: z.string().optional(),
    paymentId: z.string().optional(),
    addonIds: z.array(z.string()).optional(),
  })
  .strict();

//
// ✅ Addon
//
export const addonSchema = z
  .object({
    classId: z.string().optional(),
    eventId: z.string().optional(),
    name: z.string().min(1),
    description: z.string().optional(),
    price: z.number().int().positive(),
  })
  .strict();

//
// ✅ Booking Addons
//
export const bookingAddOnsSchema = z
  .object({
    bookingId: z.string(),
    addonId: z.string(),
  })
  .strict();

//
// ✅ Trainer
//
export const trainerSchema = z
  .object({
    name: z.string().min(1),
    bio: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().email(),
    profileImage: z.string().url().optional(),
    specializations: z.array(z.string()).optional(),
  })
  .strict();

//
// ✅ Attendance (bulk)
//
export const attendanceSchema = z
  .object({
    attendees: z.array(
      z
        .object({
          userId: z.string(),
          attended: z.boolean(),
          date: z.string().datetime({ offset: true }).optional(),
        })
        .strict()
    ),
  })
  .strict();

//
// ✅ Enquiry
//
export const enquirySchema = z
  .object({
    name: z.string().min(1),
    email: z.string().email(),
    phone: z.string().optional(),
    message: z.string().min(1),
  })
  .strict();
