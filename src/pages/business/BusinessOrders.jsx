import { useState, useEffect } from 'react';
import { Package, Truck, CheckCircle, Search, Filter, Eye } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../api/axios';

const BusinessOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await api.get('/orders/business');
                setOrders(res.data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching orders", err);
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const [searchTerm, setSearchTerm] = useState('');

    const getStatusColor = (status) => {
        switch (status) {
            case 'Pending': return 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400';
            case 'Processing': return 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400';
            case 'Shipped': return 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400';
            case 'Delivered': return 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400';
            case 'Cancelled': return 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400';
            default: return 'bg-gray-100 text-gray-600';
        }
    };

    const handleStatusChange = async (id, newStatus) => {
        try {
            await api.put(`/orders/${id}/business-status`, { status: newStatus });
            setOrders(orders.map(o => o.id === id || o._id === id ? { ...o, status: newStatus } : o));
            toast.success('Order status updated');
        } catch (err) {
            console.error("Failed to update status", err);
            toast.error('Failed to update status');
        }
    };

    const printInvoice = (order) => {
        const printWindow = window.open('', '_blank');
        const invoiceContent = `
            <html>
                <head>
                    <title>Invoice #${order._id.slice(-6).toUpperCase()}</title>
                    <style>
                        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 40px; color: #333; }
                        .header { display: flex; justify-content: space-between; margin-bottom: 40px; border-bottom: 2px solid #eee; padding-bottom: 20px; }
                        .logo { font-size: 24px; font-weight: bold; color: #e11d48; }
                        .invoice-title { font-size: 32px; font-weight: bold; color: #111; text-align: right; }
                        .details { margin-bottom: 40px; display: flex; justify-content: space-between; }
                        .table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
                        .table th { background: #f9fafb; padding: 12px; text-align: left; font-weight: 600; border-bottom: 1px solid #eee; }
                        .table td { padding: 12px; border-bottom: 1px solid #eee; }
                        .total-section { text-align: right; margin-top: 20px; }
                        .total-row { display: flex; justify-content: flex-end; gap: 40px; margin-bottom: 10px; }
                        .total-label { font-weight: 600; }
                        .start-total { font-size: 18px; color: #111; font-weight: bold; }
                        .footer { margin-top: 60px; text-align: center; color: #888; font-size: 12px; border-top: 1px solid #eee; padding-top: 20px; }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <div>
                            <div class="logo">LocalLift</div>
                            <div style="margin-top:5px; font-size: 14px; color: #666;">
                                Support Local, Shop Global
                            </div>
                        </div>
                        <div>
                            <div class="invoice-title">INVOICE</div>
                            <div style="text-align: right; margin-top: 5px; color: #666;">#${order._id.slice(-6).toUpperCase()}</div>
                            <div style="text-align: right; margin-top: 5px; color: #666;">Date: ${new Date(order.createdAt).toLocaleDateString()}</div>
                        </div>
                    </div>

                    <div class="details">
                        <div>
                            <h3 style="font-size: 14px; text-transform: uppercase; color: #888; margin-bottom: 10px;">Billed To</h3>
                            <div style="font-weight: bold;">${order.user?.name || 'Customer'}</div>
                            <div>${order.user?.email || ''}</div>
                        </div>
                        <div style="text-align: right;">
                             <h3 style="font-size: 14px; text-transform: uppercase; color: #888; margin-bottom: 10px;">Payment</h3>
                             <div class="status" style="display:inline-block; padding: 5px 10px; border-radius: 4px; background: #ecfdf5; color: #047857; font-weight: bold; font-size: 12px;">PAID</div>
                        </div>
                    </div>

                    <table class="table">
                        <thead>
                            <tr>
                                <th>Item</th>
                                <th>Quantity</th>
                                <th>Price</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${order.items.map(item => `
                                <tr>
                                    <td>${item.product?.name || 'Product'}</td>
                                    <td>${item.quantity}</td>
                                    <td>₹${(item.price || 0).toFixed(2)}</td>
                                    <td>₹${((item.price || 0) * item.quantity).toFixed(2)}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>

                    <div class="total-section">
                        <div class="total-row">
                            <span class="total-label">Subtotal:</span>
                            <span>₹${(order.totalAmount + (order.discount || 0)).toFixed(2)}</span>
                        </div>
                        ${order.discount > 0 ? `
                        <div class="total-row" style="color: #e11d48;">
                            <span class="total-label">Discount:</span>
                            <span>- ₹${order.discount.toFixed(2)}</span>
                        </div>
                        ` : ''}
                        <div class="total-row start-total">
                            <span class="total-label">Total:</span>
                            <span>₹${order.totalAmount.toFixed(2)}</span>
                        </div>
                    </div>

                    <div class="footer">
                        <p>Thank you for your business!</p>
                        <p>For any questions, please contact support@locallift.com</p>
                    </div>
                </body>
            </html>
        `;
        printWindow.document.write(invoiceContent);
        printWindow.document.close();
        printWindow.print();
    };

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-dark dark:text-white">Orders Management</h1>

            {/* Controls */}
            <div className="flex items-center space-x-4 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                <Search className="h-5 w-5 text-gray-400" />
                <input
                    placeholder="Search orders..."
                    className="flex-1 bg-transparent border-none focus:ring-0 text-dark dark:text-white placeholder-gray-400"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button className="flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-gray-700 rounded-lg text-sm font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 transition">
                    <Filter className="h-4 w-4" /> Filter
                </button>
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
                            {orders.map((order) => (
                                <tr key={order._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                                    <td className="px-6 py-4 font-bold text-primary text-sm">#{order._id.slice(-6)}</td>
                                    <td className="px-6 py-4 text-sm font-medium text-dark dark:text-white">{order.user?.name || 'Customer'}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 text-sm text-center text-gray-500">{order.items.length}</td>
                                    <td className="px-6 py-4 text-sm font-bold text-dark dark:text-white">₹{order.totalAmount?.toFixed(2)}</td>
                                    <td className="px-6 py-4 flex gap-2 items-center">
                                        <select
                                            value={order.status}
                                            onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                            className={`text-xs font-bold px-2 py-1 rounded-full border-none outline-none cursor-pointer appearance-none ${getStatusColor(order.status)}`}
                                        >
                                            <option value="Pending">Pending</option>
                                            <option value="Processing">Processing</option>
                                            <option value="Shipped">Shipped</option>
                                            <option value="Delivered">Delivered</option>
                                            <option value="Cancelled">Cancelled</option>
                                        </select>
                                        <button
                                            onClick={() => printInvoice(order)}
                                            className="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200"
                                            title="Print Invoice"
                                        >
                                            Invoice
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => window.location.href = `/business/orders/${order._id}`}
                                            className="p-2 text-gray-400 hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
                                            title="View Details"
                                        >
                                            <Eye className="h-4 w-4" />
                                        </button>
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

export default BusinessOrders;
