import postgres from "postgres";

export const sql = process.env.NODE_ENV === "production" ? postgres(`${process.env.POSTGRES_URL}`, {
     user: process.env.POSTGRES_USER,
     host: process.env.POSTGRES_HOST,
     database: process.env.POSTGRES_DATABASE,
     password: process.env.POSTGRES_PASSWORD,
     port: 5432,
     ssl: {
          rejectUnauthorized: false,
     },
}) : postgres(`${process.env.POSTGRES_URL}`, {
     user: process.env.POSTGRES_USER,
     host: process.env.POSTGRES_HOST,
     database: process.env.POSTGRES_DATABASE,
     password: process.env.POSTGRES_PASSWORD,
     port: 5432,
     
});