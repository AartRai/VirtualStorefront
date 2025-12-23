import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Filter, Star, ShoppingCart, Heart, Loader } from 'lucide-react';
import api from '../api/axios';
import { useWishlist } from '../context/WishlistContext';
import ProductFilter from '../components/ProductFilter';

const Shop = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const initialSearch = searchParams.get('search') || '';
    const initialCategory = searchParams.get('category') || 'All';

    // State
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState(initialCategory);
    const [priceRange, setPriceRange] = useState(100000);
    const [searchQuery, setSearchQuery] = useState(initialSearch);
    const [selectedBrands, setSelectedBrands] = useState([]);
    const [minRating, setMinRating] = useState(0);
    const [sortBy, setSortBy] = useState('newest');
    const [availableBrands, setAvailableBrands] = useState([]);

    const { isInWishlist, toggleWishlist } = useWishlist();

    // Fetch Brands on Mount
    useEffect(() => {
        const fetchBrands = async () => {
            try {
                // If /api/brands exists, use it. Otherwise derive from products.
                // Assuming /api/brands is implemented or we fallback.
                const res = await api.get('/brands');
                setAvailableBrands(res.data.map(b => b.name));
            } catch (err) {
                // Fallback if brands route fails or doesn't exist as expected
                const res = await api.get('/products?limit=100');
                const brands = [...new Set(res.data.products.map(p => p.shop || 'Local Vendor'))].filter(Boolean);
                setAvailableBrands(brands);
            }
        };
        fetchBrands();
    }, []);

    // Sync URL params with state
    useEffect(() => {
        setSearchQuery(searchParams.get('search') || '');
        const categoryParam = searchParams.get('category');
        if (categoryParam) {
            setSelectedCategory(categoryParam);
        }
    }, [searchParams]);

    // Fetch Products when Filters Change
    useEffect(() => {
        const fetchFilteredProducts = async () => {
            try {
                setLoading(true);
                const params = {
                    keyword: searchQuery,
                    // specific handling for 'offers' - don't send it as a category to backend
                    category: (selectedCategory !== 'All' && selectedCategory !== 'offers') ? selectedCategory : undefined,
                    'price[lte]': priceRange,
                    rating: minRating > 0 ? minRating : undefined,
                    sort: sortBy,
                    limit: 100 // Fetch more to allow client-side filtering if needed
                };

                // Handle multiple brands array
                // Axios doesn't handle array params like ?brand=A&brand=B automatically standardly sometimes, 
                // but usually it does as brand[]=A. Our backend expects simple `req.query.brand`.
                // If multiple brands, we might need a custom serializer or just pick one for now.
                // Or better, let's just pass them if backend supported $in, but current backend code:
                // if (brand) query.shop = brand; -> Single value.
                // So enabling multi-brand filter requires backend change OR we just take the first/loop.
                // Simplification for now: Use the first selected brand or comma separate.
                if (selectedBrands.length > 0) {
                    params.brand = selectedBrands[0]; // Limitation: One brand at a time for this iteration
                }

                if (searchQuery) params.keyword = searchQuery;

                const res = await api.get('/products', { params });

                let fetchedProducts = res.data.products || res.data;

                // Client-side filtering for 'Top Offers' (where originalPrice > price)
                if (selectedCategory === 'offers') {
                    fetchedProducts = fetchedProducts.filter(p => p.originalPrice && p.originalPrice > p.price);
                }

                setProducts(fetchedProducts);

                setLoading(false);
            } catch (err) {
                console.error("Error fetching filtered products:", err);
                setProducts([]); // Clear products on error
                setLoading(false);
            }
        };

        const debounceTimer = setTimeout(() => {
            fetchFilteredProducts();
        }, 500); // 500ms debounce

        return () => clearTimeout(debounceTimer);
    }, [selectedCategory, priceRange, searchQuery, selectedBrands, minRating, sortBy]);

    const handleClearFilters = () => {
        setSelectedCategory('All');
        setPriceRange(100000);
        setSelectedBrands([]);
        setMinRating(0);
        setSearchQuery('');
        setSearchParams({});
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader className="w-12 h-12 animate-spin text-primary" />
            </div>
        );
    }
    return (
        <div className="min-h-screen py-12 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row gap-8">

                    {/* Filters Sidebar */}
                    <ProductFilter
                        selectedCategory={selectedCategory}
                        setSelectedCategory={setSelectedCategory}
                        priceRange={priceRange}
                        setPriceRange={setPriceRange}
                        selectedBrands={selectedBrands}
                        setSelectedBrands={setSelectedBrands}
                        minRating={minRating}
                        setMinRating={setMinRating}
                        availableBrands={availableBrands}
                        onClearFilters={handleClearFilters}
                    />

                    {/* Product Grid */}
                    <main className="flex-1">
                        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
                            <h1 className="text-3xl font-bold text-dark dark:text-white">Shop All Products</h1>

                            <div className="flex items-center space-x-4">
                                <span className="px-4 py-2 bg-white dark:bg-gray-800 rounded-full text-sm font-bold text-gray-500 dark:text-gray-400 shadow-sm whitespace-nowrap">
                                    {products.length} results
                                </span>

                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="px-4 py-2 bg-white dark:bg-gray-800 rounded-full text-sm font-medium text-dark dark:text-white shadow-sm border-none focus:ring-2 focus:ring-primary outline-none cursor-pointer"
                                >
                                    <option value="newest">Newest First</option>
                                    <option value="popular">Popularity</option>
                                    <option value="price-low">Price: Low to High</option>
                                    <option value="price-high">Price: High to Low</option>
                                    <option value="rating">Highest Rated</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {products.map((product) => (
                                <div key={product._id} className="group relative">
                                    <Link to={`/product/${product._id}`}>
                                        <div className="bg-white dark:bg-gray-800 rounded-[2rem] shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden h-full flex flex-col">
                                            <div className="relative h-64 bg-surface-alt dark:bg-gray-700 p-6 flex items-center justify-center overflow-hidden">
                                                <img
                                                    src={product.images && product.images.length > 0 ? product.images[0] : (product.image || '/placeholder.svg')}
                                                    alt={product.name}
                                                    onError={(e) => { e.target.src = '/placeholder.svg'; }}
                                                    className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal transform group-hover:scale-110 transition duration-500"
                                                />
                                            </div>
                                            <div className="p-6 flex-1 flex flex-col">
                                                <p className="text-xs font-bold text-primary mb-2 uppercase tracking-wider">{product.category}</p>
                                                <h3 className="text-lg font-bold text-dark dark:text-white mb-1">{product.name}</h3>
                                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">by {product.shop || 'Local Vendor'}</p>

                                                <div className="mt-auto flex items-center justify-between">
                                                    <span className="text-2xl font-bold text-dark dark:text-white">₹{product.price.toLocaleString()}</span>
                                                    <div className="flex items-center bg-orange-50 dark:bg-gray-700 px-2 py-1 rounded-lg">
                                                        <Star className="h-4 w-4 text-secondary fill-current" />
                                                        <span className="ml-1 text-sm font-bold text-dark dark:text-white">{product.rating ? product.rating.toFixed(1) : 'N/A'}</span>
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
                                            className={`p-3 rounded-full shadow-md transition ${isInWishlist(product._id) ? 'bg-red-50 text-red-500' : 'bg-white dark:bg-gray-700 text-dark dark:text-white hover:bg-primary hover:text-white'}`}
                                        >
                                            <Heart className={`h-5 w-5 ${isInWishlist(product._id) ? 'fill-current' : ''}`} />
                                        </button>
                                        <button className="p-3 bg-white dark:bg-gray-700 rounded-full shadow-md text-dark dark:text-white hover:bg-primary hover:text-white transition">
                                            <ShoppingCart className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {products.length === 0 && (
                            <div className="text-center py-12">
                                <p className="text-gray-500 dark:text-gray-400 text-lg">No products found matching your filters.</p>
                                <button
                                    onClick={handleClearFilters}
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
