// import postgres from "postgres";

// export const sql = process.env.NODE_ENV === "production" ? postgres(`${process.env.POSTGRES_URL}`, {
//      user: process.env.POSTGRES_USER,
//      host: process.env.POSTGRES_HOST,
//      database: process.env.POSTGRES_DATABASE,
//      password: process.env.POSTGRES_PASSWORD,
//      port: 5432,
//      ssl: {
//           rejectUnauthorized: false,
//      },
// }) : postgres(`${process.env.POSTGRES_URL}`, {
//      user: process.env.POSTGRES_USER,
//      host: process.env.POSTGRES_HOST,
//      database: process.env.POSTGRES_DATABASE,
//      password: process.env.POSTGRES_PASSWORD,
//      port: 5432,
     
// });

import { Pool } from 'pg';

const pool = new Pool(process.env.NODE_ENV === "production" ? {
     user: process.env.POSTGRES_USER,
     host: process.env.POSTGRES_HOST,
     database: process.env.POSTGRES_DATABASE,
     password: process.env.POSTGRES_PASSWORD,
     port: 5432,
     ssl: {
          rejectUnauthorized: false,
     },
} : {
     user: process.env.POSTGRES_USER,
     host: process.env.POSTGRES_HOST,
     database: process.env.POSTGRES_DATABASE,
     password: process.env.POSTGRES_PASSWORD,
     port: 5432,
});

export const sql = async (string : string, values?: any[]) => {
     const result = await pool.query(string, values);
     return result.rows;
}