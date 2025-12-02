import { unique } from 'drizzle-orm/gel-core'
import {
  pgTable,
  serial,
  text,
  integer,
  numeric,
  timestamp,
  varchar,
  uniqueIndex,
} from 'drizzle-orm/pg-core'


// catagories table
export const categories = pgTable('catagories',{
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    slug: varchar('slug',{length: 128}).notNull(),
    created_at: timestamp("created_at").defaultNow().notNull(),
},(table) => {
  return {
    // enforce uniqueness on name and slug
    unique_name: uniqueIndex('categories_name_unique').on(table.name),
    unique_slug: uniqueIndex('categories_slug_unique').on(table.slug),
  }
})

/**
 * products table
 * 
 * fields
 * id,name,sku,quantity, cataory_id, created_ast
 */

export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  sku: varchar('sku', { length: 64 }).notNull(), 
  quantity: integer('quantity').notNull().default(0),
  price: numeric('price', { precision: 12, scale: 2 }).notNull().default("0"),
  category_id: integer('category_id').references(() => categories.id),
  created_at: timestamp('created_at').defaultNow().notNull(),
}, (table) => {
  return {
    unique_sku: uniqueIndex('products_sku_unique').on(table.sku),
    idx_category: uniqueIndex('products_category_idx').on(table.category_id),
  }
})
