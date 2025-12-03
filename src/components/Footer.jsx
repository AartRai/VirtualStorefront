import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Mail } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-dark text-white pt-12 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="space-y-4">
                        <h3 className="text-2xl font-heading font-bold text-primary">LocalLift</h3>
                        <p className="text-gray-300 text-sm">
                            Empowering local businesses to reach a global audience. Shop small, dream big.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-lg font-bold mb-4">Quick Links</h4>
                        <ul className="space-y-2 text-sm text-gray-300">
                            <li><Link to="/shop" className="hover:text-primary">Shop All</Link></li>
                            <li><Link to="/about" className="hover:text-primary">About Us</Link></li>
                            <li><Link to="/auth/signup" className="hover:text-primary">Become a Seller</Link></li>
                            <li><Link to="/faq" className="hover:text-primary">FAQ</Link></li>
                        </ul>
                    </div>

                    {/* Customer Service */}
                    <div>
                        <h4 className="text-lg font-bold mb-4">Support</h4>
                        <ul className="space-y-2 text-sm text-gray-300">
                            <li><Link to="/contact" className="hover:text-primary">Contact Us</Link></li>
                            <li><Link to="/shipping" className="hover:text-primary">Shipping Policy</Link></li>
                            <li><Link to="/returns" className="hover:text-primary">Returns & Refunds</Link></li>
                            <li><Link to="/privacy" className="hover:text-primary">Privacy Policy</Link></li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h4 className="text-lg font-bold mb-4">Stay Connected</h4>
                        <div className="flex space-x-4 mb-4">
                            <a href="#" className="text-gray-300 hover:text-primary"><Facebook className="h-5 w-5" /></a>
                            <a href="#" className="text-gray-300 hover:text-primary"><Twitter className="h-5 w-5" /></a>
                            <a href="#" className="text-gray-300 hover:text-primary"><Instagram className="h-5 w-5" /></a>
                        </div>
                        <div className="flex">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="px-4 py-2 w-full rounded-l-md text-gray-900 focus:outline-none"
                            />
                            <button className="bg-primary px-4 py-2 rounded-r-md hover:bg-opacity-90 transition">
                                <Mail className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-700 mt-12 pt-8 text-center text-sm text-gray-400">
                    &copy; {new Date().getFullYear()} LocalLift. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
