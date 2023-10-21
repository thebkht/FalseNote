require('dotenv').config({ path: '.env.local' });
import { Knex } from "knex";

// Update with your config settings.

const config: Knex.Config = {
  client: "pg",
  connection: process.env.POSTGRES_URL + (process.env.NODE_ENV === "production" ? "?sslmode=require" : ""),
  migrations: {
    extension: "ts",
  },
}

export default config;