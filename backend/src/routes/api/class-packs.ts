import { Hono } from "hono";
import { getDB } from "@/db/client";
import { classPacks } from "@/db/schema";
import { authMiddleware } from "@/middleware/auth";
import { nanoid } from "nanoid";
import { eq } from "drizzle-orm";
import { validate, classPackSchema } from "@/middleware/validate";

const packRoutes = new Hono<{ Bindings: Env }>();

// ✅ GET public packs (only active ones)
packRoutes.get("/public", async (c) => {
  const db = getDB(c.env);
  const result = await db
    .select()
    .from(classPacks)
    .where(eq(classPacks.isActive, 1));

  return c.json(result);
});

// ✅ GET all packs (admin view, includes inactive)
packRoutes.get("/", async (c) => {
  const db = getDB(c.env);
  const result = await db.select().from(classPacks);
  return c.json(result);
});

// ✅ GET one pack by ID
packRoutes.get("/:id", async (c) => {
  const db = getDB(c.env);
  const result = await db
    .select()
    .from(classPacks)
    .where(eq(classPacks.id, c.req.param("id")));

  if (!result.length) {
    return c.json({ error: "Not found" }, 404);
  }

  return c.json(result[0]);
});

// ✅ POST a new pack (admin only)
packRoutes.post(
  "/",
  authMiddleware("admin"),
  validate(classPackSchema),
  async (c) => {
    const db = getDB(c.env);
    const body = c.get("validatedBody");

    const pack = {
      id: `class_pack_${nanoid()}`,
      classType: body.classType,
      title: body.title,
      description: body.description ?? null,
      numberOfSessions: body.numberOfSessions,
      price: body.price,
      duration: body.duration,
      isActive: 1, // default active
      createdAt: new Date().toISOString(),
    };

    await db.insert(classPacks).values(pack);
    return c.json(pack, 201);
  }
);

// ✅ PUT update pack (admin only)
packRoutes.put(
  "/:id",
  authMiddleware("admin"),
  validate(classPackSchema),
  async (c) => {
    const db = getDB(c.env);
    const id = c.req.param("id");
    const body = c.get("validatedBody");

    const update = {
      classType: body.classType,
      title: body.title,
      description: body.description ?? null,
      numberOfSessions: body.numberOfSessions,
      price: body.price,
      duration: body.duration,
      isActive: body.isActive ? 1 : 0,
    };

    await db.update(classPacks).set(update).where(eq(classPacks.id, id));
    return c.json({ success: true, updated: { id, ...update } });
  }
);

// ✅ PATCH toggle active
packRoutes.patch("/:id/active", authMiddleware("admin"), async (c) => {
  const db = getDB(c.env);
  const id = c.req.param("id");
  const { isActive } = await c.req.json<{ isActive: boolean }>();

  await db
    .update(classPacks)
    .set({ isActive: isActive ? 1 : 0 })
    .where(eq(classPacks.id, id));

  return c.json({ success: true, updated: { id, isActive } });
});

// ✅ DELETE (hard delete)
packRoutes.delete("/:id", authMiddleware("admin"), async (c) => {
  const db = getDB(c.env);
  await db.delete(classPacks).where(eq(classPacks.id, c.req.param("id")));
  return c.json({ success: true });
});

export default packRoutes;
