import { Hono } from "hono";
import { hash, compare } from "bcrypt-ts";
import { nanoid } from "nanoid";
import { signJWT, verifyJWT } from "@/lib/auth";
import { getDB } from "@/db/client";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { authMiddleware } from "@/middleware/auth";
import { validate, loginSchema, registerSchema } from "@/middleware/validate";

const auth = new Hono<{ Bindings: Env }>();

// ✅ POST /api/auth/token
auth.post("/token", validate(loginSchema), async (c) => {
  const { email, password } = c.get("validatedBody");
  const db = getDB(c.env);

  const result = await db.query.users.findFirst({
    where: eq(users.email, email),
  });
  const user = result;

  if (!user || !(await compare(password, user.passwordHash))) {
    return c.json({ error: "Invalid credentials" }, 401);
  }

  const accessToken = await signJWT(
    { userId: user.id, role: user.role },
    c.env.JWT_SECRET,
    "30m"
  );
  const refreshToken = await signJWT(
    { userId: user.id, role: user.role },
    c.env.JWT_SECRET,
    "1d"
  );

  return c.json({
    accessToken,
    refreshToken,
  });
});

// ✅ POST /api/auth/refresh
auth.post("/refresh", async (c) => {
  const { refreshToken } = await c.req.json();
  if (!refreshToken) return c.json({ error: "Refresh token is required" }, 400);

  const payload = await verifyJWT<{ userId: string; role: string }>(
    refreshToken,
    c.env.JWT_SECRET
  );
  if (!payload) return c.json({ error: "Invalid refresh token" }, 401);

  const newAccessToken = await signJWT(
    { userId: payload.userId, role: payload.role },
    c.env.JWT_SECRET,
    "30m"
  );
  return c.json({
    accessToken: newAccessToken,
  });
});

// ✅ POST /api/auth/register
auth.post("/register", validate(registerSchema), async (c) => {
  const body = c.get("validatedBody");
  const db = getDB(c.env);

  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.email, body.email));

  if (existingUser.length > 0) {
    return c.json({ error: "Email already registered" }, 400);
  }

  const newUser = {
    id: `user_${nanoid()}`,
    firstName: body.firstName,
    lastName: body.lastName,
    email: body.email,
    phone: body.phone,
    passwordHash: await hash(body.password, 10),
    role: "user",
    createdAt: new Date().toISOString(),
  };

  await db.insert(users).values(newUser);

  const accessToken = await signJWT(
    { userId: newUser.id, role: "user" },
    c.env.JWT_SECRET,
    "30m"
  );
  const refreshToken = await signJWT(
    { userId: newUser.id, role: "user" },
    c.env.JWT_SECRET,
    "1d"
  );

  return c.json({
    accessToken,
    refreshToken,
  });
});

// ✅ GET /api/auth/me
auth.get("/me", authMiddleware(), async (c) => {
  const userPayload = c.get("user") as { userId: string; role: string }; // This is just { userId, role }
  const db = getDB(c.env);
  
  // Fetch the full user record from database
  const user = await db.query.users.findFirst({
    where: eq(users.id, userPayload.userId),
  });
  
  if (!user) {
    return c.json({ error: "User not found" }, 404);
  }
  
  const safeUser = {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phone: user.phone,
    role: user.role,
  };
  return c.json(safeUser);
});

export default auth;
