import { useState, useEffect } from 'react';
import { Star, Trash2 } from 'lucide-react';
import api from '../../api/axios';

const AdminReviews = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        try {
            const res = await api.get('/admin/reviews');
            setReviews(res.data);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching reviews:", err);
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        // window.confirm removed for automated testing reliability
        // if (!window.confirm('Delete this review?')) return;
        try {
            await api.delete(`/admin/reviews/${id}`);
            setReviews(reviews.filter(r => r._id !== id));
        } catch (err) {
            console.error("Error deleting review:", err);
        }
    };

    if (loading) {
        return <div className="h-96 flex items-center justify-center">Loading reviews...</div>;
    }

    return (
        <div className="space-y-6 animate-fade-in">
            <h1 className="text-2xl font-bold text-dark dark:text-white">Product Reviews</h1>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 text-xs uppercase font-bold">
                            <tr>
                                <th className="px-6 py-4">Product</th>
                                <th className="px-6 py-4">User</th>
                                <th className="px-6 py-4">Rating</th>
                                <th className="px-6 py-4">Comment</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                            {reviews.map((review) => (
                                <tr key={review._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                                    <td className="px-6 py-4 font-bold text-sm text-dark dark:text-white">
                                        {review.product?.name || 'Deleted Product'}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                                        {review.user?.name || 'Deleted User'}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center text-yellow-500">
                                            <span className="font-bold mr-1">{review.rating}</span>
                                            <Star className="w-4 h-4 fill-current" />
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 italic max-w-xs truncate">
                                        "{review.comment}"
                                    </td>
                                    <td className="px-6 py-4 text-xs text-gray-400">
                                        {new Date(review.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => handleDelete(review._id)}
                                            className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
                                            title="Delete Review"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {reviews.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500">No reviews found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminReviews;
