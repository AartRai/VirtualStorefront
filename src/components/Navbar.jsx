import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Menu, User, Search, Heart, Sun, Moon, LogOut } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const searchRef = useRef(null);

    const { cartCount } = useCart();
    const { theme, toggleTheme } = useTheme();
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/shop?search=${encodeURIComponent(searchQuery)}`);
            setSearchQuery('');
        }
    };

    return (
        <nav className="bg-transparent pt-6 pb-4 z-50 relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Link to="/" className="flex-shrink-0 flex items-center space-x-2">
                            <div className="w-8 h-8 bg-dark dark:bg-white rounded-lg flex items-center justify-center">
                                <span className="text-white dark:text-dark text-xl font-bold">::</span>
                            </div>
                            <span className="text-2xl font-heading font-bold text-dark dark:text-white tracking-tight">locallift</span>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-12">
                        <Link to="/" className="text-dark dark:text-gray-200 font-bold hover:text-primary transition">Home</Link>
                        <Link to="/shop" className="text-dark dark:text-gray-200 font-medium hover:text-primary transition">Shop</Link>
                        <Link to="/about" className="text-dark dark:text-gray-200 font-medium hover:text-primary transition">Blog</Link>
                        <Link to="/contact" className="text-dark dark:text-gray-200 font-medium hover:text-primary transition">Contact</Link>
                    </div>

                    {/* Search & Icons */}
                    <div className="flex items-center space-x-4">
                        {/* Search Bar */}
                        <div className="relative hidden md:block" ref={searchRef}>
                            <form onSubmit={handleSearch} className="flex items-center relative">
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                    className="pl-4 pr-10 py-2 rounded-full bg-white dark:bg-gray-800 dark:text-white border-none focus:ring-2 focus:ring-primary outline-none w-48 transition-all focus:w-64 shadow-sm"
                                />
                                <button type="submit" className="absolute right-3 text-gray-400 hover:text-primary">
                                    <Search className="h-4 w-4" />
                                </button>
                            </form>
                        </div>



                        <button
                            onClick={toggleTheme}
                            className="text-dark dark:text-white hover:text-primary relative p-2 bg-white dark:bg-gray-800 rounded-full shadow-sm transition"
                        >
                            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                        </button>

                        <Link to="/wishlist" className="text-dark dark:text-white hover:text-primary relative p-2 bg-white dark:bg-gray-800 rounded-full shadow-sm transition">
                            <Heart className="h-5 w-5" />
                        </Link>

                        {user ? (
                            <div className="relative group">
                                <button className="text-dark dark:text-white hover:text-primary relative p-2 bg-white dark:bg-gray-800 rounded-full shadow-sm transition flex items-center space-x-2">
                                    <User className="h-5 w-5" />
                                    <span className="hidden md:inline text-sm font-bold">{user.name}</span>
                                </button>
                                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-xl py-2 hidden group-hover:block z-50">
                                    <Link to="/dashboard" className="block px-4 py-2 text-sm text-dark dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700">Dashboard</Link>
                                    <button
                                        onClick={logout}
                                        className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center"
                                    >
                                        <LogOut className="h-4 w-4 mr-2" /> Logout
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <Link to="/auth/login" className="text-dark dark:text-white hover:text-primary relative p-2 bg-white dark:bg-gray-800 rounded-full shadow-sm transition">
                                <User className="h-5 w-5" />
                            </Link>
                        )}

                        <Link to="/cart" className="text-dark dark:text-white hover:text-primary relative p-2 bg-white dark:bg-gray-800 rounded-full shadow-sm">
                            <ShoppingCart className="h-5 w-5" />
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 inline-flex items-center justify-center w-5 h-5 text-xs font-bold leading-none text-white bg-primary rounded-full border-2 border-white">
                                    {cartCount}
                                </span>
                            )}
                        </Link>

                        {/* Mobile menu button */}
                        <div className="md:hidden flex items-center">
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="text-dark dark:text-white hover:text-primary p-2"
                            >
                                <Menu className="h-6 w-6" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-white/90 dark:bg-gray-800/90 backdrop-blur-md absolute top-full left-0 right-0 shadow-lg z-50 rounded-b-3xl">
                    <div className="px-4 pt-4 pb-6 space-y-2">
                        <Link to="/" className="block px-3 py-2 rounded-xl text-base font-bold text-dark dark:text-white hover:bg-orange-50 dark:hover:bg-gray-700">Home</Link>
                        <Link to="/shop" className="block px-3 py-2 rounded-xl text-base font-medium text-dark dark:text-white hover:bg-orange-50 dark:hover:bg-gray-700">Shop</Link>
                        <Link to="/about" className="block px-3 py-2 rounded-xl text-base font-medium text-dark dark:text-white hover:bg-orange-50 dark:hover:bg-gray-700">Blog</Link>
                        <Link to="/contact" className="block px-3 py-2 rounded-xl text-base font-medium text-dark dark:text-white hover:bg-orange-50 dark:hover:bg-gray-700">Contact</Link>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
