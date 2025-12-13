import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, Layers, Tag as TagIcon } from 'lucide-react';
import api from '../../api/axios';

const AdminCategories = () => {
    const [activeTab, setActiveTab] = useState('categories'); // 'categories' or 'brands'
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Form State
    const [newName, setNewName] = useState('');
    const [newImage, setNewImage] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [catRes, brandRes] = await Promise.all([
                api.get('/categories'),
                api.get('/brands')
            ]);
            setCategories(catRes.data);
            setBrands(brandRes.data);
        } catch (err) {
            console.error("Failed to fetch data", err);
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        try {
            const endpoint = activeTab === 'categories' ? '/categories' : '/brands';
            const payload = activeTab === 'categories' ? { name: newName, image: newImage } : { name: newName, logo: newImage };

            const res = await api.post(endpoint, payload);

            if (activeTab === 'categories') {
                setCategories([...categories, res.data]);
            } else {
                setBrands([...brands, res.data]);
            }

            setNewName('');
            setNewImage('');
            setIsModalOpen(false);
        } catch (err) {
            console.error("Add failed", err);
            alert(err.response?.data?.message || "Failed to add item");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm(`Delete this ${activeTab === 'categories' ? 'category' : 'brand'}?`)) return;

        try {
            const endpoint = activeTab === 'categories' ? `/categories/${id}` : `/brands/${id}`;
            await api.delete(endpoint);

            if (activeTab === 'categories') {
                setCategories(categories.filter(c => c._id !== id));
            } else {
                setBrands(brands.filter(b => b._id !== id));
            }
        } catch (err) {
            console.error("Delete failed", err);
            alert("Failed to delete item");
        }
    };

    const currentItems = activeTab === 'categories' ? categories : brands;

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-center bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="flex space-x-4 mb-4 sm:mb-0">
                    <button
                        onClick={() => setActiveTab('categories')}
                        className={`flex items-center px-4 py-2 rounded-lg font-bold transition ${activeTab === 'categories' ? 'bg-primary text-white shadow-md' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                    >
                        <Layers className="h-5 w-5 mr-2" /> Categories
                    </button>
                    <button
                        onClick={() => setActiveTab('brands')}
                        className={`flex items-center px-4 py-2 rounded-lg font-bold transition ${activeTab === 'brands' ? 'bg-primary text-white shadow-md' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                    >
                        <TagIcon className="h-5 w-5 mr-2" /> Brands
                    </button>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center px-4 py-2 bg-dark dark:bg-white dark:text-dark text-white rounded-lg font-bold hover:opacity-90 transition shadow-lg"
                >
                    <Plus className="h-5 w-5 mr-2" /> Add {activeTab === 'categories' ? 'Category' : 'Brand'}
                </button>
            </div>

            {loading ? (
                <div className="text-center py-12 text-gray-500">Loading...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {currentItems.map((item) => (
                        <div key={item._id} className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex justify-between items-center group hover:shadow-md transition">
                            <div className="flex items-center space-x-4">
                                {(item.image || item.logo) ? (
                                    <img src={item.image || item.logo} alt="" className="w-12 h-12 rounded-lg object-cover bg-gray-50" />
                                ) : (
                                    <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-400">
                                        {activeTab === 'categories' ? <Layers /> : <TagIcon />}
                                    </div>
                                )}
                                <div>
                                    <h3 className="font-bold text-lg text-dark dark:text-white">{item.name}</h3>
                                    {/* Products count placeholder until implemented */}
                                </div>
                            </div>
                            <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => handleDelete(item._id)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg">
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                    {currentItems.length === 0 && (
                        <div className="col-span-full text-center py-12 text-gray-400">
                            No {activeTab} found. Add one to get started!
                        </div>
                    )}
                </div>
            )}

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 w-full max-w-sm shadow-2xl animate-fade-in">
                        <h2 className="text-xl font-bold text-dark dark:text-white mb-6 capitalize">Add New {activeTab === 'categories' ? 'Category' : 'Brand'}</h2>
                        <form onSubmit={handleAdd} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">Name</label>
                                <input
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                    required
                                    placeholder={`e.g. ${activeTab === 'categories' ? 'Electronics' : 'Nike'}`}
                                    className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-dark dark:text-white focus:ring-2 focus:ring-primary outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">{activeTab === 'categories' ? 'Image URL' : 'Logo URL'}</label>
                                <input
                                    value={newImage}
                                    onChange={(e) => setNewImage(e.target.value)}
                                    placeholder="https://..."
                                    className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-dark dark:text-white focus:ring-2 focus:ring-primary outline-none"
                                />
                            </div>
                            <div className="flex space-x-3 pt-4">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 font-bold text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl">Cancel</button>
                                <button type="submit" className="flex-1 py-3 bg-primary text-white font-bold rounded-xl hover:bg-secondary shadow-lg">Add</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminCategories;
