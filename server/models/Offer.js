const mongoose = require('mongoose');

const OfferSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
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
    startDate: {
        type: Date,
        default: Date.now
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
    applicableType: {
        type: String,
        enum: ['ALL', 'CATEGORY', 'PRODUCT'],
        default: 'ALL'
    },
    applicableTo: [{
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'applicableModel'
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Offer', OfferSchema);
