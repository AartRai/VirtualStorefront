import { useState } from 'react';
import { Users, X, Package } from 'lucide-react';

const BusinessUsers = () => {
    // Mock users
    const users = [
        { id: 1, name: 'Alice Walker', email: 'alice@example.com', orders: 12, totalSpent: 4500 },
        { id: 2, name: 'Bob Builder', email: 'bob@example.com', orders: 5, totalSpent: 1200 },
        { id: 3, name: 'Charlie Day', email: 'charlie@example.com', orders: 2, totalSpent: 300 },
    ];

    // Mock history data
    const mockHistory = {
        1: [
            { id: 'ORD-001', date: '2025-12-01', items: 'Wireless Headphones, Case', total: 2500, status: 'Delivered' },
            { id: 'ORD-002', date: '2025-11-20', items: 'USB-C Cable', total: 500, status: 'Delivered' },
            { id: 'ORD-003', date: '2025-11-05', items: 'Power Bank', total: 1500, status: 'Delivered' },
        ],
        2: [
            { id: 'ORD-004', date: '2025-12-04', items: 'Hammer, Nails', total: 1200, status: 'Shipped' },
        ],
        3: [
            { id: 'ORD-005', date: '2025-12-05', items: 'Cat Food', total: 300, status: 'Processing' },
        ]
    };

    const [selectedUser, setSelectedUser] = useState(null);

    return (
        <div className="space-y-6 relative">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Customer Base</h1>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden transition-colors duration-300">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300 text-xs uppercase tracking-wider">
                        <tr>
                            <th className="px-6 py-4">User</th>
                            <th className="px-6 py-4">Total Orders</th>
                            <th className="px-6 py-4">Total Spent</th>
                            <th className="px-6 py-4 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                        {users.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center text-xs font-bold">
                                            {user.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900 dark:text-white text-sm">{user.name}</p>
                                            <p className="text-xs text-gray-500">{user.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{user.orders}</td>
                                <td className="px-6 py-4 text-sm font-bold text-gray-900 dark:text-white">${user.totalSpent}</td>
                                <td className="px-6 py-4 text-right">
                                    <button
                                        onClick={() => setSelectedUser(user)}
                                        className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 text-xs font-semibold"
                                    >
                                        View History
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* History Modal */}
            {selectedUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center font-bold">
                                    {selectedUser.name.charAt(0)}
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">{selectedUser.name}</h2>
                                    <p className="text-xs text-gray-500">{selectedUser.email}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedUser(null)}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full text-gray-500 dark:text-gray-400"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 max-h-[60vh] overflow-y-auto">
                            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Order History</h3>
                            <div className="space-y-4">
                                {mockHistory[selectedUser.id]?.length > 0 ? (
                                    mockHistory[selectedUser.id].map((order, idx) => (
                                        <div key={idx} className="flex items-center justify-between p-4 border border-gray-100 dark:border-gray-700 rounded-lg hover:border-indigo-200 dark:hover:border-indigo-900 transition">
                                            <div className="flex items-start gap-3">
                                                <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded text-gray-400">
                                                    <Package className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900 dark:text-white text-sm">Order #{order.id}</p>
                                                    <p className="text-xs text-gray-500">{order.items}</p>
                                                    <span className="text-[10px] text-gray-400">{order.date}</span>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-gray-900 dark:text-white text-sm">${order.total}</p>
                                                <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${order.status === 'Delivered' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                                                        order.status === 'Shipped' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                                                            'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                                                    }`}>
                                                    {order.status}
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-center text-gray-500 py-4">No history found.</p>
                                )}
                            </div>
                        </div>

                        <div className="p-4 bg-gray-50 dark:bg-gray-700/30 text-center border-t border-gray-100 dark:border-gray-700">
                            <button
                                onClick={() => setSelectedUser(null)}
                                className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 font-medium"
                            >
                                Close History
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BusinessUsers;
