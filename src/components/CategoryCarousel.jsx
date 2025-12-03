import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const categories = [
    { name: 'Handmade Crafts', image: 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60' },
    { name: 'Artisan Food', image: 'https://images.unsplash.com/photo-1484723091739-30a097e8f929?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60' },
    { name: 'Home Decor', image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60' },
    { name: 'Fashion', image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60' },
];

const CategoryCarousel = () => {
    return (
        <section className="py-12 bg-white dark:bg-gray-800 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-heading font-bold text-gray-900 dark:text-white mb-8">Shop by Category</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {categories.map((category, index) => (
                        <motion.div
                            key={category.name}
                            whileHover={{ y: -10 }}
                            className="relative rounded-[2rem] overflow-hidden h-80 group cursor-pointer shadow-lg"
                        >
                            <Link to={`/shop?category=${category.name}`}>
                                <img
                                    src={category.image}
                                    alt={category.name}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-8">
                                    <h3 className="text-white text-2xl font-bold">{category.name}</h3>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CategoryCarousel;
