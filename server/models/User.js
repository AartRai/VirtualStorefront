const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        default: '',
    },
    avatar: {
        type: String,
        default: ''
    },
    businessAddress: {
        type: String,
        default: ''
    },
    addresses: [{
        name: String,
        street: String,
        city: String,
        state: String,
        zip: String,
        mobile: String,
        default: { type: Boolean, default: false }
    }],
    role: {
        type: String,
        enum: ['customer', 'business', 'admin'],
        default: 'customer',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
});

module.exports = mongoose.model('User', UserSchema);
