import React from 'react';
import { useCategories } from '../hooks/useCategories';
import CategoryList from '../../components/CategoryList';

const CategoriesPage = () => {
  const { categories, loading, error } = useCategories();

  if (loading) {
    return <div>Loading categories...</div>;
  }

  if (error) {
    return <div>Error loading categories: {error.message}</div>;
  }

  return (
    <div>
      <h1>Categories</h1>
      <CategoryList categories={categories} />
    </div>
  );
};

export default CategoriesPage;
