import { DollarSign, ShoppingBag, Users, TrendingUp, ArrowUp, ArrowDown } from 'lucide-react';

const AdminDashboard = () => {
    const stats = [
        { title: 'Total Sales', value: '$24,500', change: '+12%', isPositive: true, icon: DollarSign, color: 'bg-blue-500' },
        { title: 'Total Orders', value: '1,240', change: '+5%', isPositive: true, icon: ShoppingBag, color: 'bg-orange-500' },
        { title: 'Total Users', value: '8,400', change: '+18%', isPositive: true, icon: Users, color: 'bg-green-500' },
        { title: 'Bounce Rate', value: '42%', change: '-2%', isPositive: false, icon: TrendingUp, color: 'bg-red-500' },
    ];

    const recentOrders = [
        { id: '#ORD-001', user: 'Alice Smith', date: '2025-12-01', amount: '$120.00', status: 'Completed' },
        { id: '#ORD-002', user: 'Bob Jones', date: '2025-12-01', amount: '$54.50', status: 'Processing' },
        { id: '#ORD-003', user: 'Charlie Brown', date: '2025-11-30', amount: '$320.00', status: 'Pending' },
        { id: '#ORD-004', user: 'Diana Prince', date: '2025-11-29', amount: '$85.00', status: 'Completed' },
    ];

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-dark dark:text-white">Admin Dashboard</h1>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 rounded-xl ${stat.color} bg-opacity-10 text-white`}>
                                <stat.icon className={`h-6 w-6 ${stat.color.replace('bg-', 'text-')}`} />
                            </div>
                            <span className={`flex items-center text-sm font-bold ${stat.isPositive ? 'text-green-500' : 'text-red-500'}`}>
                                {stat.isPositive ? <ArrowUp className="h-4 w-4 mr-1" /> : <ArrowDown className="h-4 w-4 mr-1" />}
                                {stat.change}
                            </span>
                        </div>
                        <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">{stat.title}</h3>
                        <p className="text-2xl font-bold text-dark dark:text-white mt-1">{stat.value}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Sales Chart Placeholder */}
                <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <h2 className="text-xl font-bold text-dark dark:text-white mb-6">Revenue Overview</h2>
                    <div className="h-64 flex items-end justify-between space-x-2">
                        {[40, 60, 45, 70, 50, 80, 65, 85, 75, 90, 60, 95].map((height, i) => (
                            <div key={i} className="w-full bg-blue-100 dark:bg-blue-900/20 rounded-t-lg relative group">
                                <div
                                    style={{ height: `${height}%` }}
                                    className="absolute bottom-0 left-0 right-0 bg-primary rounded-t-lg transition-all duration-500 group-hover:bg-secondary"
                                ></div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between mt-4 text-xs text-gray-500 font-bold">
                        {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(m => (
                            <span key={m}>{m}</span>
                        ))}
                    </div>
                </div>

                {/* Recent Orders */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <h2 className="text-xl font-bold text-dark dark:text-white mb-6">Recent Orders</h2>
                    <div className="space-y-4">
                        {recentOrders.map((order) => (
                            <div key={order.id} className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl transition">
                                <div>
                                    <p className="font-bold text-dark dark:text-white text-sm">{order.user}</p>
                                    <p className="text-xs text-gray-500">{order.id}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-primary text-sm">{order.amount}</p>
                                    <span className={`text-[10px] px-2 py-1 rounded-full font-bold ${order.status === 'Completed' ? 'bg-green-100 text-green-600' :
                                            order.status === 'Processing' ? 'bg-blue-100 text-blue-600' :
                                                'bg-yellow-100 text-yellow-600'
                                        }`}>
                                        {order.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="w-full mt-6 py-2 text-sm font-bold text-primary hover:bg-orange-50 dark:hover:bg-gray-700 rounded-lg transition">
                        View All Orders
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
