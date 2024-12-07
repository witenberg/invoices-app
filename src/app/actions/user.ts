import pool from '@/lib/db'

interface User {
    email: string;
    password: string;
    login_method: string;
  }

export const findUserByEmail = async (email: string): Promise<User | null> => {
    const client = await pool.connect()
  try {
    const res = await client.query('SELECT * FROM users WHERE email = $1', [email]);
    return res.rows.length > 0 ? res.rows[0] : null;
  } catch (err) {
    console.error('Error querying the database', err);
    return null;
  }
};
