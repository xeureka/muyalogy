import { NextResponse } from 'next/server'
import { productsService } from '../../../../../services/productService'

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id)
  const body = await request.json()
  const delta = Number(body.delta)
  const allowNegative = Boolean(body.allowNegative)
  try {
    const updated = await productsService.adjustStock(id, delta, { allowNegative })
    return NextResponse.json(updated)
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? 'Failed to adjust stock' }, { status: 400 })
  }
}
