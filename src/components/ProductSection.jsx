import { Link } from 'react-router-dom';
import { Star, ShoppingCart, Heart } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';

const ProductSection = ({ title, products, categoryLink }) => {
    const { isInWishlist, toggleWishlist } = useWishlist();

    if (!products || products.length === 0) return null;

    return (
        <section className="py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-end mb-8">
                    <h2 className="text-3xl font-heading font-bold text-gray-900 dark:text-white">{title}</h2>
                    <Link to={categoryLink || "/shop"} className="text-primary font-medium hover:text-secondary">View all &rarr;</Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {products.map((product) => (
                        <div key={product._id || product.id} className="group relative">
                            <Link to={`/product/${product._id || product.id}`}>
                                <div className="bg-white dark:bg-gray-800 rounded-[2rem] shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden h-full flex flex-col">
                                    <div className="relative h-64 bg-surface-alt dark:bg-gray-700 p-6 flex items-center justify-center overflow-hidden">
                                        <img
                                            src={product.image || (product.images && product.images[0])}
                                            alt={product.name}
                                            className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal transform group-hover:scale-110 transition duration-500"
                                        />
                                    </div>
                                    <div className="p-6 flex-1 flex flex-col">
                                        <p className="text-xs font-bold text-primary mb-2 uppercase tracking-wider">{product.shop}</p>
                                        <h3 className="text-lg font-bold text-dark dark:text-white mb-2 truncate">{product.name}</h3>

                                        <div className="mt-auto flex items-center justify-between">
                                            <span className="text-2xl font-bold text-dark dark:text-white">₹{product.price.toFixed(2)}</span>
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
                                    className={`p-3 rounded-full shadow-md transition ${isInWishlist(product._id || product.id) ? 'bg-red-50 text-red-500' : 'bg-white dark:bg-gray-700 text-dark dark:text-white hover:bg-primary hover:text-white'}`}
                                >
                                    <Heart className={`h-5 w-5 ${isInWishlist(product._id || product.id) ? 'fill-current' : ''}`} />
                                </button>
                                <button className="p-3 bg-white dark:bg-gray-700 rounded-full shadow-md text-dark dark:text-white hover:bg-primary hover:text-white transition">
                                    <ShoppingCart className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ProductSection;
