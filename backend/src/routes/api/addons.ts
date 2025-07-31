import { Hono } from "hono";
import { getDB } from "@/db/client";
import { addons } from "@/db/schema";
import { authMiddleware } from "@/middleware/auth";
import { validate, addonSchema } from "@/middleware/validate";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";

const addonRoutes = new Hono<{ Bindings: Env }>();

// Public GET route - no auth required for viewing addons
// GET /api/addons
addonRoutes.get("/", async (c) => {
  const db = getDB(c.env);
  const result = await db.select().from(addons).where(eq(addons.isActive, true));
  return c.json(result);
});

// All other routes require admin auth
addonRoutes.use("*", authMiddleware("admin"));

// POST /api/addons
addonRoutes.post("/", validate(addonSchema), async (c) => {
  const db = getDB(c.env);
  const body = c.get("validatedBody");

  const newAddon = {
    id: `addon_${nanoid()}`,
    name: body.name,
    description: body.description || "",
    price: body.price,
  };

  await db.insert(addons).values(newAddon);
  return c.json(newAddon, 201);
});

// PUT /api/addons/:id Supports partial updates
addonRoutes.put("/:id", validate(addonSchema), async (c) => {
  const db = getDB(c.env);
  const id = c.req.param("id");
  const body = c.get("validatedBody");

  const updateData: any = {};
  if (body.name) updateData.name = body.name;
  if (body.description) updateData.description = body.description;
  if (body.price !== undefined) updateData.price = body.price;

  const result = await db
    .update(addons)
    .set(updateData)
    .where(eq(addons.id, id));

  if (result.changes === 0) {
    return c.json({ error: "Addon not found" }, 404);
  }

  return c.json(result);
});

// PATCH /api/addons/:id/active
addonRoutes.patch("/:id/active", async (c) => {
  const db = getDB(c.env);
  const id = c.req.param("id");
  const body = await c.req.json();

  if (typeof body.isActive !== "boolean") {
    return c.json({ error: "isActive must be a boolean" }, 400);
  }

  const result = await db
    .update(addons)
    .set({ isActive: body.isActive })
    .where(eq(addons.id, id));

  if (result.changes === 0) {
    return c.json({ error: "Addon not found" }, 404);
  }

  return c.json({ success: true });
});

export default addonRoutes;
