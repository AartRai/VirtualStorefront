import { useState, useEffect } from 'react';
import { Search, Filter, Eye, CheckCircle, XCircle, Truck, Package, RotateCcw } from 'lucide-react';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { Loader } from 'lucide-react';

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const res = await api.get('/orders/admin/all');
            setOrders(res.data);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching orders:", err);
            setLoading(false);
        }
    };

    const handleStatusChange = async (id, newStatus) => {
        if (!window.confirm(`Update status to ${newStatus}?`)) return;
        try {
            const res = await api.put(`/orders/${id}/status`, { status: newStatus });
            setOrders(orders.map(o => o._id === id ? { ...o, status: newStatus } : o));
        } catch (err) {
            console.error("Update failed", err);
            toast.error("Failed to update status");
        }
    };

    const handleReturnAction = async (id, action) => {
        // action = 'Approved' or 'Rejected'
        if (!window.confirm(`${action} this return request?`)) return;
        try {
            const res = await api.put(`/orders/${id}/return-status`, { returnStatus: action });
            setOrders(orders.map(o => o._id === id ? { ...o, returnStatus: action, status: action === 'Approved' ? 'Returned' : o.status } : o));
        } catch (err) {
            console.error("Return update failed", err);
            toast.error("Failed to update return status");
        }
    };

    const filteredOrders = orders.filter(o => {
        const matchesFilter = filter === 'All' ? true : o.status === filter;
        const matchesSearch = o._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            o.user?.name?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const getStatusColor = (status) => {
        switch (status) {
            case 'Delivered': return 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400';
            case 'Processing': return 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400';
            case 'Pending': return 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400';
            case 'Cancelled': return 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400';
            case 'Returned': return 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400';
            default: return 'bg-gray-100 text-gray-600';
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-dark dark:text-white">Orders Management</h1>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row justify-between gap-4 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="flex items-center space-x-2 overflow-x-auto">
                    {['All', 'Pending', 'Processing', 'Delivered', 'Cancelled', 'Returned'].map(f => (
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
                    <input
                        placeholder="Search ID or Name..."
                        className="bg-transparent border-none focus:ring-0 text-sm w-40 text-dark dark:text-white"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
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
                                <th className="px-6 py-4">Return</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                            {filteredOrders.map((order) => (
                                <tr key={order._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                                    <td className="px-6 py-4 font-bold text-dark dark:text-white text-xs font-mono">#{order._id.slice(-6)}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                                        <div>{order.user?.name || 'Guest'}</div>
                                        <div className="text-xs text-gray-400">{order.user?.email}</div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500">{order.items.length}</td>
                                    <td className="px-6 py-4 text-sm font-bold text-dark dark:text-white">₹{order.totalAmount?.toLocaleString()}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(order.status)}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        {order.returnStatus && order.returnStatus !== 'None' && (
                                            <div className="flex flex-col">
                                                <span className="text-xs font-bold text-orange-500">{order.returnStatus}</span>
                                                {order.returnStatus === 'Requested' && (
                                                    <div className="flex space-x-1 mt-1">
                                                        <button onClick={() => handleReturnAction(order._id, 'Approved')} className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">Approve</button>
                                                        <button onClick={() => handleReturnAction(order._id, 'Rejected')} className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded">Reject</button>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end space-x-2">
                                            {/* Status Transitions */}
                                            {order.status === 'Pending' && (
                                                <button onClick={() => handleStatusChange(order._id, 'Processing')} className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg" title="Mark Processing">
                                                    <Package className="h-4 w-4" />
                                                </button>
                                            )}
                                            {order.status === 'Processing' && (
                                                <button onClick={() => handleStatusChange(order._id, 'Delivered')} className="p-2 text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg" title="Mark Delivered">
                                                    <Truck className="h-4 w-4" />
                                                </button>
                                            )}
                                            {(order.status === 'Pending' || order.status === 'Processing') && (
                                                <button onClick={() => handleStatusChange(order._id, 'Cancelled')} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg" title="Cancel Order">
                                                    <XCircle className="h-4 w-4" />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredOrders.length === 0 && (
                                <tr>
                                    <td colSpan="8" className="px-6 py-8 text-center text-gray-500">
                                        No orders found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminOrders;
