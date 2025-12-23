import { Outlet, NavLink, Link, useNavigate, Navigate } from 'react-router-dom';
import { User, Package, CreditCard, LogOut, Home, LayoutDashboard, ShoppingBag, Layers, Tag, Users, Search, ShoppingCart, Bell, MoreVertical, Sun, Moon, Menu, X, TrendingUp, ArrowUp, Mail, Settings } from 'lucide-react';
import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';

const DashboardLayout = ({ role }) => {
    const { logout, user, loading } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const { cartCount } = useCart();
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    const handleLogout = () => {
        logout();
        navigate('/auth/login');
    };

    const customerNavItems = [
        { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, end: true },
        { path: '/dashboard/orders', label: 'Orders', icon: Package },
        { path: '/dashboard/profile', label: 'My Profile', icon: User },
    ];

    const adminNavItems = [
        { path: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
        { path: '/admin/orders', label: 'Orders', icon: Package },
        { path: '/admin/products', label: 'Products', icon: ShoppingBag },
        { path: '/admin/inventory', label: 'Inventory', icon: Layers },
        { path: '/admin/users', label: 'Users', icon: Users },
        { path: '/admin/reviews', label: 'Reviews', icon: MoreVertical },
        { path: '/admin/profile', label: 'Profile', icon: User },
    ];

    const businessNavItems = [
        { path: '/business', label: 'Dashboard', icon: LayoutDashboard, end: true },
        { path: '/business/analytics', label: 'Analytics', icon: TrendingUp }, // Placeholder route or maps to Overview with query param
        { path: '/business/products', label: 'Products', icon: ShoppingBag },
        { path: '/business/inventory', label: 'Inventory', icon: Layers },
        { path: '/business/orders', label: 'Orders', icon: Package },
        { path: '/business/sales', label: 'Sales', icon: ArrowUp },
        { path: '/business/customers', label: 'Customers', icon: Users },
        { path: '/business/newsletter', label: 'Newsletter', icon: Mail },
        { path: '/business/profile', label: 'Settings', icon: Settings },
    ];

    const navItems = role === 'admin' ? adminNavItems : role === 'business' ? businessNavItems : customerNavItems;

    const [notifications, setNotifications] = useState([]);
    const [showNotifDropdown, setShowNotifDropdown] = useState(false);

    // Fetch notifications
    const fetchNotifications = async () => {
        try {
            const res = await api.get('/notifications');
            setNotifications(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    // Poll for notifications or fetch on mount
    useEffect(() => {
        if (user) fetchNotifications();
        // Optional: Set interval for polling
    }, [user]);

    const handleMarkAsRead = async (id, link) => {
        try {
            await api.put(`/notifications/${id}/read`);
            setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
            if (link) navigate(link);
            setShowNotifDropdown(false);
        } catch (err) {
            console.error(err);
        }
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    if (loading) {
        return <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>;
    }

    if (!user) {
        return <Navigate to="/auth/login" replace />;
    }

    return (
        <div className="flex h-screen bg-gray-100 dark:bg-gray-900 font-sans transition-colors duration-300">
            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 w-64 bg-[#1e293b] text-white flex flex-col shadow-xl z-30 transition-transform duration-300 transform md:translate-x-0 md:static ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="p-4 border-b border-gray-700 bg-[#1e293b] flex justify-between items-center">
                    <div className="flex items-center gap-3 bg-[#2d3748] p-3 rounded-lg mb-4">
                        <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center text-gray-800 font-bold text-lg overflow-hidden">
                            <img src="https://api.dicebear.com/7.x/adventurer/svg?seed=Felix" alt="User" />
                        </div>
                        <div className="overflow-hidden">
                            <h3 className="font-bold text-sm truncate">{user?.name || 'LocalLift User'}</h3>
                            <p className="text-xs text-gray-400 truncate">{user?.email || 'admin@locallift.com'} </p>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 overflow-y-auto py-2">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.label}
                            to={item.path}
                            end={item.end}
                            onClick={() => setIsSidebarOpen(false)}
                            className={({ isActive }) =>
                                `flex items-center px-6 py-3 transition-colors border-l-4 ${isActive
                                    ? 'bg-[#2d3748] border-yellow-400 text-white'
                                    : 'border-transparent text-gray-300 hover:bg-[#2d3748] hover:text-white'
                                }`
                            }
                        >
                            <item.icon className="h-5 w-5 mr-3 opacity-90" />
                            <span className="font-medium text-[15px]">{item.label}</span>
                        </NavLink>
                    ))}
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center px-6 py-3 text-gray-300 hover:bg-[#2d3748] hover:text-white transition-colors border-l-4 border-transparent"
                    >
                        <LogOut className="h-5 w-5 mr-3 opacity-90" />
                        <span className="font-medium text-[15px]">Logout</span>
                    </button>
                </nav>

                <div className="p-4 text-xs text-gray-500 border-t border-gray-700 text-center">
                    Developed with ❤️ by Aarti Rai
                </div>

            </aside>

            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-20 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="bg-white dark:bg-gray-800 text-gray-900 border-b border-gray-200 dark:border-gray-700 h-16 shadow-sm flex items-center justify-between px-6 z-10 shrink-0 transition-colors duration-300">
                    {/* Logo Area */}
                    <div className="flex items-center gap-2">
                        <div className="md:hidden mr-4">
                            <button onClick={toggleSidebar} className="text-gray-600 dark:text-gray-300">
                                <Menu className="w-6 h-6" />
                            </button>
                        </div>
                        <Link to="/" className="text-xl font-bold italic tracking-wider flex items-center text-blue-600 dark:text-blue-400">
                            LocalLift
                            {role !== 'customer' && (
                                <>
                                    <span className="text-gray-700 dark:text-gray-300 not-italic ml-0.5">Admin</span>
                                    <span className="text-orange-500 text-2xl leading-none ml-1">+</span>
                                </>
                            )}
                        </Link>
                    </div>

                    {/* Search Bar */}
                    <div className="flex-1 max-w-xl mx-8 hidden md:block">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search for products, brands and more"
                                className="w-full h-10 pl-10 pr-4 rounded-lg bg-gray-100 dark:bg-gray-700 border-none text-gray-800 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 transition-all"
                            />
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        </div>
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center gap-4 font-semibold text-sm">
                        <Link
                            to="/cart"
                            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors relative text-gray-600 dark:text-gray-300"
                            title="Cart"
                        >
                            <ShoppingCart className="h-5 w-5" />
                            {cartCount > 0 && (
                                <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] w-3 h-3 flex items-center justify-center rounded-full">
                                    {cartCount}
                                </span>
                            )}
                        </Link>

                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-300"
                            title="Toggle Theme"
                        >
                            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                        </button>

                        {/* Notification Bell */}
                        <div className="relative">
                            <button
                                onClick={() => setShowNotifDropdown(!showNotifDropdown)}
                                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors relative text-gray-600 dark:text-gray-300"
                            >
                                <Bell className="h-5 w-5" />
                                {unreadCount > 0 && (
                                    <span className="absolute top-1 right-2 bg-red-600 text-white text-[10px] w-3 h-3 flex items-center justify-center rounded-full">
                                        {unreadCount}
                                    </span>
                                )}
                            </button>

                            {/* Dropdown */}
                            {showNotifDropdown && (
                                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden z-50">
                                    <div className="p-3 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                                        <h3 className="font-semibold text-sm text-gray-800 dark:text-white">Notifications</h3>
                                        <button onClick={fetchNotifications} className="text-xs text-blue-500 hover:text-blue-600">Refresh</button>
                                    </div>
                                    <div className="max-h-64 overflow-y-auto">
                                        {notifications.length > 0 ? (
                                            notifications.map(note => (
                                                <div
                                                    key={note._id}
                                                    onClick={() => handleMarkAsRead(note._id, note.link)}
                                                    className={`p-3 border-b border-gray-100 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition ${!note.read ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}
                                                >
                                                    <p className="text-xs font-medium text-gray-800 dark:text-gray-200">{note.message}</p>
                                                    <p className="text-[10px] text-gray-500 mt-1">{new Date(note.createdAt).toLocaleTimeString()}</p>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="p-4 text-center text-sm text-gray-500">No notifications</div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 p-1.5 rounded-lg transition-colors">
                            <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/50 rounded-full flex items-center justify-center text-purple-600 dark:text-purple-300 font-bold text-xs">
                                {user?.name?.charAt(0) || 'A'}
                            </div>
                            <div className="hidden md:block text-left">
                                <p className="text-xs font-bold text-gray-800 dark:text-white">{user?.name?.split(' ')[0] || 'Admin'}</p>
                                <p className="text-[10px] text-gray-500 dark:text-gray-400">Super Admin</p>
                            </div>
                            <MoreVertical className="h-4 w-4 text-gray-400" />
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-[#f1f3f6] dark:bg-gray-900 p-6 transition-colors duration-300">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
