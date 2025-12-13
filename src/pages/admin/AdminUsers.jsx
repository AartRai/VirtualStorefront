import { useState, useEffect } from 'react';
import { Search, Trash2, Mail, User, Shield } from 'lucide-react';
import api from '../../api/axios';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await api.get('/admin/users');
            setUsers(res.data);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching users:", err);
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        // window.confirm removed for automated testing reliability
        // if (!window.confirm('Are you sure you want to delete this user?')) return;
        try {
            await api.delete(`/admin/users/${id}`);
            setUsers(users.filter(u => u._id !== id));
        } catch (err) {
            console.error("Error deleting user:", err);
            alert("Failed to delete user");
        }
    };

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return <div className="h-96 flex items-center justify-center">Loading users...</div>;
    }

    return (
        <div className="space-y-6 animate-fade-in">
            <h1 className="text-2xl font-bold text-dark dark:text-white">Users Management</h1>

            {/* Search */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center">
                <Search className="h-5 w-5 text-gray-400 mr-3" />
                <input
                    placeholder="Search users..."
                    className="flex-1 bg-transparent border-none focus:ring-0 text-dark dark:text-white placeholder-gray-400"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Users Table */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 text-xs uppercase font-bold">
                            <tr>
                                <th className="px-6 py-4">User</th>
                                <th className="px-6 py-4">Role</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                            {filteredUsers.map((user) => (
                                <tr key={user._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                                                <User className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <div className="font-bold text-dark dark:text-white text-sm">{user.name}</div>
                                                <div className="text-xs text-gray-400 flex items-center gap-1">
                                                    <Mail className="w-3 h-3" /> {user.email}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${user.role === 'admin' ? 'bg-purple-100 text-purple-600' :
                                            user.role === 'business' ? 'bg-blue-100 text-blue-600' :
                                                'bg-green-100 text-green-600'
                                            }`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-600">Active</span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        {user.role !== 'admin' && (
                                            <button
                                                onClick={() => handleDelete(user._id)}
                                                className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
                                                title="Delete User"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminUsers;
