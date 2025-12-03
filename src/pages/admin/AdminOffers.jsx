import { useState } from 'react';
import { Tag, Plus, Trash2, Copy } from 'lucide-react';

const AdminOffers = () => {
    const [offers, setOffers] = useState([
        { id: 1, code: 'WELCOME20', discount: '20%', type: 'Percentage', status: 'Active', expiry: '2025-12-31' },
        { id: 2, code: 'SAVE10', discount: '10%', type: 'Percentage', status: 'Active', expiry: '2025-06-30' },
        { id: 3, code: 'FREESHIP', discount: 'Free Shipping', type: 'Fixed', status: 'Expired', expiry: '2024-12-31' },
    ]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleDelete = (id) => {
        if (window.confirm('Delete this offer?')) {
            setOffers(offers.filter(o => o.id !== id));
        }
    };

    const handleAdd = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const newOffer = {
            id: Date.now(),
            code: formData.get('code').toUpperCase(),
            discount: formData.get('discount'),
            type: 'Percentage',
            status: 'Active',
            expiry: formData.get('expiry')
        };
        setOffers([...offers, newOffer]);
        setIsModalOpen(false);
    };

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
                {offers.map((offer) => (
                    <div key={offer.id} className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 relative overflow-hidden group">
                        <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${offer.status === 'Active' ? 'from-green-400/20 to-green-600/20' : 'from-gray-400/20 to-gray-600/20'} rounded-bl-[4rem] -mr-4 -mt-4`}></div>

                        <div className="flex items-start justify-between mb-4 relative z-10">
                            <div className={`p-3 rounded-xl ${offer.status === 'Active' ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-500'} `}>
                                <Tag className="h-6 w-6" />
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${offer.status === 'Active' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                                {offer.status}
                            </span>
                        </div>

                        <div className="relative z-10">
                            <h3 className="text-2xl font-bold text-dark dark:text-white mb-1">{offer.code}</h3>
                            <p className="text-primary font-bold text-lg mb-4">{offer.discount} OFF</p>

                            <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-gray-700 pt-4">
                                <span>Expires: {offer.expiry}</span>
                                <button onClick={() => handleDelete(offer.id)} className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded-lg transition">
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
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
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">Discount Value</label>
                                <input name="discount" required placeholder="e.g. 50%" className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-dark dark:text-white focus:ring-2 focus:ring-primary outline-none" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">Expiry Date</label>
                                <input name="expiry" type="date" required className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-dark dark:text-white focus:ring-2 focus:ring-primary outline-none" />
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
