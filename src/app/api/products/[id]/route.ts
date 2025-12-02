import { NextResponse } from 'next/server'
import { productsService } from '../../../../services/productService'

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id)
  const product = await productsService.getById(id)
  if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(product)
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id)
  const body = await request.json()
  try {
    const product = await productsService.update(id, body)
    return NextResponse.json(product)
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? 'Failed to update' }, { status: 400 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id)
  await productsService.delete(id)
  return NextResponse.json({ success: true })
}
