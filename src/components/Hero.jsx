import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const Hero = () => {
    return (
        <section className="relative overflow-hidden pt-10 pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-[#FFE8A3] dark:bg-gray-800 rounded-[3rem] p-8 md:p-16 shadow-xl relative overflow-hidden transition-colors duration-300">
                    {/* Decorative Circle */}
                    <div className="absolute -top-20 -right-20 w-96 h-96 bg-primary/20 rounded-full blur-3xl"></div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
                        <div className="text-center lg:text-left">
                            <motion.span
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="inline-block py-1 px-3 rounded-full bg-orange-100 dark:bg-orange-900/30 text-secondary text-sm font-bold mb-6"
                            >
                                New Collection 2025
                            </motion.span>
                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                className="text-5xl md:text-7xl font-bold text-dark dark:text-white mb-6 leading-tight"
                            >
                                Discover <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Local Magic</span>
                            </motion.h1>
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-lg mx-auto lg:mx-0"
                            >
                                Support small businesses and find unique, handcrafted treasures that tell a story.
                            </motion.p>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.4 }}
                                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
                            >
                                <Link
                                    to="/shop"
                                    className="px-8 py-4 bg-dark dark:bg-primary text-white rounded-full font-bold hover:bg-gray-800 dark:hover:bg-orange-600 transition shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                                >
                                    Start Shopping
                                </Link>
                                <Link
                                    to="/auth/signup"
                                    className="px-8 py-4 bg-white dark:bg-gray-700 text-dark dark:text-white border-2 border-white dark:border-gray-700 rounded-full font-bold hover:bg-orange-50 dark:hover:bg-gray-600 transition shadow-md flex items-center justify-center"
                                >
                                    Sell with Us <ArrowRight className="ml-2 h-5 w-5" />
                                </Link>
                            </motion.div>
                        </div>

                        <div className="relative">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.8 }}
                                className="relative z-10"
                            >
                                <img
                                    className="w-full h-auto rounded-[2.5rem] shadow-2xl transform rotate-2 hover:rotate-0 transition duration-500"
                                    src="https://images.unsplash.com/photo-1556740758-90de374c12ad?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
                                    alt="Small business owner"
                                />
                            </motion.div>
                            {/* Floating Elements */}
                            <motion.div
                                animate={{ y: [0, -20, 0] }}
                                transition={{ repeat: Infinity, duration: 4 }}
                                className="absolute -bottom-10 -left-10 bg-white dark:bg-gray-700 p-4 rounded-2xl shadow-lg z-20 hidden md:block"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold">✓</div>
                                    <div>
                                        <div className="font-bold text-dark dark:text-white">Verified Seller</div>
                                        <div className="text-xs text-gray-500">100% Authentic</div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
