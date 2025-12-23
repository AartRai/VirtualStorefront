import { useState, useEffect } from 'react';
import api from '../../api/axios';
import {
    LayoutDashboard, TrendingUp, ShoppingBag, Users, Clock, ArrowUp, ArrowDown
} from 'lucide-react';
import DashboardCharts from '../../components/DashboardCharts';

const BusinessOverview = () => {
    const [stats, setStats] = useState({
        totalRevenue: 0,
        totalOrders: 0,
        totalCustomers: 0,
        pendingOrders: 0,
        analytics: []
    });
    const [topProducts, setTopProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const [statsRes, productsRes] = await Promise.all([
                api.get('/dashboard/stats'),
                api.get('/business/top-products') // Keep this if I didn't verify dashboard has top-p completely or if business route is still used elsewhere
            ]);
            setStats(statsRes.data);
            setTopProducts(productsRes.data);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching business data", err);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 30000);
        return () => clearInterval(interval);
    }, []);

    // Custom Tooltip for Charts
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white dark:bg-gray-800 p-3 shadow-xl rounded-lg border border-gray-100 dark:border-gray-700">
                    <p className="font-bold text-gray-700 dark:text-gray-200">{label}</p>
                    <p className="text-primary font-semibold">Revenue: ₹{payload[0].value.toLocaleString()}</p>
                </div>
            );
        }
        return null;
    };

    const targetData = [
        { name: 'Achieved', value: stats.totalRevenue || 0 },
        { name: 'Remaining', value: Math.max(0, 100000 - stats.totalRevenue) } // Mock target of 1 Lakh
    ];
    const COLORS = ['#10b981', '#e5e7eb'];

    if (loading) return <div className="h-96 flex items-center justify-center animate-pulse text-gray-400">Loading Dashboard...</div>;

    return (
        <div className="space-y-8 animate-fade-in pb-10">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Dashboard Overview</h1>
                    <p className="text-gray-500 text-sm mt-1">Welcome back! Here's what's happening today.</p>
                </div>
                <div className="flex space-x-3">
                    <button
                        onClick={() => { setLoading(true); fetchData(); }}
                        className="p-2 px-3 bg-white dark:bg-gray-800 border-none shadow-sm rounded-lg text-sm text-gray-600 hover:text-primary flex items-center gap-1 transition-colors"
                        title="Refresh Data"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                    </button>
                    <select className="bg-white dark:bg-gray-800 border-none shadow-sm rounded-lg text-sm p-2 outline-none text-gray-600">
                        <option>Last 30 Days</option>
                        <option>This Year</option>
                    </select>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { title: 'Total Revenue', value: `₹${(stats.totalRevenue || 0).toLocaleString()}`, icon: TrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-50' },
                    { title: 'Total Orders', value: stats.totalOrders || 0, icon: ShoppingBag, color: 'text-blue-500', bg: 'bg-blue-50' },
                    { title: 'Total Customers', value: stats.totalCustomers || 0, icon: Users, color: 'text-purple-500', bg: 'bg-purple-50' },
                    { title: 'Pending Orders', value: stats.pendingOrders || 0, icon: Clock, color: 'text-orange-500', bg: 'bg-orange-50' },
                ].map((stat, idx) => (
                    <div key={idx} className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1">{stat.title}</p>
                                <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{stat.value}</h3>
                            </div>
                            <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center text-xs text-gray-400">
                            <span className="text-emerald-500 flex items-center font-bold mr-1"><ArrowUp className="w-3 h-3 mr-0.5" /> +12%</span>
                            from last month
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Content Grid */}
            <DashboardCharts
                salesHistory={stats.salesHistory}
                categoryStats={stats.categoryStats}
                topProducts={stats.topProducts} // Charts component might handle different format, let's ensure compatibility
            />

            {/* Top Selling Products */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-gray-800 dark:text-white">Top Selling Products</h3>
                    <button className="text-sm text-primary font-bold hover:underline">View All</button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                    {topProducts.map((product) => (
                        <div key={product._id} className="group cursor-pointer">
                            <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 mb-3">
                                {product.images && product.images[0] ? (
                                    <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-200">No Image</div>
                                )}
                            </div>
                            <h4 className="font-bold text-gray-800 dark:text-white truncate">{product.name}</h4>
                            <p className="text-gray-500 text-sm mb-1">{product.sales} Sales</p>
                            <p className="text-primary font-bold">₹{product.price}</p>
                        </div>
                    ))}
                    {topProducts.length === 0 && (
                        <div className="col-span-full text-center py-10 text-gray-400">No sales data yet.</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BusinessOverview;
