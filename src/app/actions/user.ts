import pool from "@/lib/db"
import type { User } from "next-auth"

export interface ExtendedUser extends User {
  isNewUser?: boolean
  login_method?: string
}

export interface CredentialsUser extends ExtendedUser {
  password: string
  login_method: string
}

export interface GoogleUser extends ExtendedUser {
  isNewUser: boolean
  login_method: string
}

export const findUserByEmail = async (email: string): Promise<CredentialsUser | GoogleUser | null> => {
  const client = await pool.connect()
  try {
    const res = await client.query("SELECT * FROM users WHERE email = $1", [email])
    if (res.rows.length > 0) {
      const userDB = res.rows[0]
      if (userDB.login_method === "google") {
        return {
          id: userDB.userid,
          email: userDB.email,
          login_method: "google",
          isNewUser: false,
        } as GoogleUser
      } else if (userDB.login_method === "credentials") {
        return {
          id: userDB.userid,
          email: userDB.email,
          password: userDB.password,
          login_method: userDB.login_method,
        } as CredentialsUser
      }
    }
    return null
  } catch (err) {
    console.error("Error querying the database", err)
    return null
  } finally {
    client.release()
  }
}

export const addUser = async (name: string, email: string, login_method: string): Promise<GoogleUser> => {
  const client = await pool.connect()
  try {
    const res = await client.query(
      `INSERT INTO users (username, email, login_method) VALUES ($1, $2, $3) RETURNING userid, email, login_method`,
      [name, email, login_method],
    )
    const userDB = res.rows[0]
    return {
      id: userDB.userid,
      email: userDB.email,
      login_method: "google",
      isNewUser: true,
    }
  } catch (err) {
    console.error("Error inserting Google user:", err)
    throw new Error("Error inserting user")
  } finally {
    client.release()
  }
}

