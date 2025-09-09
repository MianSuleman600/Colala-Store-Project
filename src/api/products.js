// src/api/products.js
import dummyData from '../features/products/pages/data/dummyData.json';
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const getProductsData = async () => {
  await delay(300); // simulate API delay
  return {
    categories: dummyData.categories,
    brands: dummyData.brands,
    locations: dummyData.locations,
    mobileTypes: dummyData.mobileTypes,
    mobileBrands: dummyData.mobileBrands,
  };
};
