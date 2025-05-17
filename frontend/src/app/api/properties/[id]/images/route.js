// This is a Next.js API Route for handling property image uploads
// File: src/app/api/properties/[id]/images/route.js

import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { join } from 'path'
import { writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import { v4 as uuidv4 } from 'uuid'

// Helper function to validate JWT token
async function validateToken(token) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/validate-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    })
    
    if (!response.ok) {
      return null
    }
    
    const data = await response.json()
    return data.user
  } catch (error) {
    console.error('Error validating token:', error)
    return null
  }
}

// Main API handler
export async function POST(req, { params }) {
  try {
    const propertyId = params.id
    
    // Get token from cookies or authorization header
    const cookieStore = cookies()
    const token = cookieStore.get('token')?.value || req.headers.get('Authorization')?.split(' ')[1]
    
    if (!token) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }
    
    // Validate token
    const user = await validateToken(token)
    
    if (!user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }
    
    // Check if user is authorized (sales_ops or admin)
    if (!['sales_ops', 'admin'].includes(user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }
    
    // Process the multipart form data
    const formData = await req.formData()
    const images = formData.getAll('images')
    const types = formData.getAll('types')
    const orders = formData.getAll('orders')
    
    if (!images || images.length === 0) {
      return NextResponse.json({ error: 'No images provided' }, { status: 400 })
    }
    
    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), 'public', 'uploads', 'properties', propertyId)
    
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true })
    }
    
    // Process each image
    const processedImages = []
    
    for (let i = 0; i < images.length; i++) {
      const file = images[i]
      const type = types[i] || 'property'
      const order = orders[i] || i
      
      if (!(file instanceof File)) {
        continue
      }
      
      // Generate a unique filename
      const fileExt = file.name.split('.').pop()
      const fileName = `${uuidv4()}.${fileExt}`
      const typeDir = join(uploadsDir, type)
      
      // Create type directory if it doesn't exist
      if (!existsSync(typeDir)) {
        await mkdir(typeDir, { recursive: true })
      }
      
      const filePath = join(typeDir, fileName)
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)
      
      // Write the file to disk
      await writeFile(filePath, buffer)
      
      // Create public URL
      const publicUrl = `/uploads/properties/${propertyId}/${type}/${fileName}`
      
      // Add to processed images
      processedImages.push({
        url: publicUrl,
        type,
        order
      })
    }
    
    // Save to database via backend API
    const apiResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/properties/${propertyId}/images`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ images: processedImages })
    })
    
    if (!apiResponse.ok) {
      const error = await apiResponse.json()
      return NextResponse.json({ error: error.error?.message || 'Failed to save images' }, { status: apiResponse.status })
    }
    
    const apiData = await apiResponse.json()
    
    return NextResponse.json({
      message: 'Images uploaded successfully',
      images: processedImages
    })
    
  } catch (error) {
    console.error('Error uploading images:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}