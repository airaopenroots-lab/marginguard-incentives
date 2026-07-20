import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || "postgresql://marginguard:marginguard_dev@localhost:5432/marginguard_incentives",
});

export const db = drizzle(pool, { schema });
