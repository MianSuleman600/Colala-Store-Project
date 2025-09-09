// src/api/services.js
import dummyServiceData from '../features/services/pages/data/dummyServiceData.json';
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const getServiceCategories = async () => {
  await delay(300); // simulate API delay
  return dummyServiceData.serviceCategories;
};
