import { pool } from "./db";

export const sql = async (strings: string) => {
    const client = await pool.connect();
     try {
          const result = await client.query(strings);
          return result;
     } catch (err) {
          throw err;
     }
      finally {
          client.release();
     }
}