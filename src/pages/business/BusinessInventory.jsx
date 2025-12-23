import { useState, useEffect } from 'react';
import { Search, AlertTriangle, Layers, Edit, History, Save, X } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../api/axios';

const BusinessInventory = () => {
    const [products, setProducts] = useState([]);
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [stockChange, setStockChange] = useState(0);
    const [changeReason, setChangeReason] = useState('Manual Update');
    const [showLogModal, setShowLogModal] = useState(false);

    useEffect(() => {
        fetchInventory();
    }, []);

    const fetchInventory = async () => {
        try {
            const res = await api.get('/business/inventory');
            setProducts(res.data.products);
            setLogs(res.data.logs);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const handleStockUpdate = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/business/inventory/log', {
                productId: selectedProduct._id,
                change: Number(stockChange),
                reason: changeReason
            });

            // Update local state
            setProducts(products.map(p => p._id === selectedProduct._id ? res.data.product : p));
            setLogs([res.data.log, ...logs]);
            setSelectedProduct(null);
            setStockChange(0);
            toast.success("Stock updated successfully");
        } catch (err) {
            toast.error("Failed to update stock");
        }
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.sku && p.sku.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (loading) return <div className="p-8 text-center">Loading inventory...</div>;

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                    <Layers className="h-6 w-6 text-primary" /> Inventory Management
                </h1>
                <button onClick={() => setShowLogModal(true)} className="flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition">
                    <History className="h-4 w-4 mr-2" /> View Logs
                </button>
            </div>

            {/* Search */}
            <div className="flex items-center space-x-4 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                <Search className="h-5 w-5 text-gray-400" />
                <input
                    placeholder="Search by Product Name or SKU..."
                    className="flex-1 bg-transparent border-none focus:ring-0 text-gray-800 dark:text-white placeholder-gray-400"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 text-xs uppercase font-bold">
                        <tr>
                            <th className="px-6 py-4">Product</th>
                            <th className="px-6 py-4">SKU</th>
                            <th className="px-6 py-4">Current Stock</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                        {filteredProducts.map(product => {
                            const isLowStock = product.stock <= (product.lowStockThreshold || 5);
                            return (
                                <tr key={product._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-gray-100 rounded-lg overflow-hidden">
                                                <img src={product.images[0] || '/placeholder.svg'} alt="" className="w-full h-full object-cover" />
                                            </div>
                                            <span className="font-bold text-gray-800 dark:text-white">{product.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 font-mono">{product.sku || '-'}</td>
                                    <td className="px-6 py-4 font-bold text-gray-800 dark:text-white">{product.stock}</td>
                                    <td className="px-6 py-4">
                                        {product.stock === 0 ? (
                                            <span className="px-2 py-1 bg-red-100 text-red-600 rounded-full text-xs font-bold">Out of Stock</span>
                                        ) : isLowStock ? (
                                            <span className="px-2 py-1 bg-yellow-100 text-yellow-600 rounded-full text-xs font-bold flex items-center w-fit gap-1">
                                                <AlertTriangle className="h-3 w-3" /> Low Stock
                                            </span>
                                        ) : (
                                            <span className="px-2 py-1 bg-green-100 text-green-600 rounded-full text-xs font-bold">In Stock</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button onClick={() => setSelectedProduct(product)} className="text-blue-500 hover:bg-blue-50 p-2 rounded-lg">
                                            <Edit className="h-4 w-4" />
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Update Stock Modal */}
            {selectedProduct && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
                        <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-white">Update Stock: {selectedProduct.name}</h3>
                        <form onSubmit={handleStockUpdate} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">Stock Change (+/-)</label>
                                <input
                                    type="number"
                                    value={stockChange}
                                    onChange={(e) => setStockChange(e.target.value)}
                                    className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    placeholder="e.g. 10 or -5"
                                    required
                                />
                                <p className="text-xs text-gray-400 mt-1">Current: {selectedProduct.stock} | New: {selectedProduct.stock + Number(stockChange)}</p>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">Reason</label>
                                <select
                                    value={changeReason}
                                    onChange={(e) => setChangeReason(e.target.value)}
                                    className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                >
                                    <option>Manual Update</option>
                                    <option>Restock</option>
                                    <option>Damaged/Lost</option>
                                    <option>Correction</option>
                                </select>
                            </div>
                            <div className="flex gap-2 pt-2">
                                <button type="button" onClick={() => setSelectedProduct(null)} className="flex-1 py-2 text-gray-500 hover:bg-gray-100 rounded-lg">Cancel</button>
                                <button type="submit" className="flex-1 py-2 bg-primary text-white rounded-lg hover:bg-secondary">Update</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Logs Modal */}
            {showLogModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-2xl shadow-2xl h-[80vh] flex flex-col">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-gray-800 dark:text-white">Inventory Logs</h3>
                            <button onClick={() => setShowLogModal(false)}><X className="h-5 w-5 text-gray-500" /></button>
                        </div>
                        <div className="flex-1 overflow-y-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-300 sticky top-0">
                                    <tr>
                                        <th className="p-3">Date</th>
                                        <th className="p-3">Product</th>
                                        <th className="p-3">Change</th>
                                        <th className="p-3">Reason</th>
                                        <th className="p-3">New Stock</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                    {logs.map(log => (
                                        <tr key={log._id}>
                                            <td className="p-3 text-gray-500">{new Date(log.date).toLocaleString()}</td>
                                            <td className="p-3 font-medium text-gray-800 dark:text-white">{log.product?.name || 'Unknown'}</td>
                                            <td className={`p-3 font-bold ${log.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                {log.change > 0 ? '+' : ''}{log.change}
                                            </td>
                                            <td className="p-3 text-gray-600 dark:text-gray-400">{log.reason}</td>
                                            <td className="p-3 text-gray-800 dark:text-white">{log.newStock}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BusinessInventory;
