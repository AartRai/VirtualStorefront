import { Link } from 'react-router-dom';
import { Star, ShoppingCart, Heart, Trash2 } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';

const Wishlist = () => {
    const { wishlist, removeFromWishlist } = useWishlist();

    return (
        <div className="min-h-screen py-12 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-dark dark:text-white mb-4">My Wishlist</h1>
                    <p className="text-gray-500 dark:text-gray-400">
                        {wishlist.length > 0
                            ? `You have ${wishlist.length} items saved for later`
                            : 'Your wishlist is empty'}
                    </p>
                </div>

                {wishlist.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {wishlist.map((product) => (
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
                                            <p className="text-xs font-bold text-primary mb-2 uppercase tracking-wider">{product.shop}</p>
                                            <h3 className="text-lg font-bold text-dark dark:text-white mb-2 truncate">{product.name}</h3>

                                            <div className="mt-auto flex items-center justify-between">
                                                <span className="text-2xl font-bold text-dark dark:text-white">${product.price.toFixed(2)}</span>
                                                <div className="flex items-center bg-orange-50 dark:bg-orange-900/30 px-2 py-1 rounded-lg">
                                                    <Star className="h-4 w-4 text-secondary fill-current" />
                                                    <span className="ml-1 text-sm font-bold text-dark dark:text-white">{product.rating}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>

                                {/* Action Buttons */}
                                <div className="absolute top-4 right-4 flex flex-col space-y-2">
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            removeFromWishlist(product.id);
                                        }}
                                        className="p-3 rounded-full shadow-md bg-red-50 text-red-500 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 transition"
                                        title="Remove from Wishlist"
                                    >
                                        <Trash2 className="h-5 w-5" />
                                    </button>
                                    <button className="p-3 bg-white dark:bg-gray-700 rounded-full shadow-md text-dark dark:text-white hover:bg-primary hover:text-white dark:hover:bg-primary transition">
                                        <ShoppingCart className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <Heart className="h-20 w-20 text-gray-200 dark:text-gray-700 mx-auto mb-6" />
                        <h2 className="text-2xl font-bold text-dark dark:text-white mb-4">No items yet?</h2>
                        <p className="text-gray-500 dark:text-gray-400 mb-8">Start exploring and save your favorite items here.</p>
                        <Link to="/shop" className="px-8 py-3 bg-primary text-white font-bold rounded-full shadow-lg hover:bg-secondary transition">
                            Start Shopping
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Wishlist;
