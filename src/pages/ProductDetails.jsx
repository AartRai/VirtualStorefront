import { useParams, Link, useNavigate } from 'react-router-dom';
import { Star, ShoppingCart, Heart, ShieldCheck, RotateCcw } from 'lucide-react';
import axios from '../api/axios';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext'; // Import useAuth
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import RecentlyViewed from '../components/RecentlyViewed';
import ReviewList from '../components/ReviewList';
import ReviewForm from '../components/ReviewForm';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth(); // Get user from context
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // UI State
    const [mainImage, setMainImage] = useState('');
    const [selectedColor, setSelectedColor] = useState(null);
    const [selectedSize, setSelectedSize] = useState(null);
    const [pincode, setPincode] = useState('');
    const [deliveryStatus, setDeliveryStatus] = useState(null); // { type: 'success' | 'error', message: string }
    const [added, setAdded] = useState(false);

    // Review Logic
    const [canReview, setCanReview] = useState(false);
    const [reviewMessage, setReviewMessage] = useState('');

    // Zoom state
    const [zoomStyle, setZoomStyle] = useState({ display: 'none' });

    const [reviews, setReviews] = useState([]);

    const { addToCart } = useCart();
    const { isInWishlist, toggleWishlist } = useWishlist();

    useEffect(() => {
        const fetchProductAndReviews = async () => {
            try {
                setLoading(true);
                const res = await axios.get(`/products/${id}`);
                setProduct(res.data);

                // Fetch reviews and check if user can review
                try {
                    const reviewRes = await axios.get(`/reviews/product/${id}`);
                    setReviews(reviewRes.data);

                    if (user) {
                        const checkRes = await axios.get(`/reviews/can-review/${id}`);
                        setCanReview(checkRes.data.canReview);
                        setReviewMessage(checkRes.data.reason || '');
                    }
                } catch (reviewErr) {
                    console.error("Failed to fetch reviews", reviewErr);
                }

                // Set initial main image
                if (res.data.images && res.data.images.length > 0) {
                    setMainImage(res.data.images[0]);
                } else {
                    setMainImage(res.data.image);
                }

                // Set initial variants if available
                if (res.data.colors && res.data.colors.length > 0) setSelectedColor(res.data.colors[0]);
                if (res.data.sizes && res.data.sizes.length > 0) setSelectedSize(res.data.sizes[0]);

                setError(null);
            } catch (err) {
                console.error('Error fetching product:', err);
                setError("Product not found");
            } finally {
                setLoading(false);
            }
        };
        fetchProductAndReviews();
    }, [id, user]);

    const handleReviewAdded = async () => {
        try {
            const reviewRes = await axios.get(`/reviews/product/${id}`);
            setReviews(reviewRes.data);
            setCanReview(false); // Once added, disable form
            setReviewMessage('Thanks for your review!');

            // Re-fetch product to update rating
            const res = await axios.get(`/products/${id}`);
            setProduct(res.data);
        } catch (err) {
            console.error("Failed to refresh reviews", err);
        }
    };


    const handleMouseMove = (e) => {
        const { left, top, width, height } = e.target.getBoundingClientRect();
        const x = ((e.pageX - left) / width) * 100;
        const y = ((e.pageY - top) / height) * 100;

        setZoomStyle({
            display: 'block',
            backgroundImage: `url(${mainImage})`,
            backgroundPosition: `${x}% ${y}%`,
            backgroundSize: '200%' // 2x zoom
        });
    };

    const handleMouseLeave = () => {
        setZoomStyle({ display: 'none' });
    };

    const handleAddToCart = () => {
        if (!product) return;

        const itemToAdd = {
            ...product, // Spread product properties
            name: product.name, // Explicitly ensure name/price/id are present if spread fails or for clarity
            price: product.price,
            _id: product._id,
            selectedColor,
            selectedSize,
            image: mainImage
        };

        addToCart(itemToAdd);
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    const handleBuyNow = () => {
        handleAddToCart();
        navigate('/checkout');
    };

    const checkDelivery = () => {
        if (!pincode) {
            setDeliveryStatus({ type: 'error', message: 'Please enter a pincode' });
            return;
        }
        if (!/^\d{6}$/.test(pincode)) {
            setDeliveryStatus({ type: 'error', message: 'Invalid Pincode (must be 6 digits)' });
            return;
        }

        // Simulate API check
        // Generate pseudo-random days based on pincode to ensure consistency for the same code
        // Logic: 3 days base + (last digit % 4) -> 3 to 6 days
        const daysToAdd = 3 + (parseInt(pincode.slice(-1)) % 4);

        const date = new Date();
        date.setDate(date.getDate() + daysToAdd);
        const dateString = date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

        setDeliveryStatus({
            type: 'success',
            message: `Delivery by ${dateString}`,
            subMessage: 'Free Delivery'
        });
    };

    // isInWishlist and toggleWishlist are now imported from useWishlist hook


    if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;
    if (error || !product) return <div className="min-h-screen flex items-center justify-center text-red-500">{error || "Product not found"}</div>;

    const discountPercentage = product.originalPrice
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
        : 0;

    return (
        <div className="min-h-screen pb-12 bg-white dark:bg-gray-900 text-gray-900 dark:text-white font-sans transition-colors duration-300">
            <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
                {/* Breadcrumb */}
                <nav className="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-4 whitespace-nowrap overflow-hidden">
                    <Link to="/" className="hover:text-primary transition">Home</Link>
                    <span className="mx-2">/</span>
                    <Link to="/shop" className="hover:text-primary transition">Shop</Link>
                    <span className="mx-2">/</span>
                    <Link to={`/shop?category=${product.category}`} className="hover:text-primary transition">{product.category}</Link>
                    <span className="mx-2">/</span>
                    <span className="text-gray-900 dark:text-white truncate max-w-[200px] font-medium">{product.name}</span>
                </nav>

                <div className="flex flex-col lg:flex-row gap-0 lg:gap-8 bg-white dark:bg-gray-900 transition-colors duration-300">
                    {/* LEFT COLUMN: Gallery */}
                    <div className="lg:w-5/12 xl:w-1/3 flex flex-col-reverse lg:flex-row gap-4 relative lg:sticky top-24 self-start">
                        {/* Thumbnail Strip */}
                        <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-y-auto lg:max-h-[500px] scrollbar-hide py-1">
                            {(product.images && product.images.length > 0 ? product.images : [product.image]).map((img, i) => (
                                <button
                                    key={i}
                                    onClick={() => setMainImage(img)}
                                    className={`relative w-16 h-16 flex-shrink-0 border rounded-sm overflow-hidden transition-all ${mainImage === img ? 'border-primary ring-1 ring-primary' : 'border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500'}`}
                                >
                                    <img src={img} alt={`View ${i}`} className="w-full h-full object-contain p-1" />
                                </button>
                            ))}
                        </div>

                        {/* Main Image Stage */}
                        <div
                            className="relative flex-1 aspect-square lg:aspect-auto lg:h-[500px] border border-gray-100 dark:border-gray-800 rounded-sm cursor-crosshair group flex items-center justify-center bg-white dark:bg-gray-800 transition-colors duration-300"
                            onMouseMove={handleMouseMove}
                            onMouseLeave={handleMouseLeave}
                        >
                            <img src={mainImage} alt={product.name} className="w-full h-full object-contain max-h-[450px]" />

                            {/* Zoom Overlay (Desktop) */}
                            <div
                                className="hidden lg:block absolute inset-0 pointer-events-none bg-no-repeat bg-white border border-gray-200 shadow-xl z-50 ml-4"
                                style={{
                                    ...zoomStyle,
                                    left: '100%',
                                    top: 0,
                                    width: '100%', // Zoom window to the right
                                    height: '100%'
                                }}
                            />

                            {/* Mobile Wishlist (Corner) */}
                            <button
                                onClick={() => toggleWishlist(product)}
                                className="lg:hidden absolute top-4 right-4 p-2 rounded-full bg-white dark:bg-gray-700 shadow-md border border-gray-100 dark:border-gray-600 text-gray-400 hover:text-red-500 z-10"
                            >
                                <Heart className={`w-5 h-5 ${isInWishlist(product._id) ? 'fill-current text-red-500' : ''}`} />
                            </button>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Product Details */}
                    <div className="flex-1 mt-6 lg:mt-0 px-1">

                        {/* Title & Reviews */}
                        <h1 className="text-xl lg:text-2xl font-medium text-gray-900 dark:text-white mb-2">{product.name}</h1>

                        <div className="flex items-center gap-3 mb-4">
                            <div className="flex items-center bg-green-700 text-white px-2 py-0.5 rounded-[4px] text-xs gap-1 font-bold shadow-sm">
                                <span>{product.rating ? product.rating.toFixed(1) : '4.0'}</span>
                                <Star className="w-3 h-3 fill-current" />
                            </div>
                            <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">{product.numReviews || 100} Ratings & Reviews</span>
                            {product.stock > 0 && product.stock < 10 && (
                                <span className="text-red-600 text-sm font-medium animate-pulse">Only {product.stock} left!</span>
                            )}
                        </div>

                        {/* Price Section */}
                        <div className="mb-6">
                            <div className="flex items-end gap-3 mb-1">
                                <span className="text-3xl font-bold text-gray-900 dark:text-white">₹{product.price.toLocaleString()}</span>
                                {product.originalPrice && product.originalPrice > product.price && (
                                    <>
                                        <span className="text-gray-500 line-through text-base translate-y-[-4px]">₹{product.originalPrice.toLocaleString()}</span>
                                        <span className="text-green-600 font-bold text-base translate-y-[-4px]">{discountPercentage}% off</span>
                                    </>
                                )}
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">+ ₹49 Secured Packaging Fee</p>
                        </div>

                        {/* Dynamic Selectors */}
                        <div className="space-y-6 mb-8">
                            {/* Color Selector */}
                            {product.colors && product.colors.length > 0 && (
                                <div className="flex items-center gap-4">
                                    <span className="text-gray-500 dark:text-gray-400 font-medium w-16 text-sm">Color</span>
                                    <div className="flex flex-wrap gap-2">
                                        {product.colors.map((color, i) => (
                                            <button
                                                key={i}
                                                onClick={() => {
                                                    setSelectedColor(color);
                                                    // Map color index to image index if available
                                                    if (product.images && product.images[i]) {
                                                        setMainImage(product.images[i]);
                                                    }
                                                }}
                                                className={`w-10 h-10 rounded-full border-2 focus:outline-none transition-transform ${selectedColor === color ? 'border-primary ring-2 ring-primary/20 scale-105' : 'border-gray-200 hover:border-gray-300'}`}
                                                style={{ backgroundColor: color }}
                                                title={color}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Size Selector */}
                            {product.sizes && product.sizes.length > 0 && (
                                <div className="flex items-start gap-4">
                                    <span className="text-gray-500 dark:text-gray-400 font-medium w-16 text-sm mt-2">Size</span>
                                    <div className="flex flex-wrap gap-2 flex-1">
                                        {product.sizes.map((size, i) => (
                                            <button
                                                key={i}
                                                onClick={() => setSelectedSize(size)}
                                                className={`min-w-[3rem] px-3 py-2 border rounded-sm text-sm font-bold transition-all ${selectedSize === size ? 'border-primary text-primary bg-primary/5 shadow-inner' : 'border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 hover:border-primary'}`}
                                            >
                                                {size}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Action Buttons (Desktop) */}
                        <div className="hidden lg:flex gap-4 mb-8">
                            <button
                                onClick={handleAddToCart}
                                disabled={product.stock <= 0}
                                className={`flex-1 py-4 px-6 uppercase font-bold text-white rounded-sm shadow-sm transition-transform active:scale-[0.98] flex items-center justify-center gap-2 ${product.stock > 0 ? (added ? 'bg-green-600' : 'bg-[#ff9f00] hover:shadow-lg') : 'bg-gray-400 cursor-not-allowed'
                                    }`}
                            >
                                <ShoppingCart className="w-5 h-5" />
                                {product.stock > 0 ? (added ? 'Added' : 'Add to Cart') : 'Out of Stock'}
                            </button>
                            <button
                                onClick={handleBuyNow}
                                disabled={product.stock <= 0}
                                className={`flex-1 py-4 px-6 uppercase font-bold text-white rounded-sm shadow-sm transition-transform active:scale-[0.98] ${product.stock > 0 ? 'bg-[#fb641b] hover:shadow-lg' : 'bg-gray-400 cursor-not-allowed'
                                    }`}
                            >
                                Buy Now
                            </button>

                            {/* Desktop Wishlist */}
                            <button
                                onClick={() => toggleWishlist(product)}
                                className={`p-4 border rounded-sm transition-colors ${isInWishlist(product._id) ? 'text-red-500 border-red-200 bg-red-50' : 'text-gray-400 border-gray-200 dark:border-gray-700 hover:text-red-500'}`}
                            >
                                <Heart className={`w-6 h-6 ${isInWishlist(product._id) ? 'fill-current' : ''}`} />
                            </button>
                        </div>

                        {/* Delivery Checker */}
                        <div className="mb-6">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-gray-500 font-medium text-sm w-16">Delivery</span>
                                <div className="border-b-2 border-primary pb-1 flex items-center group focus-within:border-blue-600">
                                    <input
                                        type="text"
                                        placeholder="Enter Pincode"
                                        maxLength={6}
                                        className="bg-transparent text-sm focus:outline-none w-32 font-medium text-gray-900 dark:text-white placeholder-gray-400"
                                        value={pincode}
                                        onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                                    />
                                    <button
                                        onClick={checkDelivery}
                                        className="text-primary text-sm font-bold ml-2 hover:text-blue-700"
                                    >
                                        Check
                                    </button>
                                </div>
                            </div>
                            <div className="ml-[80px]">
                                {deliveryStatus ? (
                                    <div className={`text-sm ${deliveryStatus.type === 'error' ? 'text-red-500' : 'text-gray-900 dark:text-white'}`}>
                                        {deliveryStatus.type === 'error' ? (
                                            deliveryStatus.message
                                        ) : (
                                            <>
                                                <span className="font-bold">{deliveryStatus.message}</span>
                                                <span className="mx-1 text-gray-300">|</span>
                                                <span className="text-green-600">{deliveryStatus.subMessage}</span>
                                            </>
                                        )}
                                    </div>
                                ) : (
                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                        Delivery by <span className="font-bold text-black dark:text-white">Mon, Dec 11</span> | <span className="text-green-600">Free</span> <span className="line-through text-gray-400">₹40</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Services Grid */}
                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8 text-sm">
                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                                <RotateCcw className="w-5 h-5 text-bg-primary" />
                                <span>7 Days Replacement</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                                <ShieldCheck className="w-5 h-5 text-bg-primary" />
                                <span>1 Year Warranty</span>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="border border-gray-100 dark:border-gray-700 rounded-lg p-4">
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Product Description</h2>
                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm">
                                {product.description}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Mobile Floating Action Bar */}
                <div className="fixed bottom-0 left-0 right-0 lg:hidden bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-2 grid grid-cols-2 gap-2 z-50">
                    <button
                        onClick={handleAddToCart}
                        className="py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-black dark:text-white font-semibold rounded-sm"
                    >
                        Add to Cart
                    </button>
                    <button
                        onClick={handleBuyNow}
                        className="py-3 bg-[#fb641b] text-white font-semibold rounded-sm"
                    >
                        Buy Now
                    </button>
                </div>

                {/* Reviews Section */}
                <div className="mt-12 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Ratings & Reviews</h2>

                    <div className="flex flex-col md:flex-row gap-8">
                        {/* Write Review - Left/Top */}
                        <div className="md:w-1/3">
                            {canReview ? (
                                <ReviewForm productId={id} onReviewAdded={handleReviewAdded} />
                            ) : (
                                <div className="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-lg border border-dashed border-gray-200 dark:border-gray-600 text-center">
                                    <h3 className="font-bold text-gray-900 dark:text-white mb-2">Write a Review</h3>
                                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                                        {user ? (
                                            reviewMessage || "You must purchase and receive this product to review it."
                                        ) : (
                                            <>
                                                Please <Link to="/login" className="text-primary hover:underline">login</Link> to write a review.
                                            </>
                                        )}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Review List - Right/Bottom */}
                        <div className="md:w-2/3">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                                {reviews.length} {reviews.length === 1 ? 'Review' : 'Reviews'}
                            </h3>
                            <ReviewList reviews={reviews} />
                        </div>
                    </div>
                </div>

                <div className="mt-12">
                    <RecentlyViewed />
                </div>
            </div>
            {/* Added padding for mobile bottom bar */}
            <div className="h-16 lg:hidden"></div>
        </div>
    );
};

export default ProductDetails;
