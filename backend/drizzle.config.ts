import { defineConfig } from "drizzle-kit";
import "dotenv/config";

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./src/db/migrations",
  dialect: "sqlite",
  driver: "d1-http",
  dbCredentials: {
    accountId: process.env.D1_ACC_ID!,
    databaseId: process.env.D1_DB_ID!,
    token: process.env.D1_DB_TOKEN!,
  },
});
