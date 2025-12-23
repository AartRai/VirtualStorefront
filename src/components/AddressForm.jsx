import { useState, useEffect } from 'react';

const AddressForm = ({ initialData, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        name: '', street: '', city: '', state: '', zip: '', mobile: '', default: false
    });

    useEffect(() => {
        if (initialData) {
            console.log("AddressForm received initialData:", initialData);
            setFormData(initialData);
        } else {
            console.log("AddressForm: resetting to empty");
            setFormData({
                name: '', street: '', city: '', state: '', zip: '', mobile: '', default: false
            });
        }
    }, [initialData]);

    const handleChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFormData({ ...formData, [e.target.name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Label (e.g., Home)</label>
                <input
                    name="name"
                    required
                    className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Home, Work..."
                />
            </div>
            <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Street Address</label>
                <input
                    name="street"
                    required
                    className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none"
                    value={formData.street}
                    onChange={handleChange}
                    placeholder="123 Main St"
                />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">City</label>
                    <input
                        name="city"
                        required
                        className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none"
                        value={formData.city}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">State</label>
                    <input
                        name="state"
                        required
                        className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none"
                        value={formData.state}
                        onChange={handleChange}
                    />
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">ZIP Code</label>
                    <input
                        name="zip"
                        required
                        className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none"
                        value={formData.zip}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Mobile</label>
                    <input
                        name="mobile"
                        required
                        className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none"
                        value={formData.mobile}
                        onChange={handleChange}
                    />
                </div>
            </div>
            <div className="flex items-center gap-2">
                <input
                    type="checkbox"
                    name="default"
                    checked={formData.default}
                    onChange={handleChange}
                    className="rounded text-primary focus:ring-primary"
                />
                <span className="text-sm text-gray-600 dark:text-gray-300">Set as default address</span>
            </div>

            <div className="flex gap-3 pt-2">
                <button
                    type="button"
                    onClick={onCancel}
                    className="flex-1 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="flex-1 bg-primary text-white font-bold py-3 rounded-xl hover:bg-primary/90 transition shadow-lg shadow-primary/30"
                >
                    Save Address
                </button>
            </div>
        </form>
    );
};

export default AddressForm;
