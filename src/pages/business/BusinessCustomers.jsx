import { useState, useEffect } from 'react';
import { Search, Users, Mail, MapPin } from 'lucide-react';
import api from '../../api/axios';
import { Link } from 'react-router-dom';

const BusinessCustomers = () => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        try {
            const res = await api.get('/business/customers');
            setCustomers(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const filteredCustomers = customers.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="p-8 text-center">Loading customers...</div>;

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                <Users className="h-6 w-6 text-primary" /> My Customers
            </h1>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <p className="text-gray-500 text-sm">Total Unique Customers</p>
                    <h3 className="text-3xl font-bold text-gray-800 dark:text-white">{customers.length}</h3>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <p className="text-gray-500 text-sm">Avg. Spend per Customer</p>
                    <h3 className="text-3xl font-bold text-gray-800 dark:text-white">
                        ₹{customers.length > 0 ? Math.round(customers.reduce((acc, c) => acc + c.totalSpent, 0) / customers.length) : 0}
                    </h3>
                </div>
            </div>

            {/* Search */}
            <div className="flex items-center space-x-4 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                <Search className="h-5 w-5 text-gray-400" />
                <input
                    placeholder="Search by name or email..."
                    className="flex-1 bg-transparent border-none focus:ring-0 text-gray-800 dark:text-white placeholder-gray-400"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Customers Table */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 text-xs uppercase font-bold">
                        <tr>
                            <th className="px-6 py-4">Customer</th>
                            <th className="px-6 py-4">Location</th>
                            <th className="px-6 py-4">Total Orders</th>
                            <th className="px-6 py-4">Total Spent</th>
                            <th className="px-6 py-4">Last Order</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                        {filteredCustomers.length > 0 ? filteredCustomers.map(customer => (
                            <tr key={customer._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center text-primary font-bold">
                                            {customer.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-800 dark:text-white text-sm">{customer.name}</p>
                                            <p className="text-xs text-gray-500">{customer.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                                    <div className="flex items-center gap-1">
                                        <MapPin className="h-3 w-3 text-gray-400" /> {customer.location}
                                    </div>
                                </td>
                                <td className="px-6 py-4 font-bold text-gray-800 dark:text-white text-center w-32">{customer.totalOrders}</td>
                                <td className="px-6 py-4 font-bold text-primary">₹{customer.totalSpent}</td>
                                <td className="px-6 py-4 text-sm text-gray-500">{new Date(customer.lastOrderDate).toLocaleDateString()}</td>
                                <td className="px-6 py-4 text-right">
                                    <Link to="/business/newsletter" className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition">
                                        <Mail className="h-3 w-3" /> Email
                                    </Link>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="6" className="p-8 text-center text-gray-500">No customers found matching your search.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default BusinessCustomers;
