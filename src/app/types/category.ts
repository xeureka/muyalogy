export interface Category {
  id: number;
  name: string;
  description?: string; // Optional field for additional information about the category
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}