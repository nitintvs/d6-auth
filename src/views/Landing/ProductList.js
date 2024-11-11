import React from 'react';
import Grid from '@mui/material/Grid';
import ProductCard from './ProductCard';

const products = [
  {
    id: 1,
    name: 'Jubilee Atta Wheat Flour 5kg',
    price: 128.00,
    oldPrice: 160.00,
    image: 'path/to/jubilee-image.jpg'
  },
  {
    id: 2,
    name: 'KMA Farali Khakhra 200GM',
    price: 45.00,
    image: 'path/to/kma-image.jpg'
  },
  {
    id: 3,
    name: 'Another Product',
    price: 75.00,
    image: 'path/to/another-product.jpg'
  },
  {
    id: 3,
    name: 'Another Product',
    price: 75.00,
    image: 'path/to/another-product.jpg'
  },
  {
    id: 3,
    name: 'Another Product',
    price: 75.00,
    image: 'path/to/another-product.jpg'
  }
];

const ProductList = () => {
  return (
    <Grid container spacing={2}>
    {products.map(product => (
      <Grid item xs={6} key={product.id}>
        <ProductCard product={product} />
      </Grid>
    ))}
  </Grid>
  );
};

export default ProductList;
