import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Filter, Star, ShoppingCart, Heart } from 'lucide-react';
import { products } from '../data/mockData';
import { useWishlist } from '../context/WishlistContext';

const Shop = () => {
    const [searchParams] = useSearchParams();
    const initialSearch = searchParams.get('search') || '';
    const initialCategory = searchParams.get('category') || 'All';

    const [selectedCategory, setSelectedCategory] = useState(initialCategory);
    const [priceRange, setPriceRange] = useState(1500);
    const [searchQuery, setSearchQuery] = useState(initialSearch);
    const [selectedBrands, setSelectedBrands] = useState([]);
    const [minRating, setMinRating] = useState(0);
    const [sortBy, setSortBy] = useState('popular');

    const { isInWishlist, toggleWishlist } = useWishlist();

    useEffect(() => {
        setSearchQuery(searchParams.get('search') || '');
        const categoryParam = searchParams.get('category');
        if (categoryParam) {
            setSelectedCategory(categoryParam);
        }
    }, [searchParams]);

    const categories = ['All', 'Fashion', 'Electronics', 'Home', 'Beauty', 'Mobiles', 'Appliances', 'Grocery', 'Travel'];

    // Extract unique brands
    const brands = [...new Set(products.map(p => p.shop))];

    const filteredProducts = products.filter(product => {
        const categoryMatch = selectedCategory === 'All' || product.category === selectedCategory;
        const priceMatch = product.price <= priceRange;
        const searchMatch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.shop.toLowerCase().includes(searchQuery.toLowerCase());
        const brandMatch = selectedBrands.length === 0 || selectedBrands.includes(product.shop);
        const ratingMatch = product.rating >= minRating;

        return categoryMatch && priceMatch && searchMatch && brandMatch && ratingMatch;
    }).sort((a, b) => {
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
        if (sortBy === 'newest') return b.id - a.id; // Assuming higher ID is newer
        if (sortBy === 'rating') return b.rating - a.rating;
        return b.reviews - a.reviews; // Default to popular (reviews)
    });

    return (
        <div className="min-h-screen py-12 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row gap-8">

                    {/* Filters Sidebar */}
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
                                <h3 className="font-bold text-dark dark:text-white mb-4">Categories</h3>
                                <div className="space-y-3">
                                    {categories.map(category => (
                                        <label key={category} className="flex items-center cursor-pointer group">
                                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-3 transition ${selectedCategory === category ? 'border-primary bg-primary' : 'border-gray-300 dark:border-gray-600 group-hover:border-primary'}`}>
                                                {selectedCategory === category && <div className="w-2 h-2 bg-white rounded-full" />}
                                            </div>
                                            <input
                                                type="radio"
                                                name="category"
                                                className="hidden"
                                                checked={selectedCategory === category}
                                                onChange={() => setSelectedCategory(category)}
                                            />
                                            <span className={`text-sm font-medium transition ${selectedCategory === category ? 'text-dark dark:text-white' : 'text-gray-500 dark:text-gray-400 group-hover:text-primary'}`}>{category}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Brand Filter */}
                            <div className="mb-8">
                                <h3 className="font-bold text-dark dark:text-white mb-4">Brands</h3>
                                <div className="space-y-2">
                                    {brands.map(brand => (
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
                                    <span className="text-primary font-bold">${priceRange}</span>
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max="2000"
                                    value={priceRange}
                                    onChange={(e) => setPriceRange(Number(e.target.value))}
                                    className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary"
                                />
                            </div>
                        </div>
                    </aside>

                    {/* Product Grid */}
                    <main className="flex-1">
                        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
                            <h1 className="text-3xl font-bold text-dark dark:text-white">Shop All Products</h1>

                            <div className="flex items-center space-x-4">
                                <span className="px-4 py-2 bg-white dark:bg-gray-800 rounded-full text-sm font-bold text-gray-500 dark:text-gray-400 shadow-sm whitespace-nowrap">{filteredProducts.length} results</span>

                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="px-4 py-2 bg-white dark:bg-gray-800 rounded-full text-sm font-medium text-dark dark:text-white shadow-sm border-none focus:ring-2 focus:ring-primary outline-none cursor-pointer"
                                >
                                    <option value="popular">Popularity</option>
                                    <option value="newest">Newest First</option>
                                    <option value="price-low">Price: Low to High</option>
                                    <option value="price-high">Price: High to Low</option>
                                    <option value="rating">Highest Rated</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredProducts.map((product) => (
                                <div key={product.id} className="group relative">
                                    <Link to={`/product/${product.id}`}>
                                        <div className="bg-white dark:bg-gray-800 rounded-[2rem] shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden h-full flex flex-col">
                                            <div className="relative h-64 bg-surface-alt dark:bg-gray-700 p-6 flex items-center justify-center overflow-hidden">
                                                <img
                                                    src={product.image}
                                                    alt={product.name}
                                                    className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal transform group-hover:scale-110 transition duration-500"
                                                />
                                            </div>
                                            <div className="p-6 flex-1 flex flex-col">
                                                <p className="text-xs font-bold text-primary mb-2 uppercase tracking-wider">{product.category}</p>
                                                <h3 className="text-lg font-bold text-dark dark:text-white mb-1">{product.name}</h3>
                                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">by {product.shop}</p>

                                                <div className="mt-auto flex items-center justify-between">
                                                    <span className="text-2xl font-bold text-dark dark:text-white">${product.price.toFixed(2)}</span>
                                                    <div className="flex items-center bg-orange-50 dark:bg-gray-700 px-2 py-1 rounded-lg">
                                                        <Star className="h-4 w-4 text-secondary fill-current" />
                                                        <span className="ml-1 text-sm font-bold text-dark dark:text-white">{product.rating}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>

                                    {/* Action Buttons */}
                                    <div className="absolute top-4 right-4 flex flex-col space-y-2 translate-x-10 group-hover:translate-x-0 transition-transform duration-300">
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                toggleWishlist(product);
                                            }}
                                            className={`p-3 rounded-full shadow-md transition ${isInWishlist(product.id) ? 'bg-red-50 text-red-500' : 'bg-white dark:bg-gray-700 text-dark dark:text-white hover:bg-primary hover:text-white'}`}
                                        >
                                            <Heart className={`h-5 w-5 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
                                        </button>
                                        <button className="p-3 bg-white dark:bg-gray-700 rounded-full shadow-md text-dark dark:text-white hover:bg-primary hover:text-white transition">
                                            <ShoppingCart className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {filteredProducts.length === 0 && (
                            <div className="text-center py-12">
                                <p className="text-gray-500 dark:text-gray-400 text-lg">No products found matching your filters.</p>
                                <button
                                    onClick={() => {
                                        setSelectedCategory('All');
                                        setPriceRange(2000);
                                        setSelectedBrands([]);
                                        setMinRating(0);
                                    }}
                                    className="mt-4 text-primary font-medium hover:underline"
                                >
                                    Clear all filters
                                </button>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default Shop;
