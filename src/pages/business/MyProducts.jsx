import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import api from '../../api/axios';

const MyProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchMyProducts();
    }, []);

    const fetchMyProducts = async () => {
        try {
            const res = await api.get('/products/my-products');
            setProducts(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            // Fallback to empty if endpoint not ready or error
            setProducts([]);
            setLoading(false);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);

        const productData = {
            name: formData.get('name'),
            price: parseFloat(formData.get('price')),
            category: formData.get('category'),
            description: formData.get('description'),
            stock: parseInt(formData.get('stock')),
            images: ['/placeholder.svg'] // Mock image for now
        };

        try {
            if (editingProduct) {
                const res = await api.put(`/products/${editingProduct._id}`, productData);
                setProducts(products.map(p => p._id === editingProduct._id ? res.data : p));
            } else {
                const res = await api.post('/products', productData);
                setProducts([res.data, ...products]);
            }
            setIsModalOpen(false);
            setError('');
        } catch (err) {
            setError(err.response?.data?.message || 'Error saving product');
        }
    };

    const handleDelete = async (id) => {
        // Removed window.confirm to ensure delete works without browser blocking issues
        try {
            await api.delete(`/products/${id}`);
            setProducts(products.filter(p => p._id !== id));
        } catch (err) {
            console.error("Delete error:", err);
            alert(err.response?.data?.message || 'Error deleting product');
        }
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleEdit = (product) => {
        setEditingProduct(product);
        setIsModalOpen(true);
    };

    const handleAddNew = () => {
        setEditingProduct(null);
        setIsModalOpen(true);
    };

    if (loading) return <div className="p-8 text-center">Loading products...</div>;

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <h1 className="text-2xl font-bold text-dark dark:text-white">My Products</h1>
                <button
                    onClick={() => window.location.href = '/business/add-product'} // Using simple redirect or hook
                    className="flex items-center px-4 py-2 bg-primary text-white rounded-lg font-bold hover:bg-secondary transition shadow-lg"
                >
                    <Plus className="h-5 w-5 mr-2" /> Add Product
                </button>
            </div>

            {/* Search */}
            <div className="flex items-center space-x-4 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                <Search className="h-5 w-5 text-gray-400" />
                <input
                    placeholder="Search your products..."
                    className="flex-1 bg-transparent border-none focus:ring-0 text-dark dark:text-white placeholder-gray-400"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 text-xs uppercase font-bold">
                            <tr>
                                <th className="px-6 py-4">Product</th>
                                <th className="px-6 py-4">Category</th>
                                <th className="px-6 py-4">Price</th>
                                <th className="px-6 py-4">Stock</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                            {filteredProducts.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-8 text-center text-gray-500">No products found. Start selling!</td>
                                </tr>
                            ) : (
                                filteredProducts.map((product) => (
                                    <tr key={product._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                                                    <img src={product.images && product.images[0] ? product.images[0] : '/placeholder.svg'} alt="" className="w-full h-full object-cover rounded-md" />
                                                </div>
                                                <span className="font-bold text-dark dark:text-white text-sm">{product.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{product.category}</td>
                                        <td className="px-6 py-4 text-sm font-bold text-dark dark:text-white">₹{product.price}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500">{product.stock}</td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end space-x-2">
                                                <button onClick={() => handleEdit(product)} className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition">
                                                    <Edit className="h-4 w-4" />
                                                </button>
                                                <button onClick={() => handleDelete(product._id)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition">
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add/Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 w-full max-w-lg shadow-2xl animate-fade-in relative max-h-[90vh] overflow-y-auto">
                        <h2 className="text-xl font-bold text-dark dark:text-white mb-6">{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
                        {error && <div className="bg-red-100 text-red-600 p-3 rounded-lg mb-4 text-sm">{error}</div>}

                        <form onSubmit={handleSave} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">Product Name</label>
                                <input name="name" defaultValue={editingProduct?.name} required className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-dark dark:text-white focus:ring-2 focus:ring-primary outline-none" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">Description</label>
                                <textarea name="description" defaultValue={editingProduct?.description} required rows="3" className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-dark dark:text-white focus:ring-2 focus:ring-primary outline-none"></textarea>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1">Price (₹)</label>
                                    <input name="price" type="number" step="0.01" defaultValue={editingProduct?.price} required className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-dark dark:text-white focus:ring-2 focus:ring-primary outline-none" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1">Stock</label>
                                    <input name="stock" type="number" defaultValue={editingProduct?.stock || 0} required className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-dark dark:text-white focus:ring-2 focus:ring-primary outline-none" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">Category</label>
                                <select name="category" defaultValue={editingProduct?.category || 'Fashion'} className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-dark dark:text-white focus:ring-2 focus:ring-primary outline-none">
                                    {['Fashion', 'Electronics', 'Home & Living', 'Beauty', 'Sports', 'Toys'].map(c => (
                                        <option key={c} value={c}>{c}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex space-x-3 pt-4">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 font-bold text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl">Cancel</button>
                                <button type="submit" className="flex-1 py-3 bg-primary text-white font-bold rounded-xl hover:bg-secondary shadow-lg">Save Product</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyProducts;
