const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product'
            },
            quantity: {
                type: Number,
                required: true,
                default: 1
            },
            price: {
                type: Number,
                required: true
            },
            name: String,
            image: String
        }
    ],
    totalAmount: {
        type: Number,
        required: true
    },
    subTotal: {
        type: Number
    },
    discount: {
        type: Number,
        default: 0
    },
    couponApplied: {
        type: String
    },
    status: {
        type: String,
        enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
        default: 'Pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    paymentInfo: {
        id: String,
        status: String,
        method: String
    },
    timeline: [
        {
            status: String,
            date: { type: Date, default: Date.now },
            note: String
        }
    ],
    address: {
        fullName: String,
        street: String,
        city: String,
        state: String,
        zipCode: String,
        country: String,
        mobile: String
    },
    returnStatus: {
        type: String,
        enum: ['None', 'Requested', 'Approved', 'Rejected'],
        default: 'None'
    },
    returnReason: String,
    exchangeStatus: {
        type: String,
        enum: ['None', 'Requested', 'Approved', 'Rejected', 'Completed'],
        default: 'None'
    },
    exchangeReason: String,
    cancelReason: String,
});

module.exports = mongoose.model('Order', OrderSchema);
