import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Filter, Star, ShoppingCart, Heart, Loader } from 'lucide-react';
import api from '../api/axios';
import { useWishlist } from '../context/WishlistContext';

const Shop = () => {
    const [searchParams] = useSearchParams();
    const initialSearch = searchParams.get('search') || '';
    const initialCategory = searchParams.get('category') || 'All';

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState(initialCategory);
    const [priceRange, setPriceRange] = useState(50000); // Increased default for INR
    const [searchQuery, setSearchQuery] = useState(initialSearch);
    const [selectedBrands, setSelectedBrands] = useState([]);
    const [minRating, setMinRating] = useState(0);
    const [sortBy, setSortBy] = useState('popular');

    const { isInWishlist, toggleWishlist } = useWishlist();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const res = await api.get('/products');
                setProducts(res.data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching products:", err);
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    useEffect(() => {
        setSearchQuery(searchParams.get('search') || '');
        const categoryParam = searchParams.get('category');
        if (categoryParam) {
            setSelectedCategory(categoryParam);
        }
    }, [searchParams]);

    const categories = ['All', 'Fashion', 'Electronics', 'Home', 'Beauty', 'Mobiles', 'Appliances', 'Grocery', 'Travel'];

    // Extract unique brands (using 'shop' as brand/vendor name from real data if available, or just mock it if data structure differs, but assuming products have 'shop' or we use 'user' name)
    // Note: The product model has 'user', but the aggregate might not populate it by default unless configured.
    // For now, let's assume the product object structure from the API matches what we need or we adapt.
    // Looking at Product.js model: fields are name, description, category, price, stock, images.
    // It does NOT have 'shop' explicitly, it has 'user' (ObjectId).
    // The previous mock data had 'shop'. We might need to populate 'user' to get the shop name, or adjust this.
    // Let's check products.js route. It does simply Product.find().
    // We might need to update the backend to populate 'user' to get the name, OR just disable brand filter/use static for now.
    // For a robust fix, let's proceed with fetching, and handle missing 'shop' field gracefully (e.g., 'Unknown Shop' or exclude brand filter if empty).

    // Let's map 'shop' to a placeholder if missing, or use 'category' as a proxy for diversity if needed.
    // Actually, distinct brands are cool. Let's assume for now we might not have it and just use 'Generic' or fail gracefully.
    const brands = [...new Set(products.map(p => p.shop || 'Local Vendor'))].filter(Boolean);

    const filteredProducts = products.filter(product => {
        const categoryMatch = selectedCategory === 'All' || product.category.toLowerCase() === selectedCategory.toLowerCase();
        const priceMatch = product.price <= priceRange;
        const searchMatch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (product.shop && product.shop.toLowerCase().includes(searchQuery.toLowerCase()));
        const brandMatch = selectedBrands.length === 0 || (product.shop && selectedBrands.includes(product.shop)) || (!product.shop && selectedBrands.includes('Local Vendor'));
        const ratingMatch = (product.rating || 0) >= minRating;

        return categoryMatch && priceMatch && searchMatch && brandMatch && ratingMatch;
    }).sort((a, b) => {
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
        // if (sortBy === 'newest') return b.id - a.id; // Real DB uses _id (timestamp) usually
        if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
        if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
        return (b.reviews || 0) - (a.reviews || 0);
    });

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
                    <aside className="w-full md:w-72 flex-shrink-0">
                        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-8 rounded-[2rem] shadow-lg relative md:sticky top-0 md:top-24">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center">
                                    <Filter className="h-5 w-5 mr-2 text-primary" />
                                    <h2 className="text-xl font-bold text-dark dark:text-white">Filters</h2>
                                </div>
                            </div>

                            {/* Category Filter */}


                            {/* Brand Filter */}
                            {/* Brand Filter - Limited to top 5 */}
                            <div className="mb-8">
                                <h3 className="font-bold text-dark dark:text-white mb-4">Brands</h3>
                                <div className="space-y-2">
                                    {brands.slice(0, 5).map(brand => (
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
                                    {brands.length > 5 && (
                                        <div className="text-xs text-gray-400 italic pt-2">
                                            + {brands.length - 5} more brands
                                        </div>
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
                                                        <span className="ml-1 text-sm font-bold text-dark dark:text-white">{product.rating || 'N/A'}</span>
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
