// src/components/store/StoreProductsGrid.jsx
import React from 'react';
import ProductCard from '../ui/ProductCard'; // Adjust path as needed

/**
 * StoreProductsGrid Component
 * Displays a grid of product cards.
 *
 * @param {object} props
 * @param {Array<object>} props.products - An array of product objects to display.
 * @param {string} props.brandColor - The primary brand color for theming product cards.
 */
const StoreProductsGrid = ({ products, brandColor }) => {
    if (!products || products.length === 0) {
        return <div className="text-center text-gray-500 py-8">No products to display.</div>;
    }

    console.log('Rendering StoreProductsGrid with products:', products);

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
            {products.map(product => (
                <ProductCard
                    key={product.id}
                    // Now we pass the entire product object directly, as the ProductCard
                    // component handles the Redux logic internally.
                    product={product}
                    brandColor={brandColor}
                />
            ))}
        </div>
    );
};

export default StoreProductsGrid;
