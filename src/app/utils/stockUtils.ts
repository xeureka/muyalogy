import { Product } from '../types/product';

export function increaseStock(product: Product, amount: number): Product {
  return {
    ...product,
    quantity: product.quantity + amount,
  };
}

export function decreaseStock(product: Product, amount: number): Product {
  const newQuantity = product.quantity - amount;
  if (newQuantity < 0) {
    throw new Error('Stock cannot be negative');
  }
  return {
    ...product,
    quantity: newQuantity,
  };
}

export function isStockLow(product: Product, threshold: number): boolean {
  return product.quantity < threshold;
}
