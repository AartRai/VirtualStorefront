import { useAuth } from '../../context/AuthContext';
import { User, Mail, Phone, MapPin, Package, CreditCard, Heart } from 'lucide-react';

const Profile = () => {
    const { user, addresses } = useAuth();

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary to-secondary rounded-[2rem] p-8 text-white shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                <div className="relative z-10 flex items-center gap-6">
                    <div className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-4xl font-bold border-4 border-white/30">
                        {user?.name?.charAt(0) || 'U'}
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold mb-1">Welcome back, {user?.name || 'User'}!</h1>
                        <p className="text-white/80 flex items-center gap-2">
                            <Mail className="h-4 w-4" /> {user?.email || 'user@example.com'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center">
                        <Package className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-gray-500 dark:text-gray-400 text-sm font-bold">Total Orders</p>
                        <p className="text-2xl font-bold text-dark dark:text-white">12</p>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-xl flex items-center justify-center">
                        <CreditCard className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-gray-500 dark:text-gray-400 text-sm font-bold">Saved Cards</p>
                        <p className="text-2xl font-bold text-dark dark:text-white">2</p>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-4">
                    <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl flex items-center justify-center">
                        <Heart className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-gray-500 dark:text-gray-400 text-sm font-bold">Wishlist</p>
                        <p className="text-2xl font-bold text-dark dark:text-white">5</p>
                    </div>
                </div>
            </div>

            {/* Personal Info & Addresses */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Personal Info */}
                <div className="bg-white dark:bg-gray-800 p-8 rounded-[2rem] shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-dark dark:text-white">Personal Information</h2>
                        <button className="text-primary text-sm font-bold hover:underline">Edit</button>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                            <User className="h-5 w-5 text-gray-400" />
                            <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Full Name</p>
                                <p className="font-bold text-dark dark:text-white">{user?.name || 'User Name'}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                            <Mail className="h-5 w-5 text-gray-400" />
                            <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Email Address</p>
                                <p className="font-bold text-dark dark:text-white">{user?.email || 'user@example.com'}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                            <Phone className="h-5 w-5 text-gray-400" />
                            <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Phone Number</p>
                                <p className="font-bold text-dark dark:text-white">+1 (555) 123-4567</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Default Address */}
                <div className="bg-white dark:bg-gray-800 p-8 rounded-[2rem] shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-dark dark:text-white">Default Address</h2>
                        <button className="text-primary text-sm font-bold hover:underline">Manage</button>
                    </div>
                    {addresses.length > 0 ? (
                        <div className="p-6 bg-orange-50 dark:bg-gray-700/50 rounded-2xl border border-orange-100 dark:border-gray-600 relative">
                            <div className="absolute top-4 right-4 text-primary bg-white dark:bg-gray-800 p-2 rounded-full shadow-sm">
                                <MapPin className="h-5 w-5" />
                            </div>
                            <h3 className="font-bold text-dark dark:text-white mb-2">{addresses[0].name}</h3>
                            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                                {addresses[0].street}<br />
                                {addresses[0].city}, {addresses[0].state} {addresses[0].zip}
                            </p>
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-500">No addresses saved.</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;
