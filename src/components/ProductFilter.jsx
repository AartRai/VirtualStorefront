import { Filter, Star, X } from 'lucide-react';
import { useState, useEffect } from 'react';

const ProductFilter = ({
    selectedCategory, setSelectedCategory,
    priceRange, setPriceRange,
    selectedBrands, setSelectedBrands,
    minRating, setMinRating,
    availableBrands,
    onClearFilters
}) => {
    const categories = ['All', 'Fashion', 'Electronics', 'Home', 'Beauty', 'Mobiles', 'Appliances', 'Grocery', 'Travel'];

    return (
        <aside className="w-full md:w-72 flex-shrink-0">
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-8 rounded-[2rem] shadow-lg sticky top-24">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                        <Filter className="h-5 w-5 mr-2 text-primary" />
                        <h2 className="text-xl font-bold text-dark dark:text-white">Filters</h2>
                    </div>
                </div>

                {/* Category Filter */}
                <div className="mb-8">
                    <h3 className="font-bold text-dark dark:text-white mb-4">Category</h3>
                    <div className="space-y-2">
                        {categories.map(category => (
                            <label key={category} className="flex items-center cursor-pointer group">
                                <input
                                    type="radio"
                                    name="category"
                                    checked={selectedCategory === category}
                                    onChange={() => setSelectedCategory(category)}
                                    className="hidden"
                                />
                                <span className={`text-sm transition ${selectedCategory === category ? 'text-primary font-bold' : 'text-gray-600 dark:text-gray-400 group-hover:text-primary'}`}>
                                    {category}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Brand Filter */}
                <div className="mb-8">
                    <h3 className="font-bold text-dark dark:text-white mb-4">Brands</h3>
                    <div className="space-y-2 max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
                        {availableBrands.map(brand => (
                            <label key={brand} className="flex items-center cursor-pointer group">
                                <input
                                    type="checkbox"
                                    checked={selectedBrands.includes(brand)}
                                    onChange={() => {
                                        if (selectedBrands.includes(brand)) {
                                            setSelectedBrands(selectedBrands.filter(b => b !== brand));
                                        } else {
                                            setSelectedBrands([...selectedBrands, brand]);
                                        }
                                    }}
                                    className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-primary focus:ring-primary bg-white dark:bg-gray-700"
                                />
                                <span className="ml-3 text-sm text-gray-600 dark:text-gray-400 group-hover:text-primary transition">{brand}</span>
                            </label>
                        ))}
                        {availableBrands.length === 0 && (
                            <span className="text-xs text-gray-400 italic">No brands available</span>
                        )}
                    </div>
                </div>

                {/* Rating Filter */}
                <div className="mb-8">
                    <h3 className="font-bold text-dark dark:text-white mb-4">Rating</h3>
                    <div className="space-y-2">
                        {[4, 3, 2, 1].map(rating => (
                            <label key={rating} className="flex items-center cursor-pointer group">
                                <input
                                    type="radio"
                                    name="rating"
                                    checked={minRating === rating}
                                    onChange={() => setMinRating(rating)}
                                    onClick={() => {
                                        if (minRating === rating) setMinRating(0); // Toggle off
                                    }}
                                    className="hidden"
                                />
                                <div className={`flex items-center px-3 py-1 rounded-lg transition ${minRating === rating ? 'bg-orange-50 dark:bg-gray-700 ring-1 ring-primary' : 'hover:bg-gray-50 dark:hover:bg-gray-700'}`}>
                                    <div className="flex text-yellow-400 mr-2">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className={`h-3 w-3 ${i < rating ? 'fill-current' : 'text-gray-300 dark:text-gray-600'}`} />
                                        ))}
                                    </div>
                                    <span className="text-sm text-gray-600 dark:text-gray-400">& Up</span>
                                </div>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Price Filter */}
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-dark dark:text-white">Max Price</h3>
                        <span className="text-primary font-bold">₹{priceRange.toLocaleString()}</span>
                    </div>
                    <input
                        type="range"
                        min="0"
                        max="200000"
                        step="1000"
                        value={priceRange}
                        onChange={(e) => setPriceRange(Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                </div>

                <button
                    onClick={onClearFilters}
                    className="mt-8 w-full py-2 border border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition flex items-center justify-center gap-2"
                >
                    <X size={16} /> Clear Filters
                </button>
            </div>
        </aside>
    );
};

export default ProductFilter;
