require('dotenv').config({ path: '.env.local' });
import { Knex } from "knex";

// Update with your config settings.

const config: Knex.Config = {
  client: "pg",
  connection: process.env.POSTGRES_URL ,
  migrations: {
    extension: "ts",
  },
}

export default config;