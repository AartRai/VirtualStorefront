import { useState, useEffect } from 'react';
import { DollarSign, ShoppingBag, Users, Package } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import StatCard from '../../components/dashboard/StatCard';
import SalesChart from '../../components/dashboard/SalesChart';
import OrderStatusChart from '../../components/dashboard/OrderStatusChart';
import StockChart from '../../components/dashboard/StockChart';

const AdminDashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        sales: 0,
        orders: 0,
        products: 0,
        users: 0,
        salesHistory: [],
        orderStatusDist: [],
        stockStatus: { inStock: 0, outOfStock: 0 }
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get('/admin/stats');
                // Format sales with commas
                const formattedSales = res.data.sales.toLocaleString();
                setStats({
                    ...res.data,
                    sales: formattedSales
                });
                setLoading(false);
            } catch (err) {
                console.error("Failed to fetch admin stats", err);
                setLoading(false);
            }
        };

        if (user && user.role === 'admin') {
            fetchStats();
        }
    }, [user]);

    const statCards = [
        {
            title: 'Total Sales Amount',
            value: `₹${stats.sales || 0}`,
            icon: DollarSign,
            color: 'bg-indigo-600', // Deep Purple/Blue match
            shadow: 'shadow-indigo-200'
        },
        {
            title: 'Total Orders',
            value: stats.orders,
            icon: Package,
            color: 'bg-red-500',
            shadow: 'shadow-red-200'
        },
        {
            title: 'Total Products',
            value: stats.products,
            icon: ShoppingBag,
            color: 'bg-orange-400',
            shadow: 'shadow-orange-200'
        },
        {
            title: 'Total Users',
            value: stats.users,
            icon: Users,
            color: 'bg-emerald-500', // Green match
            shadow: 'shadow-emerald-200'
        }
    ];

    if (loading) {
        return <div className="h-96 flex items-center justify-center">Loading dashboard...</div>;
    }

    return (
        <div className="space-y-6 animate-fade-in-up">
            {/* 1. Stat Cards Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, index) => (
                    <StatCard
                        key={index}
                        title={stat.title}
                        value={stat.value}
                        icon={stat.icon}
                        color={stat.color}
                        shadowColor={stat.shadow}
                        delay={index * 0.1}
                    />
                ))}
            </div>

            {/* 2. Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Sales Chart (Takes 2 columns on large screens) */}
                <div className="lg:col-span-2">
                    <SalesChart data={stats.salesHistory} />
                </div>

                {/* Order Status Pie Chart */}
                <div className="lg:col-span-1">
                    <OrderStatusChart data={stats.orderStatusDist} />
                </div>
            </div>

            {/* 3. Bottom Row Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Product/Stock Bar Chart Placeholder - reusing Sales logic style or create new */}
                <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                    <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-6">Product Stock Levels</h3>
                    <div className="h-[200px] flex items-end justify-between gap-4 px-4 overflow-x-auto">
                        {[65, 40, 75, 50, 85, 45, 90, 60, 30, 55, 70, 80].map((h, i) => (
                            <div key={i} className="w-12 bg-purple-100 dark:bg-purple-900/30 rounded-t-lg relative group h-full flex items-end">
                                <div
                                    style={{ height: `${h}%` }}
                                    className="w-full bg-purple-500 rounded-t-lg transition-all duration-500 group-hover:bg-purple-600"
                                >
                                    <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded">
                                        {h} units
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Stock Status Donut */}
                <div className="lg:col-span-1">
                    <StockChart data={stats.stockStatus} />
                </div>
            </div>

            <div className="text-center text-xs text-gray-400 mt-8 pb-4">
                Developed with ❤️ by Aarti Rai
            </div>
        </div>
    );
};

export default AdminDashboard;
