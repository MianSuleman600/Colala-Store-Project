//D:\Project\frontend\src\features\products\pages\data\useDummyData.js

import dummyData from './dummyData.json';

export const useDummyData = () => {
  const { categories, brands, locations, mobileTypes, mobileBrands } = dummyData;
  return { categories, brands, locations, mobileTypes, mobileBrands };
};
