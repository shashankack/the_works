import { Hono } from "hono";
import { getDB } from "@/db/client";
import { enquiries } from "@/db/schema";
import { nanoid } from "nanoid";
import { authMiddleware } from "@/middleware/auth";
import { validate, enquirySchema } from "@/middleware/validate";
import { eq } from "drizzle-orm";

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

// ✅ DELETE enquiry (admin only)
enquiryRoutes.delete("/:id", authMiddleware("admin"), async (c) => {
  const db = getDB(c.env);
  const id = c.req.param("id");

  try {
    const result = await db.delete(enquiries).where(eq(enquiries.id, id));
    
    if (result.changes === 0) {
      return c.json({ error: "Enquiry not found" }, 404);
    }

    return c.json({ success: true, message: "Enquiry deleted successfully" });
  } catch (error) {
    console.error("Error deleting enquiry:", error);
    return c.json({ error: "Failed to delete enquiry" }, 500);
  }
});

export default enquiryRoutes;
