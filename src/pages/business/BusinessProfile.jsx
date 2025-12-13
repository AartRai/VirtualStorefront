import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Phone, MapPin, Loader, Key, X, Save, Edit2, Shield } from 'lucide-react';
import api from '../../api/axios';

const BusinessProfile = () => {
    const { user, updateUser } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [showAvatarModal, setShowAvatarModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Avatar options (seeds for DiceBear Adventurer)
    const avatarOptions = [
        'Alexander', 'Willow', 'Jasper', 'Max', 'Luna',
        'Oliver', 'Sophia', 'Leo', 'Zoe', 'Milo'
    ];

    const [profile, setProfile] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        joined: new Date().toLocaleDateString(),
        avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Felix'
    });

    useEffect(() => {
        if (user) {
            setProfile(prev => ({
                ...prev,
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '',
                avatar: user.avatar || prev.avatar,
                address: user.businessAddress || '',
                joined: new Date(user.createdAt).toLocaleDateString()
            }));
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        setIsLoading(true);
        try {
            const res = await api.put('/auth/profile', {
                name: profile.name,
                phone: profile.phone,
                avatar: profile.avatar,
                businessAddress: profile.address
            });
            updateUser(res.data);
            setIsEditing(false);
            // Optional: Add toast notification here
        } catch (err) {
            console.error(err);
            alert('Failed to update profile');
        } finally {
            setIsLoading(false);
        }
    };

    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });

    const handlePasswordChange = (e) => {
        setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    };

    const submitPasswordChange = async () => {
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            alert("New passwords do not match");
            return;
        }
        if (passwordData.newPassword.length < 6) {
            alert("Password must be at least 6 characters");
            return;
        }

        try {
            await api.put('/auth/update-password', {
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            });
            alert("Password updated successfully");
            setShowPasswordModal(false);
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || "Failed to update password");
        }
    };

    const handleAvatarSelect = (seed) => {
        const url = `https://api.dicebear.com/7.x/adventurer/svg?seed=${seed}`;
        setProfile(prev => ({ ...prev, avatar: url }));
        setShowAvatarModal(false);
        // Auto-save avatar change if viewing
        if (!isEditing) {
            // We could construct a partial update call here, or just let user click save. 
            // Ideally strictly separate Edit vs View modes, but for Avatar usually instant update is nice.
            // For simplicity, let's require clicking "Save" if in Edit mode, or trigger save if used in View mode.
            // Actually, let's just update local state and let user Save globally.
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-10">
            <div>
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Settings</h1>
                <p className="text-gray-500 text-sm mt-1">Manage your business profile and preferences.</p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-8 border border-gray-100 dark:border-gray-700">
                <div className="flex flex-col md:flex-row gap-8 items-start">

                    {/* Avatar Column */}
                    <div className="flex flex-col items-center space-y-4">
                        <div className="relative group">
                            <div className="w-32 h-32 bg-yellow-400 rounded-full flex items-center justify-center border-4 border-white dark:border-gray-700 shadow-md overflow-hidden">
                                <img
                                    src={profile.avatar}
                                    alt="Avatar"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <button
                                onClick={() => setShowAvatarModal(true)}
                                className="absolute bottom-0 right-0 bg-white dark:bg-gray-700 p-2 rounded-full shadow-lg border border-gray-100 dark:border-gray-600 hover:bg-gray-50 transition-transform hover:scale-105"
                                title="Change Avatar"
                            >
                                <Edit2 className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                            </button>
                        </div>
                        <div className="text-center">
                            <h3 className="font-bold text-lg text-gray-800 dark:text-white">{profile.name}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Business Seller</p>
                        </div>
                    </div>

                    {/* Form Column */}
                    <div className="flex-1 w-full space-y-6">
                        <div className="flex justify-between items-center pb-4 border-b border-gray-100 dark:border-gray-700">
                            <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                                <User className="w-5 h-5 text-primary" />
                                Business Information
                            </h2>
                            {!isEditing ? (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                                >
                                    <Edit2 className="w-4 h-4" />
                                    Edit Profile
                                </button>
                            ) : (
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setIsEditing(false)}
                                        className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSave}
                                        disabled={isLoading}
                                        className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg text-sm font-medium shadow-md hover:shadow-lg transition-all flex items-center gap-2"
                                    >
                                        {isLoading ? <Loader className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                        Save Changes
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Full Name */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Business / Owner Name</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        type="text"
                                        name="name"
                                        value={profile.name}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        className={`w-full pl-10 pr-4 py-2.5 rounded-lg border ${isEditing ? 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500' : 'border-transparent bg-gray-50 dark:bg-gray-900/50 text-gray-600 cursor-not-allowed'} transition-all`}
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        type="email"
                                        value={profile.email}
                                        disabled={true} // Email usually uneditable directly
                                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-transparent bg-gray-100 dark:bg-gray-700 text-gray-500 cursor-not-allowed"
                                    />
                                </div>
                                <p className="text-xs text-gray-400 px-1">Contact support to change email.</p>
                            </div>

                            {/* Phone */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Phone Number</label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={profile.phone}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        placeholder="+91 99999 99999"
                                        className={`w-full pl-10 pr-4 py-2.5 rounded-lg border ${isEditing ? 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500' : 'border-transparent bg-gray-50 dark:bg-gray-900/50 text-gray-600 cursor-not-allowed'} transition-all`}
                                    />
                                </div>
                            </div>

                            {/* Joined Date */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Date Joined</label>
                                <div className="relative">
                                    <Shield className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        type="text"
                                        value={profile.joined}
                                        disabled={true}
                                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-transparent bg-gray-100 dark:bg-gray-700 text-gray-500 cursor-not-allowed"
                                    />
                                </div>
                            </div>

                            {/* Business Address - Full Width */}
                            <div className="md:col-span-2 space-y-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Business Address</label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                                    <textarea
                                        name="address"
                                        value={profile.address}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        rows="3"
                                        placeholder="Enter your full business address..."
                                        className={`w-full pl-10 pr-4 py-3 rounded-lg border ${isEditing ? 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500' : 'border-transparent bg-gray-50 dark:bg-gray-900/50 text-gray-600 cursor-not-allowed'} transition-all resize-none`}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Change Password Section */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-8 border border-gray-100 dark:border-gray-700">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                        <Key className="w-5 h-5 text-primary" />
                        Security
                    </h2>
                </div>
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-gray-50 dark:bg-gray-900/50 p-6 rounded-xl border border-gray-100 dark:border-gray-700">
                    <div>
                        <h3 className="font-bold text-gray-800 dark:text-white">Password</h3>
                        <p className="text-sm text-gray-500 mt-1">Change your password to keep your account secure.</p>
                    </div>
                    <button
                        onClick={() => setShowPasswordModal(true)}
                        className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 transition-colors"
                    >
                        Change Password
                    </button>
                </div>
            </div>

            {/* Password Modal */}
            {showPasswordModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
                        <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                            <h3 className="font-bold text-lg text-gray-800 dark:text-white">Change Password</h3>
                            <button
                                onClick={() => setShowPasswordModal(false)}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full text-gray-500 dark:text-gray-400 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Current Password</label>
                                <input
                                    type="password"
                                    name="currentPassword"
                                    value={passwordData.currentPassword}
                                    onChange={handlePasswordChange}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:ring-2 focus:ring-primary outline-none transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">New Password</label>
                                <input
                                    type="password"
                                    name="newPassword"
                                    value={passwordData.newPassword}
                                    onChange={handlePasswordChange}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:ring-2 focus:ring-primary outline-none transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Confirm New Password</label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={passwordData.confirmPassword}
                                    onChange={handlePasswordChange}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:ring-2 focus:ring-primary outline-none transition-all"
                                />
                            </div>
                            <button
                                onClick={submitPasswordChange}
                                className="w-full py-2 bg-primary hover:bg-primary-dark text-white rounded-lg font-bold shadow-md hover:shadow-lg transition-all mt-4"
                            >
                                Update Password
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Avatar Modal */}
            {showAvatarModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
                        <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                            <h3 className="font-bold text-lg text-gray-800 dark:text-white">Choose Avatar</h3>
                            <button
                                onClick={() => setShowAvatarModal(false)}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full text-gray-500 dark:text-gray-400 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                            {avatarOptions.map((seed) => (
                                <button
                                    key={seed}
                                    onClick={() => handleAvatarSelect(seed)}
                                    className={`aspect-square rounded-full border-2 p-1 transition-all hover:scale-110 ${profile.avatar.includes(seed)
                                        ? 'border-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 shadow-lg scale-105'
                                        : 'border-transparent hover:border-gray-200 dark:hover:border-gray-600'
                                        }`}
                                >
                                    <img
                                        src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${seed}`}
                                        alt={seed}
                                        className="w-full h-full rounded-full"
                                    />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BusinessProfile;
