const mongoose = require('mongoose');

const InventoryLogSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    change: {
        type: Number, // Positive for add, negative for remove
        required: true
    },
    previousStock: {
        type: Number,
        required: true
    },
    newStock: {
        type: Number,
        required: true
    },
    reason: {
        type: String,
        default: 'Manual Update'
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('InventoryLog', InventoryLogSchema);
