import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { productService } from '../../../../services/productService';
import ProductForm from '../../../../components/ProductForm';

const ProductPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      const fetchProduct = async () => {
        try {
          const fetchedProduct = await productService.getProductById(id);
          setProduct(fetchedProduct);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

      fetchProduct();
    }
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Product Details</h1>
      {product && <ProductForm product={product} />}
    </div>
  );
};

export default ProductPage;