import { NextResponse, type NextRequest } from 'next/server'
import { categoriesService } from '../../../../services/categoryService'

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id)
  const body = await request.json()
  try {
    const updated = await categoriesService.updateCategory(id, body)
    return NextResponse.json(updated)
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? 'Failed to update' }, { status: 400 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const id = Number(params.id)
  const force = request.nextUrl.searchParams.get('force') === '1'
  try {
    await categoriesService.deleteCategory(id, force)
    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? 'Failed to delete' }, { status: 400 })
  }
}
