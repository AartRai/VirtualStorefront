import { useParams } from 'react-router-dom';
import { Star, ShoppingCart, ArrowLeft, ArrowRight, Heart } from 'lucide-react';
import { products } from '../data/mockData';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useState, useEffect } from 'react';
import RecentlyViewed from '../components/RecentlyViewed';

const ProductDetails = () => {
    const { id } = useParams();
    const product = products.find(p => p.id === parseInt(id));
    const { addToCart } = useCart();
    const { isInWishlist, toggleWishlist } = useWishlist();

    const [added, setAdded] = useState(false);
    const [selectedSize, setSelectedSize] = useState('38');
    const [selectedColor, setSelectedColor] = useState('orange');

    // Add to Recently Viewed
    useEffect(() => {
        if (product) {
            const stored = localStorage.getItem('recentlyViewed');
            let recent = stored ? JSON.parse(stored) : [];

            // Remove if already exists to move to top
            recent = recent.filter(p => p.id !== product.id);

            // Add to beginning
            recent.unshift(product);

            // Limit to 10
            if (recent.length > 10) recent.pop();

            localStorage.setItem('recentlyViewed', JSON.stringify(recent));
        }
    }, [product]);

    const handleAddToCart = () => {
        addToCart(product);
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    if (!product) {
        return <div className="p-8 text-center text-xl">Product not found</div>;
    }

    return (
        <div className="min-h-screen pb-12 relative overflow-hidden bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            {/* Yellow Background Header - Sunburst Gradient */}
            <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-br from-[#FFD700] via-[#FFB800] to-[#FF7A00] dark:from-orange-900 dark:via-orange-800 dark:to-gray-900 rounded-b-[4rem] -z-10 shadow-sm transition-colors duration-300"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
                {/* Breadcrumb / Header */}
                <div className="flex justify-between items-center mb-8 text-dark/80 dark:text-white/80">
                    <div className="text-sm font-medium">Home / Product details</div>
                    <div className="text-3xl font-bold text-dark dark:text-white">Product Details</div>
                    <div className="flex items-center space-x-4 text-sm font-medium">
                        <span>Next Product</span>
                        <ArrowLeft className="h-5 w-5 cursor-pointer hover:text-white transition" />
                        <ArrowRight className="h-5 w-5 cursor-pointer hover:text-white transition" />
                    </div>
                </div>

                {/* Main Card */}
                <div className="bg-[#FFE8A3] dark:bg-gray-800 backdrop-blur-md rounded-[2.5rem] shadow-xl p-8 md:p-12 relative transition-colors duration-300">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">

                        {/* Left: Info & Thumbnails */}
                        <div className="space-y-8">
                            <div>
                                <h1 className="text-4xl font-bold text-dark dark:text-white mb-4 leading-tight">{product.name}</h1>
                                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{product.description}</p>
                            </div>

                            <div className="flex space-x-4">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="w-20 h-20 bg-surface-alt dark:bg-gray-700 rounded-2xl p-2 cursor-pointer hover:ring-2 ring-primary transition">
                                        <img src={product.image} alt="" className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal" />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Center: Hero Image */}
                        <div className="relative flex justify-center items-center">
                            <div className="absolute inset-0 bg-gradient-to-b from-orange-100 to-transparent dark:from-gray-700 rounded-full opacity-50 blur-2xl transform scale-90"></div>
                            <div className="w-80 h-80 md:w-96 md:h-96 border border-orange-200 dark:border-gray-600 rounded-full flex items-center justify-center relative z-10 bg-gradient-to-b from-white/50 to-transparent dark:from-gray-700/50">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-[120%] max-w-none transform -rotate-12 drop-shadow-2xl hover:rotate-0 transition duration-500"
                                />
                            </div>
                            <div className="absolute -bottom-4 text-3xl font-bold text-primary/80 dark:text-primary">${product.price.toFixed(2)}</div>
                        </div>

                        {/* Right: Options & Actions */}
                        <div className="space-y-8">
                            {/* Reviews */}
                            <div className="flex items-center justify-between">
                                <span className="font-bold text-dark dark:text-white">Review:</span>
                                <div className="flex items-center">
                                    <div className="flex text-yellow-400">
                                        {[1, 2, 3, 4].map(i => <Star key={i} className="h-4 w-4 fill-current" />)}
                                        <Star className="h-4 w-4 fill-current text-gray-300 dark:text-gray-600" />
                                    </div>
                                    <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">4.5 (60)</span>
                                </div>
                            </div>

                            {/* Color Picker */}
                            <div className="flex items-center justify-between">
                                <span className="font-bold text-dark dark:text-white">Color:</span>
                                <div className="flex space-x-3">
                                    {['#00C2FF', '#FF7A00', '#FFC000', '#8D8D8D'].map((color) => (
                                        <button
                                            key={color}
                                            className={`w-6 h-6 rounded-full ring-2 ring-offset-2 ${selectedColor === color ? 'ring-dark dark:ring-white' : 'ring-transparent'}`}
                                            style={{ backgroundColor: color }}
                                            onClick={() => setSelectedColor(color)}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Size Picker */}
                            <div className="flex items-center justify-between">
                                <span className="font-bold text-dark dark:text-white">Size:</span>
                                <div className="grid grid-cols-3 gap-2">
                                    {['37', '38', '39', '40', '41', '42'].map((size) => (
                                        <button
                                            key={size}
                                            onClick={() => setSelectedSize(size)}
                                            className={`px-4 py-2 rounded-xl text-sm font-bold transition ${selectedSize === size ? 'bg-primary text-dark' : 'bg-surface-alt dark:bg-gray-700 text-gray-500 dark:text-gray-300 hover:bg-orange-100 dark:hover:bg-gray-600'}`}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex space-x-4">
                                <button
                                    onClick={handleAddToCart}
                                    className={`flex-1 py-4 rounded-full font-bold text-white shadow-lg transform active:scale-95 transition flex items-center justify-center space-x-2 ${added ? 'bg-green-600' : 'bg-dark dark:bg-primary hover:bg-gray-800 dark:hover:bg-orange-600'}`}
                                >
                                    {added ? <span>Added to Cart</span> : <><span>Add to cart</span></>}
                                </button>
                                <button
                                    onClick={() => toggleWishlist(product)}
                                    className={`p-4 rounded-full shadow-lg transform active:scale-95 transition ${isInWishlist(product.id) ? 'bg-red-50 text-red-500' : 'bg-white dark:bg-gray-700 text-dark dark:text-white hover:bg-gray-50 dark:hover:bg-gray-600'}`}
                                >
                                    <Heart className={`h-6 w-6 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recently Viewed Section */}
                <RecentlyViewed />
            </div>
        </div>
    );
};

export default ProductDetails;
