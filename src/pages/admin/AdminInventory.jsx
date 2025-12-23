import { useState, useEffect } from 'react';
import { Search, Filter, AlertTriangle, CheckCircle, XCircle, Save, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../api/axios';

const AdminInventory = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('All'); // All, Low Stock, Out of Stock
    const [editingStock, setEditingStock] = useState({}); // { productId: newStockValue }

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const res = await api.get('/products');
            setProducts(res.data);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching inventory:", err);
            setLoading(false);
        }
    };

    const handleStockChange = (id, value) => {
        setEditingStock(prev => ({ ...prev, [id]: parseInt(value) || 0 }));
    };

    const handleUpdateStock = async (id) => {
        const newStock = editingStock[id];
        if (newStock === undefined) return;

        try {
            // Fetch current product to preserve other fields, or assume backend handles partial updates (it usually doesn't with simple PUT, so we need full object or specific PATCH)
            // My backend PUT /products/:id expects full object usually. 
            // Let's check products.js... It constructs a new object from req.body.
            // Risk: If I send only stock, other fields might be overwritten with nulls?
            // Safer: Find product from local state, update stock, send full object.

            const product = products.find(p => p._id === id);
            if (!product) return;

            const updatedProduct = { ...product, stock: newStock };
            // Note: We need to send clean data matching backend expectations. 
            // The backend extracts fields: name, description, etc.
            // If I send the whole mongoose object, it has extra fields like _id, __v, created_at.
            // Backend Controller:
            // const { name, description, price, category, brand, stock, images } = req.body;
            // It extracts specific fields. So safe to send existing + new stock.

            const payload = {
                name: product.name,
                description: product.description,
                price: product.price,
                category: product.category,
                brand: product.brand,
                stock: newStock,
                images: product.images
            };

            const res = await api.put(`/products/${id}`, payload);

            // Update local state
            setProducts(products.map(p => p._id === id ? res.data : p));

            // Clear editing state for this item
            const newEditing = { ...editingStock };
            delete newEditing[id];
            setEditingStock(newEditing);

            toast.success("Stock updated successfully");

        } catch (err) {
            console.error("Update failed", err);
            toast.error("Failed to update stock");
        }
    };

    const getStockStatus = (stock) => {
        if (stock === 0) return { label: 'Out of Stock', color: 'text-red-500 bg-red-100 dark:bg-red-900/20', icon: XCircle };
        if (stock < 10) return { label: 'Low Stock', color: 'text-orange-500 bg-orange-100 dark:bg-orange-900/20', icon: AlertTriangle };
        return { label: 'In Stock', color: 'text-green-500 bg-green-100 dark:bg-green-900/20', icon: CheckCircle };
    };

    const filteredProducts = products.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
        if (filter === 'All') return matchesSearch;
        if (filter === 'Low Stock') return matchesSearch && p.stock < 10 && p.stock > 0;
        if (filter === 'Out of Stock') return matchesSearch && p.stock === 0;
        return matchesSearch;
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <h1 className="text-2xl font-bold text-dark dark:text-white">Inventory Management</h1>
                <button
                    onClick={fetchProducts}
                    className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
                    title="Refresh"
                >
                    <RefreshCw className="h-5 w-5" />
                </button>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row justify-between gap-4 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="flex items-center space-x-2">
                    {['All', 'Low Stock', 'Out of Stock'].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-2 rounded-lg text-sm font-bold transition whitespace-nowrap ${filter === f ? 'bg-primary text-white' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
                <div className="flex items-center space-x-2 bg-gray-50 dark:bg-gray-700/50 p-2 rounded-lg w-full sm:w-auto">
                    <Search className="h-4 w-4 text-gray-400" />
                    <input
                        placeholder="Search products..."
                        className="bg-transparent border-none focus:ring-0 text-dark dark:text-white w-full sm:w-64"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Inventory Table */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 text-xs uppercase font-bold">
                            <tr>
                                <th className="px-6 py-4">Product</th>
                                <th className="px-6 py-4">Category</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Current Stock</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                            {filteredProducts.map((product) => {
                                const status = getStockStatus(product.stock);
                                const StatusIcon = status.icon;
                                const isEditing = editingStock[product._id] !== undefined;
                                const displayStock = isEditing ? editingStock[product._id] : product.stock;

                                return (
                                    <tr key={product._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                                        <td className="px-6 py-4 font-bold text-dark dark:text-white text-sm">{product.name}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{product.category}</td>
                                        <td className="px-6 py-4">
                                            <div className={`flex items-center px-3 py-1 rounded-full text-xs font-bold w-fit ${status.color}`}>
                                                <StatusIcon className="h-3 w-3 mr-1" />
                                                {status.label}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-2">
                                                <input
                                                    type="number"
                                                    min="0"
                                                    value={displayStock}
                                                    onChange={(e) => handleStockChange(product._id, e.target.value)}
                                                    className={`w-20 p-2 rounded-lg border text-sm text-center font-bold focus:ring-2 focus:ring-primary outline-none ${isEditing ? 'border-primary bg-white dark:bg-gray-900 text-dark dark:text-white' : 'border-transparent bg-transparent text-dark dark:text-white'}`}
                                                />
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {isEditing && (
                                                <button
                                                    onClick={() => handleUpdateStock(product._id)}
                                                    className="inline-flex items-center px-3 py-1.5 bg-primary text-white text-xs font-bold rounded-lg hover:bg-secondary transition"
                                                >
                                                    <Save className="h-3 w-3 mr-1" /> Update
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                            {filteredProducts.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                                        No item found in inventory.
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

export default AdminInventory;
