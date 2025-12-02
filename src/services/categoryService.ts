import {db} from "../db/index"
import {categories} from "../db/schema"
import {eq} from "drizzle-orm"
import type { Category } from "../types/db"
import { normalizeMany, normalizeTimestamps } from '../db/normalize'
import { asc } from 'drizzle-orm'


export const categoriesService = {
  async createCategory(payload: { name: string; slug?: string }): Promise<Category> {
    const slug = payload.slug ?? payload.name.trim().toLowerCase().replace(/\s+/g, '-')
    const res = await db.insert(categories).values({ name: payload.name.trim(), slug }).returning()
    // res[0].created_at is Date; convert to string
    return normalizeTimestamps(res[0]) as unknown as Category
  },

  async getCategories(): Promise<Category[]> {
    const res = await db.select().from(categories).orderBy(asc(categories.name))
    return normalizeMany(res) as unknown as Category[]   
  },

  async getCategoryById(id: number): Promise<Category | null> {
    const res = await db.select().from(categories).where(eq(categories.id, id)).limit(1)
    if (!res[0]) return null
    return normalizeTimestamps(res[0]) as unknown as Category
  },

  async updateCategory(id: number, payload: { name?: string; slug?: string }): Promise<Category> {
    const update: any = {}
    if (payload.name) update.name = payload.name.trim()
    if (payload.slug) update.slug = payload.slug
    const res = await db.update(categories).set(update).where(eq(categories.id, id)).returning()
    return normalizeTimestamps(res[0]) as unknown as Category
  },

  async deleteCategory(id: number, force = false): Promise<void> {
    // check for products referencing this category
    const { products } = await import('../db/schema') 
    const referencing = await db.select().from(products).where(eq(products.category_id, id)).limit(1)
    if (referencing.length > 0 && !force) {
      throw new Error('Cannot delete category while products reference it. Use force=true to proceed.')
    }
    await db.delete(categories).where(eq(categories.id, id))
  },
}
