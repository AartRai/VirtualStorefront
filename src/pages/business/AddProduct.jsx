import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { Save, X, Upload, Image as ImageIcon, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';

const AddProduct = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        stock: '',
        category: 'Electronics',
        image: '' // Will store URL or Data URL
    });
    const [previewImage, setPreviewImage] = useState(null);
    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            handleFile(file);
        }
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleFile = (file) => {
        // Store raw file for upload
        setFormData(prev => ({ ...prev, file: file }));

        const reader = new FileReader();
        reader.onloadend = () => {
            setPreviewImage(reader.result);
            setFormData(prev => ({ ...prev, image: reader.result })); // For now using Data URL as image source
        };
        reader.readAsDataURL(file);
    };

    const handleSaveDraft = () => {
        alert('Product saved as draft!');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            let imageUrl = formData.image;

            // 1. Check if we have a raw file to upload
            if (formData.file) { // Changed logic to rely on a specific 'file' object in state
                const uploadData = new FormData();
                uploadData.append('image', formData.file);

                const uploadRes = await api.post('/upload', uploadData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                // Since uploads are served from root of server, we need full URL or relative path
                // Frontend is on 5174, Backend on 5001. 
                // We should store the relative path '/uploads/...' and let frontend handling prepending base URL, 
                // OR prepend it here. Best practice: Store relative, Resolve on display.
                // BUT for this quick fix to work with existing Components that expect full URLs or Base64:
                // Let's prepend the API Base URL's origin.
                // Assuming api.defaults.baseURL is http://localhost:5001/api, we want http://localhost:5001/uploads/...

                // Construct accessible URL
                const backendUrl = 'http://localhost:5001';
                imageUrl = `${backendUrl}${uploadRes.data.filePath}`;
            }

            // Construct payload matching the backend schema
            const payload = {
                name: formData.name,
                description: formData.description,
                price: Number(formData.price),
                stock: Number(formData.stock),
                category: formData.category,
                // Backend expects 'images' array
                images: [imageUrl || 'https://via.placeholder.com/300']
            };

            await api.post('/products', payload);
            alert('Product published successfully!');
            navigate('/business/products');
        } catch (err) {
            console.error(err);
            // safe error message extraction
            const errorMessage = err.response?.data?.message || err.response?.data?.msg || err.message || 'Failed to publish product.';
            alert(`Failed to publish product: ${errorMessage}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto py-8 px-4">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                <div>
                    <button
                        onClick={() => navigate('/business/products')}
                        className="flex items-center text-sm text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white transition mb-2"
                    >
                        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Products
                    </button>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Add New Product</h1>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <button
                        type="button"
                        onClick={handleSaveDraft}
                        className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                    >
                        Save Draft
                    </button>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Main Info */}
                <div className="lg:col-span-2 space-y-8">
                    {/* General Info Card */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 md:p-8">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">General Information</h2>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Product Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                                    placeholder="e.g. Premium Noise-Cancelling Headphones"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    required
                                    rows="6"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition resize-none"
                                    placeholder="Write a compelling description for your product..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* Pricing & Stock Card */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 md:p-8">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Pricing & Inventory</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Base Price (₹)</label>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    required
                                    min="0"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                                    placeholder="0.00"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Stock Quantity</label>
                                <input
                                    type="number"
                                    name="stock"
                                    value={formData.stock}
                                    onChange={handleChange}
                                    required
                                    min="0"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                                    placeholder="0"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column - Media & Organization */}
                <div className="space-y-8">
                    {/* Media Upload Card */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 md:p-8">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Product Media</h2>

                        <div
                            className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 ${dragActive ? 'border-primary bg-primary/5' : 'border-gray-300 dark:border-gray-600 hover:border-primary/50'}`}
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                        >
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="hidden"
                            />

                            {previewImage ? (
                                <div className="relative group">
                                    <img src={previewImage} alt="Preview" className="w-full h-48 object-cover rounded-lg shadow-sm" />
                                    <button
                                        type="button"
                                        onClick={() => { setPreviewImage(null); setFormData(p => ({ ...p, image: '' })); }}
                                        className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-md text-red-500 hover:bg-red-50 transition"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-4">
                                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                                        <ImageIcon className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                                    </div>
                                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Drag & Drop image here</p>
                                    <p className="text-xs text-gray-400 mb-4">or click to browse from device</p>
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="text-primary text-sm font-bold hover:underline"
                                    >
                                        Browse Files
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* URL Fallback */}
                        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">Or enter Image URL</label>
                            <input
                                type="url"
                                name="image"
                                value={formData.image && !formData.image.startsWith('data:') ? formData.image : ''}
                                onChange={(e) => {
                                    handleChange(e);
                                    if (e.target.value) setPreviewImage(e.target.value);
                                }}
                                className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 text-sm text-gray-900 dark:text-white focus:border-primary outline-none transition"
                                placeholder="https://..."
                            />
                        </div>
                    </div>

                    {/* Organization Card */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 md:p-8">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Organization</h2>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Category</label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition cursor-pointer"
                            >
                                <option value="Electronics">Electronics</option>
                                <option value="Fashion">Fashion</option>
                                <option value="Home">Home</option>
                                <option value="Beauty">Beauty</option>
                                <option value="Sports">Sports</option>
                                <option value="Grocery">Grocery</option>
                                <option value="Books">Books</option>
                            </select>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 rounded-xl bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold shadow-lg shadow-yellow-400/20 transition-all transform hover:-translate-y-1 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <span>Publishing...</span>
                        ) : (
                            <>
                                <CheckCircle className="w-5 h-5" />
                                Publish Product
                            </>
                        )}
                    </button>

                    <p className="text-xs text-center text-gray-400">
                        By publishing, you agree to our <a href="#" className="underline">Seller Policy</a>.
                    </p>
                </div>
            </form>
        </div>
    );
};

export default AddProduct;
