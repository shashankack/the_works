import { Hono } from "hono";
import { getDB } from "@/db/client";
import { enquiries } from "@/db/schema";
import { nanoid } from "nanoid";
import { authMiddleware } from "@/middleware/auth";
import { validate, enquirySchema } from "@/middleware/validate";

export const enquiryRoutes = new Hono<{ Bindings: Env }>();

// ✅ GET all enquiries (admin only)
enquiryRoutes.get("/", authMiddleware("admin"), async (c) => {
  const db = getDB(c.env);
  const all = await db.select().from(enquiries);
  return c.json(all);
});

// ✅ POST new enquiry (public)
enquiryRoutes.post("/", validate(enquirySchema), async (c) => {
  const db = getDB(c.env);
  const body = c.get("validatedBody");

  const newEnquiry = {
    id: `enquiry_${nanoid()}`,
    name: body.name,
    email: body.email,
    phone: body.phone ?? null,
    message: body.message,
    createdAt: new Date().toISOString(),
  };

  await db.insert(enquiries).values(newEnquiry);

  // 🔔 Optional: Send email using Resend
  // await resend.emails.send({ to: 'admin@example.com', subject: 'New Enquiry', ... })

  return c.json({ success: true });
});

export default enquiryRoutes;
