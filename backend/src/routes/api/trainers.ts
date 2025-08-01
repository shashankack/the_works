import { Hono } from "hono";
import { authMiddleware } from "@/middleware/auth";
import { getDB } from "@/db/client";
import { trainers } from "@/db/schema";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { validate, trainerSchema } from "@/middleware/validate";

export const trainerRoutes = new Hono<{ Bindings: Env }>();

// ✅ Public route — GET /api/trainers
trainerRoutes.get("/", async (c) => {
  const db = getDB(c.env);

  const result = await db.select().from(trainers);
  const publicTrainers = result.map((trainer) => {
    const { phone, email, ...publicInfo } = trainer;
    return publicInfo; // Exclude sensitive info
  });
  return c.json(publicTrainers);
});

// ✅ Public route — GET /api/trainers/:id
trainerRoutes.get("/:id", async (c) => {
  const db = getDB(c.env);
  const id = c.req.param("id");

  const result = await db.select().from(trainers).where(eq(trainers.id, id));
  const trainer = result[0];

  if (!trainer) {
    return c.json({ error: "Trainer not found" }, 404);
  }

  const { phone, email, ...publicInfo } = trainer;
  return c.json(publicInfo);
});

// ✅ Protect all admin routes after this point
trainerRoutes.use("/admin/*", authMiddleware("admin"));

// ✅ Admin — GET all trainers (returns complete data including phone/email)
trainerRoutes.get("/admin/", async (c) => {
  const db = getDB(c.env);
  const all = await db.select().from(trainers);
  return c.json(all);
});

// ✅ Admin — POST new trainer
trainerRoutes.post("/admin/", validate(trainerSchema), async (c) => {
  const db = getDB(c.env);
  const body = c.get("validatedBody");

  const newTrainer = {
    id: `trainer_${nanoid()}`,
    name: body.name,
    bio: body.bio,
    phone: body.phone,
    email: body.email,
    profileImage: body.profileImage,
    specializations: body.specializations || [],
    createdAt: new Date().toISOString(),
  };

  await db.insert(trainers).values(newTrainer);
  return c.json({ success: true, trainer: newTrainer });
});

// ✅ Admin — PUT update trainer
trainerRoutes.put("/admin/:id", validate(trainerSchema), async (c) => {
  const db = getDB(c.env);
  const id = c.req.param("id");
  const body = c.get("validatedBody");

  await db
    .update(trainers)
    .set({
      name: body.name,
      bio: body.bio,
      phone: body.phone,
      email: body.email,
      profileImage: body.profileImage,
      specializations: body.specializations || [],
    })
    .where(eq(trainers.id, id));

  return c.json({ success: true });
});

// ✅ Admin — DELETE trainer
trainerRoutes.delete("/admin/:id", async (c) => {
  const db = getDB(c.env);
  const id = c.req.param("id");

  await db.delete(trainers).where(eq(trainers.id, id));
  return c.json({ success: true });
});

export default trainerRoutes;
