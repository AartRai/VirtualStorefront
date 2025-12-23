const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    originalPrice: {
        type: Number
    },
    colors: [
        {
            type: String
        }
    ],
    sizes: [
        {
            type: String
        }
    ],
    stock: {
        type: Number,
        default: 0
    },
    rating: {
        type: Number,
        default: 0
    },
    numReviews: {
        type: Number,
        default: 0
    },
    shop: {
        type: String
    },
    image: {
        type: String
    },
    images: [
        {
            type: String
        }
    ],
    sku: {
        type: String,
        unique: true,
        sparse: true
    },
    lowStockThreshold: {
        type: Number,
        default: 5
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Product', ProductSchema);
