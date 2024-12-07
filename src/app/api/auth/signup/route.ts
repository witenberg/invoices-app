import { NextResponse } from 'next/server'
import { hash } from 'bcrypt'
import pool from '@/lib/db'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { username, email, password, login_method } = body

    console.log('Received signup request:', { username, email, login_method })

    if (!username || !email || !login_method) {
      console.log('Missing required fields')
      return NextResponse.json({ error: 'Username, email, and login method are required' }, { status: 400 })
    }

    if (login_method === 'credentials' && !password) {
      console.log('Password missing for credentials login')
      return NextResponse.json({ error: 'Password is required for credentials login' }, { status: 400 })
    }

    let hashedPassword = null
    if (login_method === 'credentials') {
      hashedPassword = await hash(password, 10)
    }
    
    const client = await pool.connect()
    try {
      await client.query('BEGIN')
      const insertUserText = `
        INSERT INTO users(username, email, password, login_method)
        VALUES($1, $2, $3, $4)
        RETURNING userID, username, email, login_method
      `
      const res = await client.query(insertUserText, [username, email, hashedPassword, login_method])
      await client.query('COMMIT')
      
      const user = res.rows[0]
      console.log('User created successfully:', user)
      return NextResponse.json({ user }, { status: 201 })
    } catch (e) {
      await client.query('ROLLBACK')
      console.error('Database error:', e)
      return NextResponse.json({ error: 'User already exists' }, { status: 500 })
    } finally {
      client.release()
    }
  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

