import { useState, useEffect } from 'react';
import { productService } from '../services/productService';
import { Product } from '../types/product';

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await productService.getProducts();
      setProducts(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const createProduct = async (product: Product) => {
    try {
      const newProduct = await productService.createProduct(product);
      setProducts((prev) => [...prev, newProduct]);
    } catch (err: any) {
      setError(err.message || 'Failed to create product');
    }
  };

  const updateProduct = async (id: number, updatedProduct: Product) => {
    try {
      const product = await productService.updateProduct(id, updatedProduct);
      setProducts((prev) => prev.map((p) => (p.id === id ? product : p)));
    } catch (err: any) {
      setError(err.message || 'Failed to update product');
    }
  };

  const deleteProduct = async (id: number) => {
    try {
      await productService.deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err: any) {
      setError(err.message || 'Failed to delete product');
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return { products, loading, error, createProduct, updateProduct, deleteProduct };
};
