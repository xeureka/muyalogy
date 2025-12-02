import { NextResponse } from 'next/server'
import { categoriesService } from '../../../services/categoryService'

export async function GET() {
  const cats = await categoriesService.getCategories()
  return NextResponse.json(cats)
}

export async function POST(request: Request) {
  const body = await request.json()
  try {
    const cat = await categoriesService.createCategory(body)
    return NextResponse.json(cat, { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? 'Failed to create category' }, { status: 400 })
  }
}
