import { useAuth } from '../../context/AuthContext';
import { useWishlist } from '../../context/WishlistContext';
import AddressForm from '../../components/AddressForm';
import { User, Mail, Phone, MapPin, Package, CreditCard, Heart, Edit2, Plus, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../../api/axios';

const Profile = () => {
    const { user, addresses, updateUser, addAddress, removeAddress, editAddress } = useAuth();
    const { wishlist } = useWishlist();
    const [orderCount, setOrderCount] = useState(0);
    const [isEditing, setIsEditing] = useState(false);
    const [showAddressModal, setShowAddressModal] = useState(false);
    const [editingAddressId, setEditingAddressId] = useState(null); // ID of address being edited
    const [formData, setFormData] = useState({
        name: '',
        phone: ''
    });

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                phone: user.phone || ''
            });
        }
    }, [user]);

    const handleSave = async () => {
        try {
            const res = await api.put('/auth/profile', formData);
            updateUser(res.data);
            setIsEditing(false);
            toast.success('Profile updated successfully!');
        } catch (err) {
            console.error(err);
            toast.error('Failed to update profile');
        }
    };

    const handleAddressSubmit = async (addressData) => {
        let success;
        if (editingAddressId) {
            success = await editAddress(editingAddressId, addressData);
        } else {
            success = await addAddress(addressData);
        }

        if (success) {
            setShowAddressModal(false);
            setEditingAddressId(null);
            toast.success(editingAddressId ? 'Address updated!' : 'Address added!');
        } else {
            toast.error('Operation failed');
        }
    };

    const handleEditAddressClick = (addr) => {
        // Enforce _id as string, fallback to id if _id missing
        const id = addr._id ? String(addr._id) : (addr.id ? String(addr.id) : null);
        console.log("Editing Address ID:", id, "Raw Addr:", addr);
        if (!id) {
            toast.error("Error: Address ID not found on object. Cannot edit.");
            return;
        }
        setEditingAddressId(id);
        setShowAddressModal(true);
    };

    const handleAddNewClick = () => {
        setEditingAddressId(null);
        setShowAddressModal(true);
    };

    useEffect(() => {
        const fetchOrderCount = async () => {
            try {
                const res = await api.get('/orders');
                setOrderCount(res.data.length);
            } catch (err) {
                console.error("Failed to fetch order count", err);
            }
        };
        fetchOrderCount();
    }, []);

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary to-secondary rounded-[2rem] p-8 text-white shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                <div className="relative z-10 flex items-center gap-6">
                    <div className="relative group">
                        <div className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-4xl font-bold border-4 border-white/30 overflow-hidden">
                            {user?.avatar ? (
                                <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                user?.name?.charAt(0) || 'U'
                            )}
                        </div>
                        <button
                            onClick={() => {
                                const url = prompt("Enter Image URL for Avatar:", user?.avatar || '');
                                if (url !== null) {
                                    setFormData(prev => ({ ...prev, avatar: url }));
                                    // Optionally trigger save immediately or wait for user to click separate save
                                    // For better UX reusing existing save flow:
                                    // But we need to update state to show preview immediately? 
                                    // Let's rely on formData for preview inside edit mode?
                                    // Wait, the header is not in edit mode.
                                    // Let's simple call a specialized update or just save immediately.
                                    api.put('/auth/profile', { avatar: url })
                                        .then(res => {
                                            updateUser(res.data);
                                            toast.success('Avatar updated!');
                                        })
                                        .catch(err => toast.error('Failed to update avatar'));
                                }
                            }}
                            className="absolute bottom-0 right-0 p-1.5 bg-white text-primary rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                        >
                            <div className="h-4 w-4">✏️</div>
                        </button>
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
                        <p className="text-2xl font-bold text-dark dark:text-white">{orderCount}</p>
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
                        <p className="text-2xl font-bold text-dark dark:text-white">{wishlist.length}</p>
                    </div>
                </div>
            </div>

            {/* Personal Info & Addresses */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Personal Info */}
                <div className="bg-white dark:bg-gray-800 p-8 rounded-[2rem] shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-dark dark:text-white">Personal Information</h2>
                        <button
                            onClick={() => {
                                if (isEditing) handleSave();
                                else setIsEditing(true);
                            }}
                            className="text-primary text-sm font-bold hover:underline"
                        >
                            {isEditing ? 'Save' : 'Edit'}
                        </button>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                            <User className="h-5 w-5 text-gray-400" />
                            <div className="flex-1">
                                <p className="text-xs text-gray-500 dark:text-gray-400">Full Name</p>
                                {isEditing ? (
                                    <input
                                        className="w-full bg-white dark:bg-gray-600 border border-gray-200 dark:border-gray-500 rounded-lg px-2 py-1 text-sm font-bold text-dark dark:text-white focus:ring-2 focus:ring-primary outline-none"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                ) : (
                                    <p className="font-bold text-dark dark:text-white">{user?.name || 'User Name'}</p>
                                )}
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
                            <div className="flex-1">
                                <p className="text-xs text-gray-500 dark:text-gray-400">Phone Number</p>
                                {isEditing ? (
                                    <input
                                        className="w-full bg-white dark:bg-gray-600 border border-gray-200 dark:border-gray-500 rounded-lg px-2 py-1 text-sm font-bold text-dark dark:text-white focus:ring-2 focus:ring-primary outline-none"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        placeholder="Add phone number"
                                    />
                                ) : (
                                    <p className="font-bold text-dark dark:text-white">{user?.phone || 'Not provided'}</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Addresses */}
                <div className="bg-white dark:bg-gray-800 p-8 rounded-[2rem] shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-dark dark:text-white">Addresses</h2>
                        <button
                            onClick={handleAddNewClick}
                            className="flex items-center gap-1 text-primary text-sm font-bold hover:underline"
                        >
                            <Plus className="h-4 w-4" /> Add New
                        </button>
                    </div>

                    <div className="space-y-4">
                        {addresses.length > 0 ? (
                            addresses.map((addr) => (
                                <div key={addr._id || addr.id} className="p-6 bg-orange-50 dark:bg-gray-700/50 rounded-2xl border border-orange-100 dark:border-gray-600 relative group">
                                    <div className="absolute top-4 right-4 flex gap-2">
                                        <button
                                            onClick={() => handleEditAddressClick(addr)}
                                            className="p-2 text-gray-500 hover:text-primary transition bg-white dark:bg-gray-800 rounded-full shadow-sm"
                                            title="Edit"
                                        >
                                            <Edit2 className="h-3 w-3" />
                                        </button>
                                        <button
                                            onClick={async () => {
                                                if (window.confirm('Delete this address?')) {
                                                    console.log("Attempting to delete address:", addr);
                                                    const id = addr._id ? String(addr._id) : (addr.id ? String(addr.id) : null);
                                                    if (!id) {
                                                        toast.error("Error: Cannot delete address without ID");
                                                        return;
                                                    }
                                                    console.log("[DEBUG] Deleting address with ID:", id);
                                                    const success = await removeAddress(id);
                                                    if (success) {
                                                        // alert("Address deleted successfully"); // Optional: confirm success to user
                                                    } else {
                                                        toast.error("Failed to delete address. See console for details.");
                                                    }
                                                }
                                            }}
                                            className="p-2 text-red-500 hover:text-red-600 transition bg-white dark:bg-gray-800 rounded-full shadow-sm"
                                            title="Delete"
                                        >
                                            <Trash2 className="h-3 w-3" />
                                        </button>
                                        {addr.default && (
                                            <div className="text-primary bg-white dark:bg-gray-800 p-2 rounded-full shadow-sm" title="Default Address">
                                                <MapPin className="h-3 w-3" />
                                            </div>
                                        )}
                                    </div>
                                    <h3 className="font-bold text-dark dark:text-white mb-1 flex items-center gap-2">
                                        {addr.name}
                                        {addr.default && <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full">Default</span>}
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                                        {addr.street}<br />
                                        {addr.city}, {addr.state} {addr.zip}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-2">Mobile: {addr.mobile}</p>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8 text-gray-500">No addresses saved.</div>
                        )}
                    </div>
                </div>
            </div>

            {/* Address Modal */}
            {showAddressModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                            <h3 className="font-bold text-lg text-gray-800 dark:text-white">
                                {editingAddressId ? 'Edit Address' : 'Add New Address'}
                            </h3>
                            <button
                                onClick={() => setShowAddressModal(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                ×
                            </button>
                        </div>
                        <div className="p-6">
                            <AddressForm
                                initialData={editingAddressId ? addresses.find(a => (a._id ? String(a._id) : String(a.id)) === editingAddressId) : null}
                                onSave={handleAddressSubmit}
                                onCancel={() => setShowAddressModal(false)}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;
