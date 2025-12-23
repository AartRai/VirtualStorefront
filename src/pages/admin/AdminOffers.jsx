import { useState, useEffect } from 'react';
import { Tag, Plus, Trash2, Copy, Loader, Calendar, Edit, CheckCircle, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../api/axios';

const AdminOffers = () => {
    const [offers, setOffers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Form State
    const [editingOffer, setEditingOffer] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        code: '',
        discountType: 'PERCENTAGE',
        discountValue: '',
        startDate: '',
        expiryDate: '',
        minOrderValue: 0,
        applicableType: 'ALL',
        applicableTo: []
    });

    // Data for selectors
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        fetchOffers();
        fetchMetadata();
    }, []);

    const fetchOffers = async () => {
        try {
            const res = await api.get('/offers');
            setOffers(res.data);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching offers:", err);
            setLoading(false);
        }
    };

    const fetchMetadata = async () => {
        try {
            const [prodRes, catRes] = await Promise.all([
                api.get('/products'), // Assuming this exists for admin
                api.get('/categories')
            ]);
            setProducts(prodRes.data);
            setCategories(catRes.data);
        } catch (err) {
            console.error("Error fetching metadata:", err);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this offer?')) return;
        try {
            await api.delete(`/offers/${id}`);
            setOffers(offers.filter(o => o._id !== id));
        } catch (err) {
            console.error("Delete failed", err);
            toast.error("Failed to delete offer");
        }
    };

    const handleToggleStatus = async (offer) => {
        const newStatus = offer.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
        try {
            const res = await api.put(`/offers/${offer._id}`, { status: newStatus });
            setOffers(offers.map(o => o._id === offer._id ? res.data : o));
        } catch (err) {
            console.error("Status update failed", err);
        }
    };

    const openModal = (offer = null) => {
        if (offer) {
            setEditingOffer(offer);
            setFormData({
                name: offer.name,
                code: offer.code,
                discountType: offer.discountType,
                discountValue: offer.discountValue,
                startDate: offer.startDate ? new Date(offer.startDate).toISOString().split('T')[0] : '',
                expiryDate: offer.expiryDate ? new Date(offer.expiryDate).toISOString().split('T')[0] : '',
                minOrderValue: offer.minOrderValue,
                applicableType: offer.applicableType,
                applicableTo: offer.applicableTo || [] // Assuming ID strings
            });
        } else {
            setEditingOffer(null);
            setFormData({
                name: '',
                code: '',
                discountType: 'PERCENTAGE',
                discountValue: '',
                startDate: new Date().toISOString().split('T')[0],
                expiryDate: '',
                minOrderValue: 0,
                applicableType: 'ALL',
                applicableTo: []
            });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingOffer) {
                const res = await api.put(`/offers/${editingOffer._id}`, formData);
                setOffers(offers.map(o => o._id === editingOffer._id ? res.data : o));
            } else {
                const res = await api.post('/offers', formData);
                setOffers([res.data, ...offers]);
            }
            setIsModalOpen(false);
        } catch (err) {
            console.error("Submit failed", err);
            toast.error(err.response?.data?.message || "Operation failed");
        }
    };

    const isExpired = (dateString) => {
        return new Date(dateString) < new Date();
    };

    const getStatus = (offer) => {
        if (offer.status === 'INACTIVE') return 'Inactive';
        if (isExpired(offer.expiryDate)) return 'Expired';
        if (new Date(offer.startDate) > new Date()) return 'Scheduled';
        return 'Active';
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
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-dark dark:text-white">Offers & Coupons</h1>
                <button
                    onClick={() => openModal()}
                    className="flex items-center px-4 py-2 bg-primary text-white rounded-lg font-bold hover:bg-secondary transition shadow-lg"
                >
                    <Plus className="h-5 w-5 mr-2" /> Create Offer
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {offers.map((offer) => {
                    const statusText = getStatus(offer);
                    const isGray = statusText === 'Expired' || statusText === 'Inactive';
                    const statusColor =
                        statusText === 'Active' ? 'bg-green-100 text-green-600' :
                            statusText === 'Scheduled' ? 'bg-blue-100 text-blue-600' :
                                'bg-gray-100 text-gray-500';

                    return (
                        <div key={offer._id} className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 relative overflow-hidden group hover:shadow-md transition">
                            <div className="flex items-start justify-between mb-4 relative z-10">
                                <div className={`p-3 rounded-xl ${!isGray ? 'bg-green-100 text-green-600 dark:bg-green-900/30' : 'bg-gray-100 text-gray-400'} `}>
                                    <Tag className="h-6 w-6" />
                                </div>
                                <div className="flex space-x-2">
                                    <button onClick={() => handleToggleStatus(offer)} className={`p-1 rounded-full ${offer.status === 'ACTIVE' ? 'text-green-500 hover:bg-green-50' : 'text-gray-400 hover:bg-gray-100'}`} title="Toggle Status">
                                        {offer.status === 'ACTIVE' ? <CheckCircle className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
                                    </button>
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusColor} flex items-center`}>
                                        {statusText}
                                    </span>
                                </div>
                            </div>

                            <div className="relative z-10">
                                <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">{offer.name}</h4>
                                <h3 className="text-2xl font-bold text-dark dark:text-white mb-1 flex items-center">
                                    {offer.code}
                                    <button onClick={() => { navigator.clipboard.writeText(offer.code); toast.success('Code copied!') }} className="ml-2 text-gray-400 hover:text-primary transition p-1">
                                        <Copy className="h-4 w-4" />
                                    </button>
                                </h3>
                                <p className="text-primary font-bold text-lg mb-1">
                                    {offer.discountType === 'PERCENTAGE' ? `${offer.discountValue}% OFF` : `₹${offer.discountValue} OFF`}
                                </p>
                                <p className="text-xs text-gray-500 mb-2">Min Order: ₹{offer.minOrderValue}</p>
                                <p className="text-xs text-gray-500 mb-4">
                                    Valid: {new Date(offer.startDate).toLocaleDateString()} - {new Date(offer.expiryDate).toLocaleDateString()}
                                </p>

                                <div className="flex items-center justify-end space-x-2 text-sm text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-gray-700 pt-4">
                                    <button onClick={() => openModal(offer)} className="text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 p-2 rounded-lg transition">
                                        <Edit className="h-4 w-4" />
                                    </button>
                                    <button onClick={() => handleDelete(offer._id)} className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded-lg transition">
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 w-full max-w-lg shadow-2xl animate-fade-in my-8">
                        <h2 className="text-xl font-bold text-dark dark:text-white mb-6">{editingOffer ? 'Edit Offer' : 'Create New Offer'}</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">Offer Name</label>
                                <input
                                    value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required placeholder="e.g. Summer Sale"
                                    className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-dark dark:text-white focus:ring-2 focus:ring-primary outline-none"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1">Coupon Code</label>
                                    <input
                                        value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                                        required placeholder="SUMMER50"
                                        className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-dark dark:text-white focus:ring-2 focus:ring-primary outline-none uppercase"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1">Min Order (₹)</label>
                                    <input
                                        type="number" value={formData.minOrderValue} onChange={(e) => setFormData({ ...formData, minOrderValue: e.target.value })}
                                        className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-dark dark:text-white focus:ring-2 focus:ring-primary outline-none"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1">Discount Type</label>
                                    <select
                                        value={formData.discountType} onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                                        className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-dark dark:text-white focus:ring-2 focus:ring-primary outline-none"
                                    >
                                        <option value="PERCENTAGE">Percentage (%)</option>
                                        <option value="FIXED">Fixed Amount (₹)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1">Discount Value</label>
                                    <input
                                        type="number" value={formData.discountValue} onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                                        required placeholder="50"
                                        className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-dark dark:text-white focus:ring-2 focus:ring-primary outline-none"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1">Start Date</label>
                                    <input
                                        type="date" value={formData.startDate} onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                        required
                                        className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-dark dark:text-white focus:ring-2 focus:ring-primary outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1">End Date</label>
                                    <input
                                        type="date" value={formData.expiryDate} onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                                        required
                                        className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-dark dark:text-white focus:ring-2 focus:ring-primary outline-none"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">Applicable To</label>
                                <select
                                    value={formData.applicableType} onChange={(e) => setFormData({ ...formData, applicableType: e.target.value, applicableTo: [] })}
                                    className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-dark dark:text-white focus:ring-2 focus:ring-primary outline-none mb-2"
                                >
                                    <option value="ALL">All Products</option>
                                    <option value="CATEGORY">Specific Categories</option>
                                    <option value="PRODUCT">Specific Products</option>
                                </select>

                                {formData.applicableType !== 'ALL' && (
                                    <div className="max-h-40 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-xl p-2 bg-gray-50 dark:bg-gray-900">
                                        {formData.applicableType === 'CATEGORY' ? (
                                            categories.map(cat => (
                                                <label key={cat._id} className="flex items-center space-x-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={formData.applicableTo.includes(cat._id)}
                                                        onChange={(e) => {
                                                            const newSelection = e.target.checked
                                                                ? [...formData.applicableTo, cat._id]
                                                                : formData.applicableTo.filter(id => id !== cat._id);
                                                            setFormData({ ...formData, applicableTo: newSelection });
                                                        }}
                                                        className="rounded text-primary focus:ring-primary"
                                                    />
                                                    <span className="text-sm text-dark dark:text-white">{cat.name}</span>
                                                </label>
                                            ))
                                        ) : (
                                            products.map(prod => (
                                                <label key={prod._id} className="flex items-center space-x-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={formData.applicableTo.includes(prod._id)}
                                                        onChange={(e) => {
                                                            const newSelection = e.target.checked
                                                                ? [...formData.applicableTo, prod._id]
                                                                : formData.applicableTo.filter(id => id !== prod._id);
                                                            setFormData({ ...formData, applicableTo: newSelection });
                                                        }}
                                                        className="rounded text-primary focus:ring-primary"
                                                    />
                                                    <span className="text-sm text-dark dark:text-white truncate">{prod.name}</span>
                                                </label>
                                            ))
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="flex space-x-3 pt-4">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 font-bold text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl">Cancel</button>
                                <button type="submit" className="flex-1 py-3 bg-primary text-white font-bold rounded-xl hover:bg-secondary shadow-lg">
                                    {editingOffer ? 'Update Offer' : 'Create Offer'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminOffers;
