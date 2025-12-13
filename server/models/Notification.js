const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: ['order', 'stock', 'system', 'cancellation'],
        default: 'system'
    },
    message: {
        type: String,
        required: true
    },
    read: {
        type: Boolean,
        default: false
    },
    link: {
        type: String, // Optional URL to redirect to (e.g. /business/orders)
        default: ''
    }
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
