import React from 'react';
import { useProducts } from '../hooks/useProducts';
import { useCategories } from '../hooks/useCategories';
import StockControls from '../../components/StockControls';
import ProductList from '../../components/ProductList';
import CategoryList from '../../components/CategoryList';

const DashboardPage = () => {
  const { products } = useProducts();
  const { categories } = useCategories();

  return (
    <div>
      <h1>Dashboard</h1>
      <StockControls />
      <section>
        <h2>Products Overview</h2>
        <ProductList products={products} />
      </section>
      <section>
        <h2>Categories Overview</h2>
        <CategoryList categories={categories} />
      </section>
    </div>
  );
};

export default DashboardPage;
