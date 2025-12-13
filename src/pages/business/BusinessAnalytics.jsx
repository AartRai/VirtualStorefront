import { useState, useEffect } from 'react';
import api from '../../api/axios';
import {
    LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell
} from 'recharts';
import {
    TrendingUp, Calendar, DollarSign, ShoppingCart, ArrowUp, ArrowDown
} from 'lucide-react';

const BusinessAnalytics = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const res = await api.get('/business/analytics/detailed');
            setData(res.data);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching analytics", err);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 30000);
        return () => clearInterval(interval);
    }, []);

    if (loading) return <div className="h-96 flex items-center justify-center animate-pulse text-gray-400">Loading Analytics...</div>;

    const metrics = [
        { label: 'Sales Today', value: `₹${data.sales.today.toLocaleString()} `, icon: Calendar, color: 'text-blue-500', bg: 'bg-blue-50' },
        { label: 'This Week', value: `₹${data.sales.week.toLocaleString()} `, icon: TrendingUp, color: 'text-purple-500', bg: 'bg-purple-50' },
        { label: 'This Month', value: `₹${data.sales.month.toLocaleString()} `, icon: DollarSign, color: 'text-green-500', bg: 'bg-green-50' },
        { label: 'Avg Order Value', value: `₹${data.aov.toLocaleString()} `, icon: ShoppingCart, color: 'text-orange-500', bg: 'bg-orange-50' },
    ];

    return (
        <div className="space-y-8 animate-fade-in pb-10">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Sales Analytics</h1>
                    <p className="text-gray-500 text-sm mt-1">Deep dive into your business performance.</p>
                </div>
                <button
                    onClick={() => { setLoading(true); fetchData(); }}
                    className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:shadow text-sm font-medium text-gray-700 dark:text-gray-200 transition-all active:scale-95"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Refresh
                </button>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {metrics.map((m, idx) => (
                    <div key={idx} className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <p className="text-gray-500 text-xs font-bold uppercase">{m.label}</p>
                                <h3 className="text-2xl font-bold text-gray-800 dark:text-white mt-1">{m.value}</h3>
                            </div>
                            <div className={`p - 3 rounded - xl ${m.bg} ${m.color} `}>
                                <m.icon className="w-5 h-5" />
                            </div>
                        </div>
                        {m.label === 'This Month' && (
                            <div className={`text - xs font - bold flex items - center ${data.comparison.monthGrowth >= 0 ? 'text-green-500' : 'text-red-500'} `}>
                                {data.comparison.monthGrowth >= 0 ? <ArrowUp className="w-3 h-3 mr-1" /> : <ArrowDown className="w-3 h-3 mr-1" />}
                                {Math.abs(data.comparison.monthGrowth).toFixed(1)}% vs Last Month
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Revenue Growth Trend */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-6">Revenue Growth (Last 7 Days)</h3>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={data.revenueGrowth}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                    itemStyle={{ color: '#10b981', fontWeight: 'bold' }}
                                />
                                <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981' }} activeDot={{ r: 6 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Units Sold Indicator (Simplified as Bar for Monthly Comparison) */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-6">Units Sold Trend</h3>
                    <div className="flex items-center justify-center h-64 flex-col">
                        <div className="text-5xl font-bold text-primary mb-2">{data.unitsSold.current}</div>
                        <p className="text-gray-500 mb-6">Units sold this month</p>

                        <div className={`text - sm font - bold flex items - center px - 4 py - 2 rounded - full ${data.unitsSold.trend >= 0 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'} `}>
                            {data.unitsSold.trend >= 0 ? <ArrowUp className="w-4 h-4 mr-2" /> : <ArrowDown className="w-4 h-4 mr-2" />}
                            {Math.abs(data.unitsSold.trend)} {data.unitsSold.trend >= 0 ? 'more' : 'less'} than last month
                        </div>

                        {/* Visual Bar representation Mock */}
                        <div className="flex items-end gap-2 mt-8 h-20">
                            <div className="w-8 bg-gray-200 rounded-t-lg h-1/2 relative group">
                                <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs text-gray-400 opacity-0 group-hover:opacity-100">Last</div>
                            </div>
                            <div className="w-8 bg-primary rounded-t-lg h-3/4 relative group">
                                <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs text-primary font-bold opacity-0 group-hover:opacity-100">Now</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Order Analytics Section */}
            <div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Order Analytics</h2>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Order Status Distribution Chart */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 lg:col-span-1 flex flex-col items-center">
                        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 w-full text-left">Order Status Distribution</h3>
                        <div className="h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={[
                                            { name: 'Delivered', value: data.orders.delivered },
                                            { name: 'Pending', value: data.orders.pending },
                                            { name: 'Cancelled', value: data.orders.cancelled },
                                            { name: 'Returned', value: data.orders.returned },
                                        ]}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        <Cell fill="#10b981" /> {/* Delivered - Green */}
                                        <Cell fill="#facc15" /> {/* Pending - Yellow */}
                                        <Cell fill="#ef4444" /> {/* Cancelled - Red */}
                                        <Cell fill="#a855f7" /> {/* Returned - Purple */}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="flex flex-wrap gap-2 justify-center mt-4">
                            <div className="flex items-center text-xs text-gray-500"><span className="w-2 h-2 rounded-full bg-emerald-500 mr-1"></span>Delivered</div>
                            <div className="flex items-center text-xs text-gray-500"><span className="w-2 h-2 rounded-full bg-yellow-400 mr-1"></span>Pending</div>
                            <div className="flex items-center text-xs text-gray-500"><span className="w-2 h-2 rounded-full bg-red-500 mr-1"></span>Cancelled</div>
                            <div className="flex items-center text-xs text-gray-500"><span className="w-2 h-2 rounded-full bg-purple-500 mr-1"></span>Returned</div>
                        </div>
                    </div>

                    {/* Order Breakdown Stats */}
                    <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {[
                            { label: 'Total Orders', value: data.orders.total, color: 'text-blue-600', bg: 'bg-blue-100' },
                            { label: 'Delivered Orders', value: data.orders.delivered, color: 'text-emerald-600', bg: 'bg-emerald-100' },
                            { label: 'Pending Processing', value: data.orders.pending, color: 'text-yellow-600', bg: 'bg-yellow-100' },
                            { label: 'Cancelled Orders', value: data.orders.cancelled, color: 'text-red-600', bg: 'bg-red-100' },
                            { label: 'Return Requests', value: data.orders.returned, color: 'text-purple-600', bg: 'bg-purple-100' },
                        ].map((item, i) => (
                            <div key={i} className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center justify-between">
                                <div>
                                    <p className="text-gray-500 text-sm font-medium">{item.label}</p>
                                    <h4 className={`text - 3xl font - bold mt - 2 ${item.color} `}>{item.value}</h4>
                                </div>
                                <div className={`h - 12 w - 12 rounded - full ${item.bg} flex items - center justify - center opacity - 80`}>
                                    <span className={`text - xl font - bold ${item.color} `}>{item.value > 0 ? Math.round((item.value / data.orders.total) * 100) : 0}%</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BusinessAnalytics;
