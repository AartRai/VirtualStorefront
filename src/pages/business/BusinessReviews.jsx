import { Star } from 'lucide-react';

const BusinessReviews = () => {
    // Mock reviews
    const reviews = [
        { id: 1, user: 'John Doe', rating: 5, comment: 'Excellent product! Highly recommended.', date: '2025-12-01' },
        { id: 2, user: 'Jane Smith', rating: 4, comment: 'Good quality, but delivery was a bit late.', date: '2025-11-28' },
        { id: 3, user: 'Mike Johnson', rating: 5, comment: 'Exactly what I needed. Five stars!', date: '2025-11-15' },
    ];

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Customer Reviews</h1>

            <div className="grid gap-4">
                {reviews.map((review) => (
                    <div key={review.id} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm transition-colors duration-300">
                        <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center font-bold text-xs">
                                    {review.user.charAt(0)}
                                </div>
                                <span className="font-medium text-gray-800 dark:text-white">{review.user}</span>
                            </div>
                            <span className="text-xs text-gray-500">{review.date}</span>
                        </div>
                        <div className="flex text-yellow-400 mb-2">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-current' : 'text-gray-300 dark:text-gray-600'}`} />
                            ))}
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 text-sm">{review.comment}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BusinessReviews;
