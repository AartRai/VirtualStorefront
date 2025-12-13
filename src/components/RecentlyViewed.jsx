import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';

const RecentlyViewed = () => {
    const [recentProducts, setRecentProducts] = useState([]);

    useEffect(() => {
        const stored = localStorage.getItem('recentlyViewed');
        if (stored) {
            setRecentProducts(JSON.parse(stored));
        }
    }, []);

    if (recentProducts.length === 0) return null;

    return (
        <div className="mt-24 border-t border-gray-100 dark:border-gray-700 pt-16">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Related Products</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                {recentProducts.slice(0, 6).map((product) => (
                    <Link key={product._id} to={`/product/${product._id}`} className="group block h-full">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 transition-all duration-300 hover:shadow-lg border border-transparent hover:border-gray-100 dark:hover:border-gray-700 h-full flex flex-col">
                            <div className="aspect-square bg-gray-50 dark:bg-gray-700/50 rounded-xl mb-4 flex items-center justify-center overflow-hidden p-4">
                                <img
                                    src={product.images && product.images.length > 0 ? product.images[0] : (product.image || '/placeholder.svg')}
                                    alt={product.name}
                                    className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal group-hover:scale-110 transition-transform duration-500 ease-out"
                                />
                            </div>
                            <div className="mt-auto">
                                <div className="text-xs text-gray-400 mb-1 uppercase tracking-in_wider font-medium">{product.shop || 'Vendor'}</div>
                                <h3 className="text-sm font-bold text-gray-900 dark:text-white truncate mb-2 group-hover:text-primary transition-colors">{product.name}</h3>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-bold text-gray-900 dark:text-white">₹{product.price}</span>
                                    <div className="flex items-center bg-yellow-50 dark:bg-yellow-900/30 px-1.5 py-0.5 rounded-md">
                                        <Star className="h-3 w-3 text-yellow-500 fill-current" />
                                        <span className="text-xs ml-1 font-medium text-yellow-700 dark:text-yellow-500">{product.rating ? product.rating.toFixed(1) : 'N/A'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default RecentlyViewed;
