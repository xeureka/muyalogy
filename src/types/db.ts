export type Product = {
  id: number
  name: string
  sku: string
  quantity: number
  price: string 
  category_id?: number | null
  created_at: string
}

export type Category = {
  id: number
  name: string
  slug: string
  created_at: string
}
