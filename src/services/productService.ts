import postgres from "postgres";
import type { Product } from "../types/db";
import { normalizeMany, normalizeTimestamps } from '../db/normalize';

const sql = postgres(process.env.DATABASE_URL || "");

type CreateProductPayload = {
  name: string;
  sku: string;
  quantity?: number;
  price?: number | string;
  category_id?: number | null;
};

type UpdateProductPayload = Partial<CreateProductPayload>;

export const productsService = {
  async create(payload: CreateProductPayload): Promise<Product> {
    if (!payload.name || !payload.sku) throw new Error('name and sku are required');

    const res = await sql`
      INSERT INTO products (name, sku, quantity, price, category_id)
      VALUES (${payload.name.trim()}, ${payload.sku.trim()}, ${payload.quantity ?? 0}, ${payload.price ?? 0}, ${payload.category_id ?? null})
      RETURNING id, name, sku, quantity, price, category_id, created_at
    `;
    
    if (!res[0]) throw new Error('Failed to create product');
    return normalizeTimestamps(res[0]) as unknown as Product;
  },
async list(opts?: { page?: number; pageSize?: number; search?: string; categoryId?: number }) {
  const page = Math.max(1, opts?.page ?? 1);
  const pageSize = Math.max(1, Math.min(200, opts?.pageSize ?? 50));
  const offset = (page - 1) * pageSize;

  // Build conditions dynamically
  const conditions: any[] = [];
  const values: any[] = [];
  
  if (opts?.search && opts.search.trim().length > 0) {
    const q = `%${opts.search.trim().toLowerCase()}%`;
    conditions.push(sql`(LOWER(p.name) LIKE ${q} OR LOWER(p.sku) LIKE ${q})`);
  }

  if (opts?.categoryId) {
    conditions.push(sql`p.category_id = ${opts.categoryId}`);
  }

  let whereSQL = sql``;
  if (conditions.length > 0) {
    whereSQL = sql`WHERE `;
    conditions.forEach((condition, index) => {
      if (index > 0) {
        whereSQL = sql`${whereSQL} AND ${condition}`;
      } else {
        whereSQL = sql`${whereSQL} ${condition}`;
      }
    });
  }

  const countRes = await sql`
    SELECT COUNT(*)::int AS total
    FROM products p
    ${whereSQL}
  `;
  
  const total = Number(countRes[0]?.total ?? 0);

  const items = await sql`
    SELECT
      p.id, p.name, p.sku, p.quantity, p.price, p.category_id, p.created_at,
      c.name AS category_name
    FROM products p
    LEFT JOIN categories c ON c.id = p.category_id
    ${whereSQL}
    ORDER BY p.created_at DESC
    LIMIT ${pageSize} OFFSET ${offset}
  `;

  return { 
    items: normalizeMany(items) as unknown as Array<Product & { category_name?: string }>, 
    total 
  };
},
  async getById(id: number): Promise<(Product & { category_name?: string }) | null> {
    const res = await sql`
      SELECT
        p.id, p.name, p.sku, p.quantity, p.price, p.category_id, p.created_at,
        c.name AS category_name
      FROM products p
      LEFT JOIN categories c ON c.id = p.category_id
      WHERE p.id = ${id}
      LIMIT 1
    `;
    
    if (!res[0]) return null;
    return normalizeTimestamps(res[0]) as unknown as (Product & { category_name?: string });
  },

  async update(id: number, payload: UpdateProductPayload): Promise<Product> {
    const updates: Record<string, any> = {};
    
    if (payload.name !== undefined) updates.name = payload.name.trim();
    if (payload.sku !== undefined) updates.sku = payload.sku.trim();
    if (payload.quantity !== undefined) updates.quantity = Number(payload.quantity);
    if (payload.price !== undefined) updates.price = Number(payload.price);
    if (payload.category_id !== undefined) updates.category_id = payload.category_id ?? null;

    if (Object.keys(updates).length === 0) {
      const existing = await this.getById(id);
      if (!existing) throw new Error('Product not found');
      return existing as any;
    }

    const res = await sql`
      UPDATE products
      SET ${sql(updates)}
      WHERE id = ${id}
      RETURNING id, name, sku, quantity, price, category_id, created_at
    `;

    if (!res[0]) throw new Error('Product not found');
    return normalizeTimestamps(res[0]) as unknown as Product;
  },

  async delete(id: number): Promise<void> {
    await sql`DELETE FROM products WHERE id = ${id}`;
  },

  async adjustStock(id: number, delta: number, options?: { allowNegative?: boolean }) {
    if (!Number.isInteger(delta)) {
      throw new Error('delta must be an integer');
    }

    try {
      const result = await sql.begin(async (sql) => {
        const existRes = await sql`
          SELECT quantity FROM products WHERE id = ${id} FOR UPDATE
        `;
        
        if (existRes.length === 0) {
          throw new Error('Product not found');
        }
        
        const currentQty = Number(existRes[0].quantity);
        const newQty = currentQty + delta;
        
        if (!options?.allowNegative && newQty < 0) {
          throw new Error('Insufficient stock (would go negative)');
        }

        await sql`
          UPDATE products SET quantity = ${newQty} WHERE id = ${id}
        `;
        
        const updatedRes = await sql`
          SELECT id, name, sku, quantity, price, category_id, created_at 
          FROM products WHERE id = ${id}
        `;
        
        return updatedRes[0];
      });

      return normalizeTimestamps(result) as unknown as Product;
    } catch (err) {
      throw err;
    }
  },
};
