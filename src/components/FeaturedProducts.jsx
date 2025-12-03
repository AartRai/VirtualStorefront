import { Link } from 'react-router-dom';
import { Star, ShoppingCart } from 'lucide-react';

const products = [
    { id: 1, name: 'Handcrafted Ceramic Vase', price: 45.00, rating: 4.8, image: 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60', shop: 'Clay & Co.' },
    { id: 2, name: 'Organic Lavender Soap', price: 12.50, rating: 4.9, image: 'https://images.unsplash.com/photo-1600857062241-98e5dba7f214?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60', shop: 'Nature\'s Best' },
    { id: 3, name: 'Leather Messenger Bag', price: 120.00, rating: 4.7, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60', shop: 'Urban Leather' },
    { id: 4, name: 'Artisan Coffee Beans', price: 18.00, rating: 5.0, image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60', shop: 'Bean There' },
];

const FeaturedProducts = () => {
    return (
        <section className="py-12 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-end mb-8">
                    <h2 className="text-3xl font-heading font-bold text-gray-900 dark:text-white">Trending Now</h2>
                    <Link to="/shop" className="text-primary font-medium hover:text-secondary">View all &rarr;</Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {products.map((product) => (
                        <div key={product.id} className="bg-white dark:bg-gray-800 rounded-[2rem] shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group">
                            <div className="relative h-64 bg-surface-alt dark:bg-gray-700 p-6 flex items-center justify-center">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal transform group-hover:scale-110 transition duration-500"
                                />
                                <button className="absolute top-4 right-4 p-3 bg-white dark:bg-gray-600 rounded-full shadow-md text-dark dark:text-white hover:bg-primary hover:text-white dark:hover:bg-primary transition transform translate-x-10 group-hover:translate-x-0">
                                    <ShoppingCart className="h-5 w-5" />
                                </button>
                            </div>
                            <div className="p-6">
                                <p className="text-xs font-bold text-primary mb-2 uppercase tracking-wider">{product.shop}</p>
                                <h3 className="text-lg font-bold text-dark dark:text-white mb-2 truncate">{product.name}</h3>
                                <div className="flex items-center justify-between mt-4">
                                    <span className="text-2xl font-bold text-dark dark:text-white">${product.price.toFixed(2)}</span>
                                    <div className="flex items-center bg-orange-50 dark:bg-orange-900/30 px-2 py-1 rounded-lg">
                                        <Star className="h-4 w-4 text-secondary fill-current" />
                                        <span className="ml-1 text-sm font-bold text-dark dark:text-white">{product.rating}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>          </div>
        </section>
    );
};

export default FeaturedProducts;
