import { useState } from 'react';
import { Plus, Trash2, Edit } from 'lucide-react';

const AdminCategories = () => {
    const [categories, setCategories] = useState([
        { id: 1, name: 'Fashion', products: 120 },
        { id: 2, name: 'Electronics', products: 85 },
        { id: 3, name: 'Home & Living', products: 45 },
        { id: 4, name: 'Beauty', products: 30 },
        { id: 5, name: 'Mobiles', products: 60 },
    ]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newCategory, setNewCategory] = useState('');

    const handleAdd = (e) => {
        e.preventDefault();
        setCategories([...categories, { id: Date.now(), name: newCategory, products: 0 }]);
        setNewCategory('');
        setIsModalOpen(false);
    };

    const handleDelete = (id) => {
        if (window.confirm('Delete this category?')) {
            setCategories(categories.filter(c => c.id !== id));
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-dark dark:text-white">Categories</h1>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center px-4 py-2 bg-primary text-white rounded-lg font-bold hover:bg-secondary transition shadow-lg"
                >
                    <Plus className="h-5 w-5 mr-2" /> Add Category
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map((cat) => (
                    <div key={cat.id} className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex justify-between items-center group">
                        <div>
                            <h3 className="font-bold text-lg text-dark dark:text-white">{cat.name}</h3>
                            <p className="text-sm text-gray-500">{cat.products} Products</p>
                        </div>
                        <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg">
                                <Edit className="h-4 w-4" />
                            </button>
                            <button onClick={() => handleDelete(cat.id)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg">
                                <Trash2 className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 w-full max-w-sm shadow-2xl animate-fade-in">
                        <h2 className="text-xl font-bold text-dark dark:text-white mb-6">Add Category</h2>
                        <form onSubmit={handleAdd} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">Category Name</label>
                                <input
                                    value={newCategory}
                                    onChange={(e) => setNewCategory(e.target.value)}
                                    required
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
