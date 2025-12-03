import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, MessageSquare } from 'lucide-react';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission logic here
        console.log('Form submitted:', formData);
        alert('Thank you for your message! We will get back to you soon.');
        setFormData({ name: '', email: '', subject: '', message: '' });
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const contactInfo = [
        {
            icon: <Phone className="w-6 h-6" />,
            title: 'Phone',
            content: '+1 (555) 123-4567',
            subContent: 'Mon-Fri 9am-6pm EST'
        },
        {
            icon: <Mail className="w-6 h-6" />,
            title: 'Email',
            content: 'support@example.com',
            subContent: 'Online 24/7'
        },
        {
            icon: <MapPin className="w-6 h-6" />,
            title: 'Office',
            content: '123 Innovation Dr.',
            subContent: 'New York, NY 10001'
        }
    ];

    return (
        <div className="min-h-screen bg-light dark:bg-dark transition-colors duration-300">
            {/* Hero Section */}
            <section className="relative py-20 bg-surface dark:bg-gray-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className="text-5xl font-heading font-bold text-dark dark:text-white mb-6">
                            Get in <span className="text-primary">Touch</span>
                        </h1>
                        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                            Have a question or just want to say hi? We'd love to hear from you.
                        </p>
                    </motion.div>
                </div>
            </section>

            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        {/* Contact Info */}
                        <div className="lg:col-span-1 space-y-8">
                            {contactInfo.map((info, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className="bg-white dark:bg-gray-800 p-8 rounded-[2rem] shadow-lg flex items-start space-x-6 hover:shadow-xl transition-shadow duration-300"
                                >
                                    <div className="bg-primary/10 dark:bg-primary/20 p-4 rounded-2xl text-primary">
                                        {info.icon}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-dark dark:text-white mb-2">{info.title}</h3>
                                        <p className="text-gray-800 dark:text-gray-200 font-medium">{info.content}</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{info.subContent}</p>
                                    </div>
                                </motion.div>
                            ))}

                            {/* Map Placeholder */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                className="bg-gray-200 dark:bg-gray-700 h-64 rounded-[2rem] overflow-hidden shadow-inner relative"
                            >
                                <div className="absolute inset-0 flex items-center justify-center text-gray-500 dark:text-gray-400 font-medium">
                                    <div className="text-center">
                                        <MapPin className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                        <p>Map Integration Coming Soon</p>
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        {/* Contact Form */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="lg:col-span-2"
                        >
                            <div className="bg-white dark:bg-gray-800 p-8 md:p-12 rounded-[2.5rem] shadow-xl">
                                <h2 className="text-3xl font-bold text-dark dark:text-white mb-8 flex items-center">
                                    <MessageSquare className="w-8 h-8 mr-3 text-secondary" />
                                    Send us a Message
                                </h2>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label htmlFor="name" className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Name</label>
                                            <input
                                                type="text"
                                                id="name"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-700 rounded-2xl border-none focus:ring-2 focus:ring-primary text-dark dark:text-white placeholder-gray-400 transition-all"
                                                placeholder="John Doe"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label htmlFor="email" className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Email</label>
                                            <input
                                                type="email"
                                                id="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-700 rounded-2xl border-none focus:ring-2 focus:ring-primary text-dark dark:text-white placeholder-gray-400 transition-all"
                                                placeholder="john@example.com"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="subject" className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Subject</label>
                                        <input
                                            type="text"
                                            id="subject"
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleChange}
                                            className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-700 rounded-2xl border-none focus:ring-2 focus:ring-primary text-dark dark:text-white placeholder-gray-400 transition-all"
                                            placeholder="How can we help?"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="message" className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Message</label>
                                        <textarea
                                            id="message"
                                            name="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            rows="6"
                                            className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-700 rounded-2xl border-none focus:ring-2 focus:ring-primary text-dark dark:text-white placeholder-gray-400 transition-all resize-none"
                                            placeholder="Tell us more about your inquiry..."
                                            required
                                        ></textarea>
                                    </div>
                                    <button
                                        type="submit"
                                        className="w-full bg-gradient-to-r from-primary to-secondary text-white font-bold py-4 rounded-2xl hover:shadow-lg hover:opacity-90 transition-all transform active:scale-95 flex items-center justify-center text-lg"
                                    >
                                        <Send className="w-5 h-5 mr-2" />
                                        Send Message
                                    </button>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Contact;
