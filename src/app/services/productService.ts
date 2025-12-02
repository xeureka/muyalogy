import apiClient from './apiClient';
import { Product } from '../types/product';

const productService = {
  async createProduct(productData: Omit<Product, 'id' | 'created_at'>): Promise<Product> {
    const response = await apiClient.post('/products', productData);
    return response.data;
  },

  async getProducts(): Promise<Product[]> {
    const response = await apiClient.get('/products');
    return response.data;
  },

  async getProductById(id: number): Promise<Product> {
    const response = await apiClient.get(`/products/${id}`);
    return response.data;
  },

  async updateProduct(id: number, productData: Partial<Product>): Promise<Product> {
    const response = await apiClient.put(`/products/${id}`, productData);
    return response.data;
  },

  async deleteProduct(id: number): Promise<void> {
    await apiClient.delete(`/products/${id}`);
  }
};

export default productService;
