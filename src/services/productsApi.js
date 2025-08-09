// src/services/productsApi.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import productImage1 from '../assets/images/storeImages/4.jpg'; // Placeholder image for products
import productImage2 from '../assets/images/storeImages/5.jpg'; // Placeholder image for products
import SashaStoresAvatar from '../assets/images/profileImage.png'; // Placeholder image for store profile

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock initial product data
const MOCK_PRODUCTS = [
    {
        id: 'prod1',
        name: 'Dell Inspiron Laptop 15-inch',
        description: 'Powerful laptop with 8GB RAM, 256GB SSD, and Intel i5 processor. Perfect for work and entertainment.',
        imageUrl: productImage1, 
        currentPrice: 2000000,
        oldPrice: 2200000,
        storeName: 'Sasha Stores', // Assuming products are tied to a store
        storeAvatar: SashaStoresAvatar, // Placeholder for store avatar
        storeRating: 4.5,
        location: 'Lagos, Nigeria',
        isSponsored: true,
        hasFreeDelivery: true,
        bulkDiscountText: '20% Off in bulk',
        category: 'Electronics',
        stock: 50,
    },
    {
        id: 'prod2',
        name: 'Samsung Galaxy S23 Ultra',
        description: 'Flagship smartphone with stunning camera, long-lasting battery, and S Pen support.',
        imageUrl: productImage2,
        currentPrice: 1500000,
        oldPrice: 1650000,
        storeName: 'Sasha Stores',
        storeAvatar: SashaStoresAvatar,
        storeRating: 4.2,
        location: 'Abuja, Nigeria',
        isSponsored: false,
        hasFreeDelivery: false,
        bulkDiscountText: null,
        category: 'Phones',
        stock: 30,
    },
    {
        id: 'prod3',
        name: 'Designer Leather Handbag',
        description: 'Elegant and spacious leather handbag, perfect for everyday use or special occasions.',
        imageUrl: productImage1,
        currentPrice: 120000,
        oldPrice: 150000,
        storeName: 'Sasha Stores',
        storeAvatar: SashaStoresAvatar,
        storeRating: 4.8,
        location: 'Port Harcourt, Nigeria',
        isSponsored: true,
        hasFreeDelivery: true,
        bulkDiscountText: 'Buy 2 Get 10% Off',
        category: 'Fashion',
        stock: 20,
    },
    {
        id: 'prod4',
        name: 'Organic Fresh Groceries Bundle',
        description: 'A weekly bundle of fresh, organic fruits and vegetables delivered to your doorstep.',
        imageUrl: productImage2,
        currentPrice: 25000,
        oldPrice: null,
        storeName: 'Sasha Stores',
        storeAvatar: SashaStoresAvatar,
        storeRating: 4.7,
        location: 'Ibadan, Nigeria',
        isSponsored: false,
        hasFreeDelivery: true,
        bulkDiscountText: null,
        category: 'Groceries',
        stock: 100,
    },
    {
        id: 'prod5',
        name: 'The Alchemist by Paulo Coelho',
        description: 'An international bestseller, The Alchemist is a mystical fable about following your dreams.',
        imageUrl: productImage1,
        currentPrice: 5000,
        oldPrice: 6000,
        storeName: 'Sasha Stores',
        storeAvatar: SashaStoresAvatar,
        storeRating: 4.9,
        location: 'Lagos, Nigeria',
        isSponsored: false,
        hasFreeDelivery: false,
        bulkDiscountText: null,
        category: 'Books',
        stock: 75,
    },
];

// Initialize localStorage with mock data if not already present
if (!localStorage.getItem('products')) {
    localStorage.setItem('products', JSON.stringify(MOCK_PRODUCTS));
}

export const productsApi = createApi({
    reducerPath: 'productsApi',
    baseQuery: fetchBaseQuery({ baseUrl: '/' }), // Base URL is not strictly used for localStorage mock
    tagTypes: ['Product'],

    endpoints: (builder) => ({
        getProducts: builder.query({
            queryFn: async () => {
                await delay(500); // Simulate network delay
                try {
                    const products = JSON.parse(localStorage.getItem('products') || '[]');
                    return { data: products };
                } catch (error) {
                    console.error("Error fetching products:", error);
                    return { error: { status: 'FETCH_ERROR', data: error.message } };
                }
            },
            providesTags: ['Product'],
        }),

        getProductById: builder.query({
            queryFn: async (id) => {
                await delay(300); // Simulate network delay
                try {
                    const products = JSON.parse(localStorage.getItem('products') || '[]');
                    const product = products.find(p => p.id === id);
                    if (product) {
                        return { data: product };
                    }
                    return { error: { status: 'NOT_FOUND', data: 'Product not found' } };
                } catch (error) {
                    console.error("Error fetching product by ID:", error);
                    return { error: { status: 'FETCH_ERROR', data: error.message } };
                }
            },
            providesTags: (result, error, id) => [{ type: 'Product', id }],
        }),

        addProduct: builder.mutation({
            queryFn: async (newProduct) => {
                await delay(500); // Simulate network delay
                try {
                    const products = JSON.parse(localStorage.getItem('products') || '[]');
                    const id = `prod${products.length + 1}`; // Simple ID generation
                    const productToAdd = { ...newProduct, id };
                    products.push(productToAdd);
                    localStorage.setItem('products', JSON.stringify(products));
                    return { data: productToAdd };
                } catch (error) {
                    console.error("Error adding product:", error);
                    return { error: { status: 'ADD_ERROR', data: error.message } };
                }
            },
            invalidatesTags: ['Product'],
        }),

        updateProduct: builder.mutation({
            queryFn: async ({ id, ...patch }) => {
                await delay(500); // Simulate network delay
                try {
                    let products = JSON.parse(localStorage.getItem('products') || '[]');
                    const index = products.findIndex(p => p.id === id);
                    if (index !== -1) {
                        products[index] = { ...products[index], ...patch };
                        localStorage.setItem('products', JSON.stringify(products));
                        return { data: products[index] };
                    }
                    return { error: { status: 'NOT_FOUND', data: 'Product not found' } };
                } catch (error) {
                    console.error("Error updating product:", error);
                    return { error: { status: 'UPDATE_ERROR', data: error.message } };
                }
            },
            invalidatesTags: (result, error, { id }) => [{ type: 'Product', id }],
        }),

        deleteProduct: builder.mutation({
            queryFn: async (id) => {
                await delay(500); // Simulate network delay
                try {
                    let products = JSON.parse(localStorage.getItem('products') || '[]');
                    const initialLength = products.length;
                    products = products.filter(p => p.id !== id);
                    if (products.length < initialLength) {
                        localStorage.setItem('products', JSON.stringify(products));
                        return { data: { success: true, id } };
                    }
                    return { error: { status: 'NOT_FOUND', data: 'Product not found' } };
                } catch (error) {
                    console.error("Error deleting product:", error);
                    return { error: { status: 'DELETE_ERROR', data: error.message } };
                }
            },
            invalidatesTags: (result, error, id) => [{ type: 'Product', id }],
        }),
    }),
});

export const {
    useGetProductsQuery,
    useGetProductByIdQuery,
    useAddProductMutation,
    useUpdateProductMutation,
    useDeleteProductMutation,
} = productsApi;
