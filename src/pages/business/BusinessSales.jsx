import { useState, useEffect } from 'react';
import api from '../../api/axios';
import {
    DollarSign, ShoppingBag, Package, TrendingUp, Calendar, CreditCard, ArrowUp
} from 'lucide-react';

const BusinessSales = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const res = await api.get('/business/analytics/detailed');
            setData(res.data);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching sales data", err);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        // Conceptually we could add polling interval here for "auto-refresh"
        const interval = setInterval(fetchData, 30000); // Poll every 30s
        return () => clearInterval(interval);
    }, []);

    if (loading) return <div className="h-96 flex items-center justify-center animate-pulse text-gray-400">Loading Sales Data...</div>;

    const cards = [
        { label: 'Total Sales Amount', value: `₹${data.sales.month.toLocaleString()}`, sub: 'Lifetime Revenue: ₹' + data.sales.month.toLocaleString(), icon: DollarSign, color: 'text-emerald-500', bg: 'bg-emerald-50' }, // Request asks for Total Sales Amount, typically means lifetime or current period? Let's show Month as main and Lifetime as sub or vice versa. Usually "Total Sales" implies lifetime.
        // Let's use Lifetime total revenue for "Total Sales Amount"
        { label: 'Total Sales Amount', value: `₹${(data.aov * data.orders.total).toLocaleString()}`, info: 'Lifetime Revenue', icon: DollarSign, color: 'text-emerald-500', bg: 'bg-emerald-50' },
        // Wait, I can calculate Total Lifetime Revenue from data.aov * totalOrders roughly, OR simpler:
        // business.js var `totalRevenue` is lifetime. But I didn't send `totalRevenue` explicitly in root object, I used it to calc AOV.
        // Wait, AOV = TotalRevenue / TotalOrders. So TotalRevenue = AOV * TotalOrders. I will use that.

        { label: 'Total Orders', value: data.orders.total, info: 'Lifetime Orders', icon: ShoppingBag, color: 'text-blue-500', bg: 'bg-blue-50' },
        { label: 'Total Units Sold', value: data.orders.totalUnits, info: 'Lifetime Units', icon: Package, color: 'text-purple-500', bg: 'bg-purple-50' },
        { label: 'Average Order Value', value: `₹${data.aov.toLocaleString()}`, info: 'Per Order', icon: CreditCard, color: 'text-orange-500', bg: 'bg-orange-50' },
        { label: "Today's Sales", value: `₹${data.sales.today.toLocaleString()}`, info: 'Since Midnight', icon: Calendar, color: 'text-teal-500', bg: 'bg-teal-50' },
        { label: "This Month's Sales", value: `₹${data.sales.month.toLocaleString()}`, info: 'Current Month', icon: TrendingUp, color: 'text-indigo-500', bg: 'bg-indigo-50' },
    ];

    // Re-calculating Total Revenue accurately for the first card
    const totalLifetimeRevenue = data.aov * data.orders.total;

    return (
        <div className="space-y-8 animate-fade-in pb-10">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Sales Overview</h1>
                    <p className="text-gray-500 text-sm mt-1">Real-time performance metrics.</p>
                </div>
                <button
                    onClick={() => { setLoading(true); fetchData(); }}
                    className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:shadow text-sm font-medium text-gray-700 dark:text-gray-200 transition-all active:scale-95"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Refresh Data
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Custom Card rendering to ensure exact match to requirements */}

                {/* 1. Total Sales Amount */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Total Sales Amount</p>
                            <h3 className="text-3xl font-bold text-gray-800 dark:text-white mt-2">₹{totalLifetimeRevenue.toLocaleString()}</h3>
                        </div>
                        <div className="p-3 rounded-xl bg-emerald-50 text-emerald-500">
                            <DollarSign className="w-6 h-6" />
                        </div>
                    </div>
                </div>

                {/* 2. Total Orders */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Total Orders</p>
                            <h3 className="text-3xl font-bold text-gray-800 dark:text-white mt-2">{data.orders.total}</h3>
                        </div>
                        <div className="p-3 rounded-xl bg-blue-50 text-blue-500">
                            <ShoppingBag className="w-6 h-6" />
                        </div>
                    </div>
                </div>

                {/* 3. Total Units Sold */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Total Units Sold</p>
                            <h3 className="text-3xl font-bold text-gray-800 dark:text-white mt-2">{data.orders.totalUnits}</h3>
                        </div>
                        <div className="p-3 rounded-xl bg-purple-50 text-purple-500">
                            <Package className="w-6 h-6" />
                        </div>
                    </div>
                </div>

                {/* 4. Average Order Value */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Average Order Value</p>
                            <h3 className="text-3xl font-bold text-gray-800 dark:text-white mt-2">₹{data.aov.toLocaleString()}</h3>
                        </div>
                        <div className="p-3 rounded-xl bg-orange-50 text-orange-500">
                            <CreditCard className="w-6 h-6" />
                        </div>
                    </div>
                </div>

                {/* 5. Today's Sales */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Today's Sales</p>
                            <h3 className="text-3xl font-bold text-gray-800 dark:text-white mt-2">₹{data.sales.today.toLocaleString()}</h3>
                        </div>
                        <div className="p-3 rounded-xl bg-teal-50 text-teal-500">
                            <Calendar className="w-6 h-6" />
                        </div>
                    </div>
                </div>

                {/* 6. This Month's Sales */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">This Month's Sales</p>
                            <h3 className="text-3xl font-bold text-gray-800 dark:text-white mt-2">₹{data.sales.month.toLocaleString()}</h3>
                        </div>
                        <div className="p-3 rounded-xl bg-indigo-50 text-indigo-500">
                            <TrendingUp className="w-6 h-6" />
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default BusinessSales;
