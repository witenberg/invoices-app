import { NextResponse } from 'next/server'
import { compare } from 'bcrypt'
import pool from '@/lib/db'

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
    }

    const client = await pool.connect()
    try {
      const res = await client.query('SELECT * FROM users WHERE email = $1 AND login_method = $2', [email, 'credentials'])
      const user = res.rows[0]

      if (!user) {
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
      }

      const isValid = await compare(password, user.password)

      if (!isValid) {
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
      }

      // Don't send the password back to the client
      const { password: _, ...userWithoutPassword } = user

      return NextResponse.json({ user: userWithoutPassword }, { status: 200 })
    } finally {
      client.release()
    }
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

