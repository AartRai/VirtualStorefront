import { useState } from 'react';
import { useAuth } from '../../context/AuthContext'; // Updated path
import { User, Mail, Shield, Save } from 'lucide-react';
import api from '../../api/axios';

const AdminProfile = () => {
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        currentPassword: '',
        newPassword: ''
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.put('/admin/profile', formData);
            alert("Profile updated successfully");
            // Optionally reload or update context here if needed, but for now alert is enough
            window.location.reload();
        } catch (err) {
            console.error("Error updating profile:", err);
            alert(err.response?.data?.msg || "Failed to update profile");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
            <h1 className="text-2xl font-bold text-dark dark:text-white">Admin Profile</h1>

            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-6 mb-8">
                    <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 text-3xl font-bold">
                        {user?.name?.charAt(0)}
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-dark dark:text-white">{user?.name}</h2>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-600 mt-2">
                            <Shield className="w-3 h-3 mr-1" /> Super Admin
                        </span>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-500 mb-2">Full Name</label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                            <input
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full pl-10 p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-dark dark:text-white focus:ring-2 focus:ring-primary outline-none"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-500 mb-2">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                            <input
                                name="email"
                                value={formData.email}
                                disabled
                                className="w-full pl-10 p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-500 cursor-not-allowed"
                            />
                        </div>
                    </div>

                    <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                        <h3 className="text-lg font-bold text-dark dark:text-white mb-4">Change Password</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">Current Password</label>
                                <input
                                    type="password"
                                    name="currentPassword"
                                    className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-primary outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">New Password</label>
                                <input
                                    type="password"
                                    name="newPassword"
                                    className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-primary outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-primary text-white font-bold rounded-xl hover:bg-secondary shadow-lg transition flex items-center justify-center gap-2"
                    >
                        <Save className="h-5 w-5" />
                        {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminProfile;
