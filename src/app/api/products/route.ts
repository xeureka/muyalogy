import { NextResponse } from 'next/server'
import { productsService } from '../../../services/productService'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const page = Number(url.searchParams.get('page') ?? 1)
  const pageSize = Number(url.searchParams.get('pageSize') ?? 50)
  const search = url.searchParams.get('search') ?? undefined
  const categoryId = url.searchParams.get('categoryId') ? Number(url.searchParams.get('categoryId')) : undefined

  const res = await productsService.list({ page, pageSize, search, categoryId })
  return NextResponse.json(res)
}

export async function POST(request: Request) {
  const body = await request.json()
  try {
    const product = await productsService.create(body)
    return NextResponse.json(product, { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? 'Failed to create product' }, { status: 400 })
  }
}
