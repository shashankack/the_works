import { cors as honoCors } from "hono/cors";

export const cors = () =>
  honoCors({
    origin: [
      "localhost:5137", 
      "http://localhost:5173", 
      "http://localhost:5174",
      "https://localhost:5173",
      "https://localhost:5174"
    ],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowHeaders: ["Content-Type", "Authorization"],
    maxAge: 600,
  });
