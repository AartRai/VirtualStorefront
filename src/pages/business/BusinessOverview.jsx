import { useState, useEffect } from 'react';
import api from '../../api/axios';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend
} from 'recharts';
import {
    LayoutDashboard, TrendingUp, ShoppingBag, Users, Clock, ArrowUp, ArrowDown
} from 'lucide-react';

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
                api.get('/business/stats'),
                api.get('/business/top-products')
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
                    { title: 'Total Revenue', value: `₹${stats.totalRevenue.toLocaleString()}`, icon: TrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-50' },
                    { title: 'Total Orders', value: stats.totalOrders, icon: ShoppingBag, color: 'text-blue-500', bg: 'bg-blue-50' },
                    { title: 'Total Customers', value: stats.totalCustomers, icon: Users, color: 'text-purple-500', bg: 'bg-purple-50' },
                    { title: 'Pending Orders', value: stats.pendingOrders, icon: Clock, color: 'text-orange-500', bg: 'bg-orange-50' },
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
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Sales Analytic Chart */}
                <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-gray-800 dark:text-white">Sales Analytic</h3>
                        <div className="flex gap-4">
                            <div className="text-center">
                                <p className="text-xs text-gray-400">Income</p>
                                <p className="font-bold text-gray-800 dark:text-white">₹{stats.totalRevenue.toLocaleString()}</p>
                            </div>
                            <div className="text-center">
                                <p className="text-xs text-gray-400">Expenses</p>
                                <p className="font-bold text-gray-800 dark:text-white">₹{(stats.totalRevenue * 0.2).toLocaleString()}</p>
                            </div>
                        </div>
                    </div>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={stats.analytics} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                                <Tooltip content={<CustomTooltip />} />
                                <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Sales Target Pie */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col items-center">
                    <h3 className="text-lg font-bold text-gray-800 dark:text-white w-full text-left mb-4">Sales Target</h3>
                    <div className="relative h-64 w-full flex justify-center items-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={targetData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {targetData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-3xl font-bold text-gray-800 dark:text-white">{Math.min(100, ((stats.totalRevenue / 100000) * 100)).toFixed(0)}%</span>
                            <span className="text-xs text-gray-400">Achieved</span>
                        </div>
                    </div>
                    <div className="text-center mt-2 w-full">
                        <div className="flex justify-between text-sm mb-2">
                            <span className="text-gray-500">Daily Target</span>
                            <span className="font-bold">₹1,500</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Monthly Target</span>
                            <span className="font-bold">₹1,00,000</span>
                        </div>
                    </div>
                </div>
            </div>

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
