// This is a Next.js API Route for token validation
// File: src/app/api/auth/validate-token/route.js

import { NextResponse } from 'next/server'

export async function POST(req) {
  try {
    const { token } = await req.json()
    
    if (!token) {
      return NextResponse.json({ error: 'Token required' }, { status: 400 })
    }
    
    // Call the backend API to validate the token
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/session`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
    
    if (!response.ok) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }
    
    const data = await response.json()
    
    return NextResponse.json({
      user: data.user,
      session: data.session
    })
    
  } catch (error) {
    console.error('Error validating token:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
