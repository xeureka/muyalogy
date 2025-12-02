import apiClient from './apiClient'
import { Category } from '../types/category'

const categoryService = {
  async getCategories(): Promise<Category[]> {
    const response = await apiClient.get('/categories')
    return response.data
  },

  async getCategoryById(id: number): Promise<Category> {
    const response = await apiClient.get(`/categories/${id}`)
    return response.data
  },

  async createCategory(category: Omit<Category, 'id'>): Promise<Category> {
    const response = await apiClient.post('/categories', category)
    return response.data
  },

  async updateCategory(id: number, category: Category): Promise<Category> {
    const response = await apiClient.put(`/categories/${id}`, category)
    return response.data
  },

  async deleteCategory(id: number, force: boolean = false): Promise<void> {
    await apiClient.delete(`/categories/${id}`, { params: { force } })
  }
}

export { categoryService }
