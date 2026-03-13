import { useState, useEffect } from 'react';
import api from '../api/axios';
import ProductSection from './ProductSection';
import { Loader2 } from 'lucide-react';

const RecommendedSection = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRecommendations = async () => {
            try {
                const token = sessionStorage.getItem('token');
                if (!token) {
                    setLoading(false);
                    return;
                }

                const res = await api.get('/recommendations');
                setProducts(res.data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching recommendations:', err);
                setError('Failed to load recommendations');
                setLoading(false);
            }
        };

        fetchRecommendations();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (error || products.length === 0) return null;

    return (
        <ProductSection
            title="Recommended for You"
            products={products}
            categoryLink="/shop"
        />
    );
};

export default RecommendedSection;
