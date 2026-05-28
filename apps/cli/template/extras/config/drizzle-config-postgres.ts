import { type Config } from "drizzle-kit";

import { env } from "@/env";

export default {
  out: "./drizzle",
  schema: "./src/server/db/schema",
  dialect: "postgresql",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
  tablesFilter: ["project1_*"],
} satisfies Config;
