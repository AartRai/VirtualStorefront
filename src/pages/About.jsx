import React from 'react';
import { motion } from 'framer-motion';
import { Award, Users, Globe, Heart, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const About = () => {
    const stats = [
        { label: 'Happy Customers', value: '50k+' },
        { label: 'Products Sold', value: '150k+' },
        { label: 'Years Experience', value: '10+' },
        { label: 'Team Members', value: '50+' },
    ];

    const values = [
        {
            icon: <Award className="w-8 h-8 text-primary" />,
            title: 'Premium Quality',
            description: 'We source only the finest materials to ensure our products meet the highest standards of excellence.'
        },
        {
            icon: <Users className="w-8 h-8 text-secondary" />,
            title: 'Customer First',
            description: 'Your satisfaction is our top priority. We go above and beyond to ensure a seamless shopping experience.'
        },
        {
            icon: <Globe className="w-8 h-8 text-blue-500" />,
            title: 'Sustainability',
            description: 'We are committed to eco-friendly practices and sustainable sourcing to protect our planet.'
        },
        {
            icon: <Heart className="w-8 h-8 text-red-500" />,
            title: 'Passion Driven',
            description: 'Every product we curate is selected with passion and a deep appreciation for craftsmanship.'
        }
    ];

    return (
        <div className="min-h-screen bg-light dark:bg-dark transition-colors duration-300">
            {/* Hero Section */}
            <section className="relative py-20 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 dark:from-primary/5 dark:to-secondary/5 z-0" />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center max-w-3xl mx-auto"
                    >
                        <h1 className="text-5xl md:text-6xl font-heading font-bold text-dark dark:text-white mb-6">
                            Crafting Experiences, <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Not Just Products</span>
                        </h1>
                        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                            We are a team of passionate individuals dedicated to bringing you the best in lifestyle and fashion. Our journey began with a simple idea: to make premium quality accessible to everyone.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-12 bg-white dark:bg-gray-800/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="text-center"
                            >
                                <div className="text-4xl font-bold text-primary mb-2">{stat.value}</div>
                                <div className="text-gray-600 dark:text-gray-400 font-medium">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Our Story Section */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="relative"
                        >
                            <div className="absolute inset-0 bg-secondary rounded-[3rem] rotate-3 opacity-20 blur-xl"></div>
                            <img
                                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1471&q=80"
                                alt="Our Team"
                                className="relative rounded-[3rem] shadow-2xl w-full object-cover h-[500px]"
                            />
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <h2 className="text-4xl font-heading font-bold text-dark dark:text-white mb-6">Our Story</h2>
                            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                                Founded in 2023, our brand emerged from a desire to redefine the online shopping experience. We noticed a gap in the market for a platform that combines curated quality with genuine care for the customer.
                            </p>
                            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                                What started as a small garage project has now grown into a global community of like-minded individuals who value style, substance, and sustainability. We believe that every purchase should be a step towards a better lifestyle.
                            </p>
                            <Link to="/contact" className="inline-flex items-center text-primary font-bold hover:text-secondary transition-colors">
                                Get in Touch <ArrowRight className="ml-2 w-5 h-5" />
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-20 bg-surface dark:bg-gray-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-heading font-bold text-dark dark:text-white mb-4">Our Core Values</h2>
                        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                            These principles guide every decision we make and every product we offer.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {values.map((value, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white dark:bg-gray-800 p-8 rounded-[2rem] shadow-lg hover:shadow-xl transition-shadow duration-300"
                            >
                                <div className="bg-gray-50 dark:bg-gray-700 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                                    {value.icon}
                                </div>
                                <h3 className="text-xl font-bold text-dark dark:text-white mb-3">{value.title}</h3>
                                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                    {value.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-gradient-to-r from-primary to-secondary rounded-[3rem] p-12 text-center text-white shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-full bg-white opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                        <div className="relative z-10">
                            <h2 className="text-4xl font-bold mb-6">Ready to Experience the Best?</h2>
                            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
                                Join thousands of satisfied customers and elevate your lifestyle today.
                            </p>
                            <Link
                                to="/shop"
                                className="inline-block bg-white text-secondary font-bold py-4 px-10 rounded-full hover:bg-gray-100 transition-colors shadow-lg transform hover:scale-105 duration-200"
                            >
                                Shop Now
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default About;
