const mongoose = require('mongoose');

const OfferSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        trim: true
    },
    discountValue: {
        type: Number,
        required: true
    },
    discountType: {
        type: String,
        enum: ['PERCENTAGE', 'FIXED'],
        default: 'PERCENTAGE'
    },
    expiryDate: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['ACTIVE', 'INACTIVE'],
        default: 'ACTIVE'
    },
    minOrderValue: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Offer', OfferSchema);
