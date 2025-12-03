import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom';
import { User, Package, CreditCard, LogOut, Home, LayoutDashboard, ShoppingBag, Layers, Tag, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const DashboardLayout = ({ role }) => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/auth/login');
    };

    const customerNavItems = [
        { path: '/dashboard', label: 'Overview', icon: LayoutDashboard, end: true },
        { path: '/dashboard/orders', label: 'My Orders', icon: Package },
        { path: '/dashboard/payments', label: 'Payments', icon: CreditCard },
    ];

    const adminNavItems = [
        { path: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
        { path: '/admin/products', label: 'Products', icon: ShoppingBag },
        { path: '/admin/categories', label: 'Categories', icon: Layers },
        { path: '/admin/orders', label: 'Orders', icon: Package },
        { path: '/admin/offers', label: 'Offers', icon: Tag },
    ];

    const navItems = role === 'admin' ? adminNavItems : customerNavItems;

    return (
        <div className="flex h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
            {/* Sidebar */}
            <aside className="w-64 bg-white dark:bg-gray-800 shadow-md hidden md:flex flex-col transition-colors duration-300">
                <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                    <Link to="/" className="flex items-center gap-2 mb-1">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold">::</div>
                        <span className="text-xl font-bold text-dark dark:text-white">locallift</span>
                    </Link>
                    <div className="text-xs font-bold text-gray-500 uppercase mt-4 tracking-wider">
                        {role === 'admin' ? 'Admin Panel' : 'My Account'}
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.end}
                            className={({ isActive }) =>
                                `flex items-center px-4 py-3 rounded-xl transition font-medium ${isActive
                                    ? 'bg-primary text-white shadow-md'
                                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-primary'
                                }`
                            }
                        >
                            <item.icon className="h-5 w-5 mr-3" />
                            {item.label}
                        </NavLink>
                    ))}
                </nav>

                <div className="p-4 border-t border-gray-100 dark:border-gray-700 space-y-2">
                    <Link to="/" className="flex items-center px-4 py-3 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 font-medium transition">
                        <Home className="h-5 w-5 mr-3" /> Back to Home
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 font-medium transition"
                    >
                        <LogOut className="h-5 w-5 mr-3" /> Logout
                    </button>
                </div>
            </aside>

            {/* Mobile Header (Visible only on small screens) */}
            <div className="md:hidden fixed top-0 left-0 right-0 bg-white dark:bg-gray-800 z-50 px-4 py-3 shadow-sm flex items-center justify-between">
                <Link to="/" className="font-bold text-xl text-dark dark:text-white">locallift</Link>
                <div className="flex gap-4">
                    <Link to="/dashboard" className="p-2"><LayoutDashboard className="h-6 w-6 text-dark dark:text-white" /></Link>
                    <Link to="/dashboard/orders" className="p-2"><Package className="h-6 w-6 text-dark dark:text-white" /></Link>
                </div>
            </div>

            <main className="flex-1 overflow-y-auto p-4 md:p-8 pt-20 md:pt-8 text-dark dark:text-white">
                <div className="max-w-5xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
