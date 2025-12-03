import { useState } from 'react';
import { Package, Truck, CheckCircle, XCircle, RefreshCw, RotateCcw, ChevronRight, Filter } from 'lucide-react';

const Orders = () => {
    const [filter, setFilter] = useState('All');

    // Mock Orders Data
    const [orders, setOrders] = useState([
        {
            id: 'ORD-7782-34',
            date: '2025-12-01',
            total: 129.99,
            status: 'Processing',
            items: [
                { name: 'Wireless Headphones', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200', quantity: 1, price: 129.99 }
            ]
        },
        {
            id: 'ORD-9921-12',
            date: '2025-11-25',
            total: 54.50,
            status: 'Delivered',
            items: [
                { name: 'Organic Coffee Beans', image: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=200', quantity: 2, price: 27.25 }
            ]
        },
        {
            id: 'ORD-1102-55',
            date: '2025-11-10',
            total: 210.00,
            status: 'Cancelled',
            items: [
                { name: 'Smart Watch Series 5', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200', quantity: 1, price: 210.00 }
            ]
        }
    ]);

    const handleCancelOrder = (orderId) => {
        if (window.confirm('Are you sure you want to cancel this order?')) {
            setOrders(orders.map(order =>
                order.id === orderId ? { ...order, status: 'Cancelled' } : order
            ));
        }
    };

    const handleReturnOrder = (orderId) => {
        alert(`Return request initiated for order #${orderId}. You will receive an email with shipping instructions.`);
    };

    const handleReplaceOrder = (orderId) => {
        alert(`Replacement request initiated for order #${orderId}. We will ship a new item once we receive the original.`);
    };

    const filteredOrders = filter === 'All' ? orders : orders.filter(o => o.status === filter);

    const getStatusColor = (status) => {
        switch (status) {
            case 'Delivered': return 'text-green-500 bg-green-50 dark:bg-green-900/20';
            case 'Processing': return 'text-blue-500 bg-blue-50 dark:bg-blue-900/20';
            case 'Cancelled': return 'text-red-500 bg-red-50 dark:bg-red-900/20';
            default: return 'text-gray-500 bg-gray-50';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h1 className="text-2xl font-bold text-dark dark:text-white">My Orders</h1>

                {/* Filter */}
                <div className="flex items-center space-x-2 bg-white dark:bg-gray-800 p-1 rounded-lg border border-gray-200 dark:border-gray-700">
                    {['All', 'Processing', 'Delivered', 'Cancelled'].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-3 py-1.5 rounded-md text-sm font-medium transition ${filter === f ? 'bg-primary text-white shadow-sm' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            <div className="space-y-4">
                {filteredOrders.map((order) => (
                    <div key={order.id} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                        <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 pb-4 border-b border-gray-100 dark:border-gray-700">
                            <div className="space-y-1">
                                <div className="flex items-center gap-3">
                                    <span className="font-bold text-lg text-dark dark:text-white">#{order.id}</span>
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(order.status)}`}>
                                        {order.status}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-500">Placed on {new Date(order.date).toLocaleDateString()}</p>
                            </div>
                            <div className="mt-4 md:mt-0 text-right">
                                <p className="text-sm text-gray-500">Total Amount</p>
                                <p className="text-xl font-bold text-primary">${order.total.toFixed(2)}</p>
                            </div>
                        </div>

                        <div className="space-y-4 mb-6">
                            {order.items.map((item, index) => (
                                <div key={index} className="flex items-center gap-4">
                                    <div className="w-16 h-16 bg-gray-50 dark:bg-gray-700 rounded-lg p-2">
                                        <img src={item.image} alt={item.name} className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-dark dark:text-white text-sm">{item.name}</h4>
                                        <p className="text-xs text-gray-500">Qty: {item.quantity} × ${item.price}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Actions */}
                        <div className="flex flex-wrap gap-3 pt-2">
                            <button className="flex items-center px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg text-sm font-bold text-dark dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                                View Details <ChevronRight className="ml-1 h-4 w-4" />
                            </button>

                            {order.status === 'Processing' && (
                                <button
                                    onClick={() => handleCancelOrder(order.id)}
                                    className="flex items-center px-4 py-2 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 rounded-lg text-sm font-bold hover:bg-red-50 dark:hover:bg-red-900/20 transition"
                                >
                                    <XCircle className="mr-2 h-4 w-4" /> Cancel Order
                                </button>
                            )}

                            {order.status === 'Delivered' && (
                                <>
                                    <button
                                        onClick={() => handleReturnOrder(order.id)}
                                        className="flex items-center px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg text-sm font-bold text-dark dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                                    >
                                        <RotateCcw className="mr-2 h-4 w-4" /> Return
                                    </button>
                                    <button
                                        onClick={() => handleReplaceOrder(order.id)}
                                        className="flex items-center px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg text-sm font-bold text-dark dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                                    >
                                        <RefreshCw className="mr-2 h-4 w-4" /> Replace
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                ))}

                {filteredOrders.length === 0 && (
                    <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700">
                        <Package className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500">No orders found in this category.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Orders;
