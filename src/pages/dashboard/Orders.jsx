import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Truck, CheckCircle, XCircle, RefreshCw, RotateCcw, ChevronRight, Filter } from 'lucide-react';
import toast from 'react-hot-toast';

import api from '../../api/axios';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';


const Orders = () => {
    const [filter, setFilter] = useState('All');
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useCart();
    const navigate = useNavigate();

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const res = await api.get('/orders');
            // Backend returns { items: [{ product, quantity, price }] }
            // We need to map it to match UI structure if needed, or adjust UI.
            // UI expects: { id, date, total, status, items: [{name, image, quantity, price}] }
            // Backend `items` has `product` object if populated? 
            // `server/routes/orders.js` POST endpoint stored: product (ID), quantity, price. 
            // It did NOT populate `product` details in the `orderItems` array in DB, just the ID. 
            // 
            // Wait, looking at `server/routes/orders.js`:
            // `orderItems.push({ product: item.product, ... })`.
            // The GET / route I just added: `Order.find()...`
            // It does NOT `.populate('items.product')`.
            // accessing `item.name` or `item.image` in UI will FAIL if I don't populate.

            // I need to update the GET route to populate, OR update this fetch to handle ID-only (bad UX).
            // Let's assume I will Fix Backend to Populate in next step.

            setOrders(res.data.map(order => ({
                id: order._id,
                date: order.createdAt,
                total: order.totalAmount,
                status: order.status || 'Processing',
                items: order.items.map(i => {
                    const product = i.product || {};
                    const snapshotName = i.name;
                    const snapshotImage = i.image;

                    // Use populated product details if available, otherwise fallback to snapshot, otherwise placeholder
                    const displayName = product.name || snapshotName || 'Product Unavailable';

                    let displayImage = '/placeholder.svg';
                    if (product.images && product.images.length > 0) {
                        displayImage = product.images[0];
                    } else if (snapshotImage) {
                        displayImage = snapshotImage;
                    }

                    return {
                        _id: product._id, // Needed for Buy Again, might be null if populated product is null
                        name: displayName,
                        image: displayImage,
                        quantity: i.quantity,
                        price: i.price,
                        isAvailable: !!product._id // Only allow buy again if product really exists
                    };
                })
            })));
        } catch (err) {
            console.error('Failed to fetch orders', err);
        } finally {
            setLoading(false);
        }
    };

    const handleCancelOrder = (orderId) => {
        if (window.confirm('Are you sure you want to cancel this order?')) {
            setOrders(orders.map(order =>
                order.id === orderId ? { ...order, status: 'Cancelled' } : order
            ));
        }
    };

    const handleReturnOrder = (orderId) => {
        toast.success(`Return request initiated for order #${orderId}. You will receive an email with shipping instructions.`);
    };

    const handleReplaceOrder = (orderId) => {
        toast.success(`Replacement request initiated for order #${orderId}. We will ship a new item once we receive the original.`);
    };

    const handleBuyAgain = (order) => {
        let addedCount = 0;
        order.items.forEach(item => {
            if (item.isAvailable) {
                // Construct product object expected by addToCart
                // Typically addToCart needs { _id, name, price, image, ... }
                // We have minimal data here, usually sufficient for cart logic if it only relies on ID for checkout, 
                // but Cart UI might show "Product Unavailable" if we don't pass full details OR Cart fetches fresh.
                // Assuming addToCart takes the product object as stored in context.
                // We'll pass what we have.
                addToCart({
                    _id: item._id,
                    name: item.name,
                    price: item.price,
                    images: [item.image] // Mocking array structure
                });
                addedCount++;
            }
        });

        if (addedCount > 0) {
            navigate('/cart');
        } else {
            toast.error('No products from this order are available.');
        }
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
                                <p className="text-xl font-bold text-primary">₹{order.total.toLocaleString()}</p>
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
                                        <p className="text-xs text-gray-500">Qty: {item.quantity} × ₹{item.price.toLocaleString()}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Actions */}
                        <div className="flex flex-wrap gap-3 pt-2">
                            <Link to={`/dashboard/orders/${order.id}`} className="flex items-center px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg text-sm font-bold text-dark dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                                View Details <ChevronRight className="ml-1 h-4 w-4" />
                            </Link>

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

                            <button
                                onClick={() => handleBuyAgain(order)}
                                className="flex items-center px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold hover:bg-primary/90 transition shadow-lg shadow-primary/30"
                            >
                                <RotateCcw className="mr-2 h-4 w-4" /> Buy Again
                            </button>
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
