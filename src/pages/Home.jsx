import Hero from '../components/Hero';
import CategoryCarousel from '../components/CategoryCarousel';
import ProductSection from '../components/ProductSection';
import { products } from '../data/mockData';

const Home = () => {
    // Filter products by category
    const fashionProducts = products.filter(p => p.category === 'Fashion').slice(0, 4);
    const electronicsProducts = products.filter(p => p.category === 'Electronics').slice(0, 4);
    const homeProducts = products.filter(p => p.category === 'Home').slice(0, 4);
    const beautyProducts = products.filter(p => p.category === 'Beauty').slice(0, 4);

    return (
        <div className="bg-gray-50 dark:bg-gray-900 pb-20 transition-colors duration-300">
            <Hero />
            <CategoryCarousel />

            {/* Category Sections */}
            <ProductSection title="Trending Fashion" products={fashionProducts} categoryLink="/shop?category=Fashion" />
            <ProductSection title="Latest Electronics" products={electronicsProducts} categoryLink="/shop?category=Electronics" />
            <ProductSection title="Home Essentials" products={homeProducts} categoryLink="/shop?category=Home" />
            <ProductSection title="Beauty & Wellness" products={beautyProducts} categoryLink="/shop?category=Beauty" />

            {/* Testimonials Section */}
            <section className="py-16 bg-white dark:bg-gray-800 mt-12 transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-heading font-bold text-center text-gray-900 dark:text-white mb-12">What Our Community Says</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg transition-colors duration-300">
                                <div className="flex items-center mb-4">
                                    <img
                                        src={`https://randomuser.me/api/portraits/women/${i + 10}.jpg`}
                                        alt="User"
                                        className="h-10 w-10 rounded-full mr-3"
                                    />
                                    <div>
                                        <h4 className="font-bold text-dark dark:text-white">Sarah Johnson</h4>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Local Shopper</p>
                                    </div>
                                </div>
                                <p className="text-gray-600 dark:text-gray-300 italic">"LocalLift has made it so easy to support small businesses in my area. I love finding unique gifts here!"</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
