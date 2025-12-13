import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, Package, MapPin, CreditCard } from 'lucide-react';
import { useState, useEffect } from 'react';
import api from '../../api/axios';

const OrderDetails = () => {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [showReturnModal, setShowReturnModal] = useState(false);
    const [reason, setReason] = useState('');

    useEffect(() => {
        fetchOrder();
    }, [id]);

    const fetchOrder = async () => {
        try {
            // Optimistic approach: try specific route if exists, else fetch all
            // For now assuming we fetch all as per previous logic, but ideally we should have GET /api/orders/:id
            // Let's stick to existing logic but refactor to function for re-use
            const res = await api.get('/orders');
            const found = res.data.find(o => o._id === id);
            setOrder(found);
        } catch (err) {
            console.error("Error fetching order", err);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async () => {
        if (!reason) return alert('Please provide a reason');
        try {
            await api.put(`/orders/${order._id}/cancel`, { reason });
            alert('Order Cancelled');
            setShowCancelModal(false);
            setReason('');
            fetchOrder(); // Refresh data
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to cancel order');
        }
    };

    const handleReturn = async () => {
        if (!reason) return alert('Please provide a reason');
        try {
            await api.post(`/orders/${order._id}/return`, { reason });
            alert('Return Requested Successfully');
            setShowReturnModal(false);
            setReason('');
            fetchOrder();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to request return');
        }
    };

    const handlePrintInvoice = () => {
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <html>
                <head>
                    <title>Invoice #${order._id}</title>
                    <style>
                        body { font-family: sans-serif; padding: 20px; }
                        h1 { color: #333; }
                        .header { display: flex; justify-content: space-between; margin-bottom: 20px; border-bottom: 1px solid #ddd; padding-bottom: 10px; }
                        .table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                        th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
                        th { background: #f4f4f4; }
                        .total { margin-top: 20px; text-align: right; font-size: 1.2em; font-weight: bold; }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <div>
                            <h1>LocalLift</h1>
                            <p>Invoice for Order #${order._id}</p>
                            <p>Date: ${new Date(order.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div style="text-align: right;">
                            <p><strong>Billed To:</strong></p>
                            <p>${order.address?.fullName || 'Customer'}</p>
                            <p>${order.address?.street || ''}</p>
                        </div>
                    </div>
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Item</th>
                                <th>Qty</th>
                                <th>Price</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${order.items.map(item => `
                                <tr>
                                    <td>${typeof item.product === 'object' ? (item.product.name || 'Product') : 'Product'}</td>
                                    <td>${item.quantity}</td>
                                    <td>₹${item.price}</td>
                                    <td>₹${item.price * item.quantity}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                    <div class="total">
                        Total Amount: ₹${order.totalAmount}
                    </div>
                </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.print();
    };

    if (loading) return <div className="p-8 text-center"><div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div></div>;
    if (!order) return <div className="p-8 text-center">Order not found</div>;

    const steps = ['Pending', 'Processing', 'Shipped', 'Delivered'];
    const currentStep = steps.indexOf(order.status) !== -1 ? steps.indexOf(order.status) : (order.status === 'Cancelled' ? -1 : 0);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <Link to="/dashboard/orders" className="flex items-center text-sm text-gray-500 hover:text-primary transition">
                    <ChevronLeft className="w-4 h-4 mr-1" /> Back to Orders
                </Link>
                <div className="flex gap-2">
                    <button onClick={handlePrintInvoice} className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600">
                        📄 Invoice
                    </button>
                    {order.status !== 'Cancelled' && order.status !== 'Delivered' && order.status !== 'Shipped' && (
                        <button onClick={() => setShowCancelModal(true)} className="px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100">
                            Cancel Order
                        </button>
                    )}
                    {order.status === 'Delivered' && order.returnStatus === 'None' && (
                        <button onClick={() => setShowReturnModal(true)} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200">
                            Return Items
                        </button>
                    )}
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="flex justify-between items-start mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-dark dark:text-white">Order #{order._id.slice(-6).toUpperCase()}</h1>
                        <p className="text-gray-500 text-sm">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <span className={`px-4 py-1.5 rounded-full text-sm font-bold ${order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                            order.status === 'Cancelled' ? 'bg-red-100 text-red-700' :
                                'bg-blue-100 text-blue-700'
                        }`}>
                        {order.status}
                    </span>
                </div>

                {/* Timeline */}
                <div className="mb-10 relative">
                    {order.status === 'Cancelled' ? (
                        <div className="p-4 bg-red-50 text-red-700 rounded-xl mb-6">
                            <strong>Order Cancelled</strong>: {order.cancelReason}
                        </div>
                    ) : (
                        <div className="flex items-center justify-between w-full">
                            {steps.map((step, i) => (
                                <div key={step} className="flex flex-col items-center flex-1 relative z-10">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${i <= currentStep ? 'bg-green-500 border-green-500 text-white' : 'bg-white border-gray-200 text-gray-300'
                                        }`}>
                                        {i <= currentStep && <div className="w-2.5 h-2.5 bg-white rounded-full" />}
                                    </div>
                                    <p className={`text-xs mt-2 font-medium ${i <= currentStep ? 'text-green-600' : 'text-gray-400'}`}>{step}</p>

                                    {/* Line connecting steps */}
                                    {i < steps.length - 1 && (
                                        <div className={`absolute top-4 left-1/2 w-full h-0.5 -z-10 ${i < currentStep ? 'bg-green-500' : 'bg-gray-200'
                                            }`} />
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                    {order.returnStatus !== 'None' && (
                        <div className="mt-6 p-4 bg-yellow-50 text-yellow-800 rounded-xl">
                            <strong>Return Status:</strong> {order.returnStatus}
                            {order.returnReason && <p className="text-sm mt-1">Reason: {order.returnReason}</p>}
                        </div>
                    )}
                </div>

                <div className="grid md:grid-cols-2 gap-8 mb-8">
                    <div>
                        <h3 className="font-bold text-dark dark:text-white mb-4 flex items-center">
                            <MapPin className="w-5 h-5 mr-2 text-primary" /> Delivery Address
                        </h3>
                        <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-2xl text-sm text-gray-600 dark:text-gray-300">
                            {order.address ? (
                                <>
                                    <p className="font-bold text-dark dark:text-white">{order.address.fullName}</p>
                                    <p>{order.address.street}</p>
                                    <p>{order.address.city}, {order.address.state} {order.address.zipCode}</p>
                                    <p>Phone: {order.address.mobile}</p>
                                </>
                            ) : (
                                <p>Address details not available</p>
                            )}
                        </div>
                    </div>
                    <div>
                        <h3 className="font-bold text-dark dark:text-white mb-4 flex items-center">
                            <CreditCard className="w-5 h-5 mr-2 text-primary" /> Payment Info
                        </h3>
                        <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-2xl text-sm text-gray-600 dark:text-gray-300">
                            <p>Method: {order.paymentMethod || order.paymentInfo?.method || 'Online'}</p>
                            <p>Status: <span className="text-green-500 font-bold">Paid</span></p>
                            <p className="text-xs text-gray-400 mt-1">ID: {order.paymentInfo?.id || order._id}</p>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-100 dark:border-gray-700 pt-6">
                    <h3 className="font-bold text-dark dark:text-white mb-6 flex items-center">
                        <Package className="w-5 h-5 mr-2 text-primary" /> Items
                    </h3>
                    <div className="space-y-4">
                        {order.items.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 bg-gray-50 dark:bg-gray-700 rounded-lg p-2">
                                        <img src={item.image || (typeof item.product === 'object' ? item.product.images?.[0] : '') || '/placeholder.svg'} alt="Product" className="w-full h-full object-contain" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-dark dark:text-white">
                                            {typeof item.product === 'object' ? (item.product.name || 'Product Details Unavailable') : `Product ID: ${item.product}`}
                                        </p>
                                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                    </div>
                                </div>
                                <p className="font-bold text-dark dark:text-white">₹{item.price.toLocaleString()}</p>
                            </div>
                        ))}
                    </div>
                    <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700 flex justify-end">
                        <div className="text-right">
                            <p className="text-gray-500 mb-1">Total Amount</p>
                            <p className="text-2xl font-bold text-primary">₹{order.totalAmount.toLocaleString()}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Cancel Modal */}
            {showCancelModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md shadow-2xl">
                        <h3 className="text-xl font-bold mb-4 text-dark dark:text-white">Cancel Order</h3>
                        <p className="text-gray-500 mb-4 text-sm">Are you sure you want to cancel this order? This action cannot be undone.</p>
                        <textarea
                            className="w-full border rounded-lg p-3 mb-4 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            placeholder="Reason for cancellation..."
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                        />
                        <div className="flex justify-end gap-3">
                            <button onClick={() => setShowCancelModal(false)} className="px-4 py-2 text-gray-500 hover:bg-gray-100 rounded-lg">Keep Order</button>
                            <button onClick={handleCancel} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Confirm Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Return Modal */}
            {showReturnModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md shadow-2xl">
                        <h3 className="text-xl font-bold mb-4 text-dark dark:text-white">Request Return</h3>
                        <p className="text-gray-500 mb-4 text-sm">Please provide a reason for returning the items.</p>
                        <select
                            className="w-full border rounded-lg p-3 mb-4 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                        >
                            <option value="">Select a reason</option>
                            <option value="Damaged Product">Damaged Product</option>
                            <option value="Wrong Item Received">Wrong Item Received</option>
                            <option value="Quality Issue">Quality Issue</option>
                            <option value="Ordered by Mistake">Ordered by Mistake</option>
                            <option value="Other">Other</option>
                        </select>
                        <div className="flex justify-end gap-3">
                            <button onClick={() => setShowReturnModal(false)} className="px-4 py-2 text-gray-500 hover:bg-gray-100 rounded-lg">Cancel</button>
                            <button onClick={handleReturn} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Submit Request</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderDetails;
