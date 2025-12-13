import { useState, useEffect } from 'react';
import { Tag, Plus, Trash2, Copy, Loader, Calendar } from 'lucide-react';
import api from '../../api/axios';

const AdminOffers = () => {
    const [offers, setOffers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchOffers();
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

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this offer?')) return;
        try {
            await api.delete(`/offers/${id}`);
            setOffers(offers.filter(o => o._id !== id));
        } catch (err) {
            console.error("Delete failed", err);
            alert("Failed to delete offer");
        }
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);

        const payload = {
            code: formData.get('code').toUpperCase(),
            discountValue: parseFloat(formData.get('discountValue')),
            discountType: formData.get('discountType'), // PERCENTAGE or FIXED
            expiryDate: formData.get('expiryDate'),
            minOrderValue: parseFloat(formData.get('minOrderValue')) || 0
        };

        try {
            const res = await api.post('/offers', payload);
            setOffers([res.data, ...offers]);
            setIsModalOpen(false);
        } catch (err) {
            console.error("Add failed", err);
            alert(err.response?.data?.message || "Failed to create offer");
        }
    };

    const isExpired = (dateString) => {
        return new Date(dateString) < new Date();
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
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center px-4 py-2 bg-primary text-white rounded-lg font-bold hover:bg-secondary transition shadow-lg"
                >
                    <Plus className="h-5 w-5 mr-2" /> Create Offer
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {offers.map((offer) => {
                    const expired = isExpired(offer.expiryDate);
                    const status = expired ? 'Expired' : (offer.status || 'Active');
                    const statusColor = expired ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400';

                    return (
                        <div key={offer._id} className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 relative overflow-hidden group hover:shadow-md transition">
                            <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${!expired ? 'from-green-400/20 to-green-600/20' : 'from-gray-400/20 to-gray-600/20'} rounded-bl-[4rem] -mr-4 -mt-4`}></div>

                            <div className="flex items-start justify-between mb-4 relative z-10">
                                <div className={`p-3 rounded-xl ${!expired ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-500'} `}>
                                    <Tag className="h-6 w-6" />
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusColor}`}>
                                    {status}
                                </span>
                            </div>

                            <div className="relative z-10">
                                <h3 className="text-2xl font-bold text-dark dark:text-white mb-1 flex items-center">
                                    {offer.code}
                                    <button onClick={() => { navigator.clipboard.writeText(offer.code); alert('Code copied!') }} className="ml-2 text-gray-400 hover:text-primary transition p-1">
                                        <Copy className="h-4 w-4" />
                                    </button>
                                </h3>
                                <p className="text-primary font-bold text-lg mb-1">
                                    {offer.discountType === 'PERCENTAGE' ? `${offer.discountValue}% OFF` : `₹${offer.discountValue} OFF`}
                                </p>
                                <p className="text-xs text-gray-500 mb-4">Min Order: ₹{offer.minOrderValue}</p>

                                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-gray-700 pt-4">
                                    <span className="flex items-center"><Calendar className="h-3 w-3 mr-1" /> Exp: {new Date(offer.expiryDate).toLocaleDateString()}</span>
                                    <button onClick={() => handleDelete(offer._id)} className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded-lg transition">
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
                {offers.length === 0 && (
                    <div className="col-span-full text-center py-12 text-gray-400">
                        No active offers. Create one to boost sales!
                    </div>
                )}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 w-full max-w-sm shadow-2xl animate-fade-in">
                        <h2 className="text-xl font-bold text-dark dark:text-white mb-6">Create New Offer</h2>
                        <form onSubmit={handleAdd} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">Coupon Code</label>
                                <input name="code" required placeholder="e.g. SUMMER50" className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-dark dark:text-white focus:ring-2 focus:ring-primary outline-none uppercase" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1">Type</label>
                                    <select name="discountType" className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-dark dark:text-white focus:ring-2 focus:ring-primary outline-none">
                                        <option value="PERCENTAGE">Percentage (%)</option>
                                        <option value="FIXED">Fixed Amount (₹)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1">Value</label>
                                    <input name="discountValue" type="number" required placeholder="50" className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-dark dark:text-white focus:ring-2 focus:ring-primary outline-none" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">Min Order Value (₹)</label>
                                <input name="minOrderValue" type="number" defaultValue="0" className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-dark dark:text-white focus:ring-2 focus:ring-primary outline-none" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">Expiry Date</label>
                                <input name="expiryDate" type="date" required className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-dark dark:text-white focus:ring-2 focus:ring-primary outline-none" />
                            </div>
                            <div className="flex space-x-3 pt-4">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 font-bold text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl">Cancel</button>
                                <button type="submit" className="flex-1 py-3 bg-primary text-white font-bold rounded-xl hover:bg-secondary shadow-lg">Create</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminOffers;
