import { useState } from 'react';
import { Search, Filter, Eye, CheckCircle, XCircle, Truck } from 'lucide-react';

const AdminOrders = () => {
    const [orders, setOrders] = useState([
        { id: 'ORD-001', user: 'Alice Smith', date: '2025-12-01', total: 120.00, status: 'Completed', items: 3 },
        { id: 'ORD-002', user: 'Bob Jones', date: '2025-12-01', total: 54.50, status: 'Processing', items: 1 },
        { id: 'ORD-003', user: 'Charlie Brown', date: '2025-11-30', total: 320.00, status: 'Pending', items: 5 },
        { id: 'ORD-004', user: 'Diana Prince', date: '2025-11-29', total: 85.00, status: 'Cancelled', items: 2 },
        { id: 'ORD-005', user: 'Evan Wright', date: '2025-11-28', total: 210.00, status: 'Completed', items: 1 },
    ]);
    const [filter, setFilter] = useState('All');

    const handleStatusChange = (id, newStatus) => {
        setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o));
    };

    const filteredOrders = filter === 'All' ? orders : orders.filter(o => o.status === filter);

    const getStatusColor = (status) => {
        switch (status) {
            case 'Completed': return 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400';
            case 'Processing': return 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400';
            case 'Pending': return 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400';
            case 'Cancelled': return 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400';
            default: return 'bg-gray-100 text-gray-600';
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-dark dark:text-white">Orders Management</h1>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row justify-between gap-4 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="flex items-center space-x-2 overflow-x-auto">
                    {['All', 'Pending', 'Processing', 'Completed', 'Cancelled'].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-3 py-1.5 rounded-lg text-sm font-bold transition whitespace-nowrap ${filter === f ? 'bg-primary text-white' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
                <div className="flex items-center space-x-2 bg-gray-50 dark:bg-gray-700/50 p-2 rounded-lg">
                    <Search className="h-4 w-4 text-gray-400" />
                    <input placeholder="Search Order ID..." className="bg-transparent border-none focus:ring-0 text-sm w-40 text-dark dark:text-white" />
                </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 text-xs uppercase font-bold">
                            <tr>
                                <th className="px-6 py-4">Order ID</th>
                                <th className="px-6 py-4">Customer</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Items</th>
                                <th className="px-6 py-4">Total</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                            {filteredOrders.map((order) => (
                                <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                                    <td className="px-6 py-4 font-bold text-dark dark:text-white text-sm">{order.id}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{order.user}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500">{order.date}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500">{order.items}</td>
                                    <td className="px-6 py-4 text-sm font-bold text-dark dark:text-white">${order.total.toFixed(2)}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(order.status)}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end space-x-2">
                                            <button className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg" title="View Details">
                                                <Eye className="h-4 w-4" />
                                            </button>
                                            {order.status === 'Pending' && (
                                                <button onClick={() => handleStatusChange(order.id, 'Processing')} className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg" title="Mark Processing">
                                                    <Truck className="h-4 w-4" />
                                                </button>
                                            )}
                                            {order.status === 'Processing' && (
                                                <button onClick={() => handleStatusChange(order.id, 'Completed')} className="p-2 text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg" title="Mark Completed">
                                                    <CheckCircle className="h-4 w-4" />
                                                </button>
                                            )}
                                            {(order.status === 'Pending' || order.status === 'Processing') && (
                                                <button onClick={() => handleStatusChange(order.id, 'Cancelled')} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg" title="Cancel Order">
                                                    <XCircle className="h-4 w-4" />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminOrders;
