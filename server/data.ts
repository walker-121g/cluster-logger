"use server";

import * as Schema from "@/schema";
import { drizzle } from "drizzle-orm/node-postgres";

export default drizzle(process.env.DATABASE_URL!, {
  schema: Schema,
});
