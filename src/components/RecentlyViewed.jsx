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
        <div className="mt-16 border-t border-gray-200 dark:border-gray-700 pt-12">
            <h2 className="text-2xl font-bold text-dark dark:text-white mb-8">Recently Viewed</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {recentProducts.slice(0, 6).map((product) => (
                    <Link key={product.id} to={`/product/${product.id}`} className="group">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm hover:shadow-md transition h-full flex flex-col">
                            <div className="aspect-square bg-surface-alt dark:bg-gray-700 rounded-xl mb-3 flex items-center justify-center overflow-hidden">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal group-hover:scale-105 transition"
                                />
                            </div>
                            <h3 className="text-sm font-bold text-dark dark:text-white truncate">{product.name}</h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{product.shop}</p>
                            <div className="flex items-center justify-between mt-auto">
                                <span className="text-sm font-bold text-primary">${product.price}</span>
                                <div className="flex items-center">
                                    <Star className="h-3 w-3 text-yellow-400 fill-current" />
                                    <span className="text-xs ml-1 text-gray-400 dark:text-gray-500">{product.rating}</span>
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
