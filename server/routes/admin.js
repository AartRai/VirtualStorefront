const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const Review = require('../models/Review');
const bcrypt = require('bcryptjs');

// Middleware to check if user is admin
const adminAuth = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Access denied. Admin only.' });
    }
};

// @route   GET api/admin/stats
// @desc    Get global statistics for admin dashboard
// @access  Private (Admin only)
router.get('/stats', [auth, adminAuth], async (req, res) => {
    try {
        // 1. Total Sales
        const salesAgg = await Order.aggregate([
            { $group: { _id: null, total: { $sum: '$totalAmount' } } }
        ]);
        const totalSales = salesAgg.length > 0 ? salesAgg[0].total : 0;

        // 2. Total Orders
        const totalOrders = await Order.countDocuments();

        // 3. Total Products
        const totalProducts = await Product.countDocuments();

        // 4. Total Users
        const totalUsers = await User.countDocuments();

        // 5. Sales History (Previous 12 months)
        const salesHistory = await Order.aggregate([
            {
                $match: {
                    createdAt: { $gte: new Date(new Date().setFullYear(new Date().getFullYear() - 1)) }
                }
            },
            {
                $group: {
                    _id: { $month: "$createdAt" },
                    sales: { $sum: "$totalAmount" }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // 6. Order Status Distribution
        const orderStatusDist = await Order.aggregate([
            { $group: { _id: "$status", count: { $sum: 1 } } }
        ]);

        // 7. Stock Status
        const inStock = await Product.countDocuments({ stock: { $gt: 0 } });
        const outOfStock = await Product.countDocuments({ stock: 0 });

        res.json({
            sales: totalSales,
            orders: totalOrders,
            products: totalProducts,
            users: totalUsers,
            salesHistory,
            orderStatusDist,
            stockStatus: { inStock, outOfStock }
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/admin/users
// @desc    Get all users
// @access  Private (Admin only)
router.get('/users', [auth, adminAuth], async (req, res) => {
    try {
        const users = await User.find().select('-password').sort({ date: -1 });
        res.json(users);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/admin/users/:id
// @desc    Delete user
// @access  Private (Admin only)
router.delete('/users/:id', [auth, adminAuth], async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: 'User deleted' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/admin/reviews
// @desc    Get all reviews
// @access  Private (Admin only)
router.get('/reviews', [auth, adminAuth], async (req, res) => {
    try {
        const reviews = await Review.find()
            .populate('user', 'name')
            .populate('product', 'name')
            .sort({ createdAt: -1 });
        res.json(reviews);
    } catch (err) {
        console.error(err.message);
        res.json([]);
    }
});

// @route   DELETE api/admin/reviews/:id
// @desc    Delete review
// @access  Private (Admin only)
router.delete('/reviews/:id', [auth, adminAuth], async (req, res) => {
    try {
        await Review.findByIdAndDelete(req.params.id);
        res.json({ message: 'Review deleted' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/admin/profile
// @desc    Update admin profile
// @access  Private (Admin only)
router.put('/profile', [auth, adminAuth], async (req, res) => {
    try {
        const { name, currentPassword, newPassword } = req.body;
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        if (name) user.name = name;

        if (newPassword && currentPassword) {
            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if (!isMatch) {
                return res.status(400).json({ msg: 'Invalid current password' });
            }
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(newPassword, salt);
        }

        await user.save();
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
