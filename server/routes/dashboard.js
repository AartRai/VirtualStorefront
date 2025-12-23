const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Product = require('../models/Product');
const Order = require('../models/Order');
const User = require('../models/User');

// @route   GET api/dashboard/stats
// @desc    Get dashboard statistics for the logged-in business user
// @access  Private
router.get('/stats', auth, async (req, res) => {
    try {
        const userId = req.user.id;

        // 1. Total Products
        const totalProducts = await Product.countDocuments({ user: userId });

        // 2. Total Orders (Orders containing my products)
        const myProducts = await Product.find({ user: userId }).select('_id');
        const productIds = myProducts.map(p => p._id);
        const totalOrders = await Order.countDocuments({ 'items.product': { $in: productIds } });

        // 3. Total Sales (Complex aggregation or rough estimate)
        // Aggregation to sum price of ONLY items belonging to this vendor in those orders
        const salesAgg = await Order.aggregate([
            { $match: { 'items.product': { $in: productIds } } },
            { $unwind: '$items' },
            { $match: { 'items.product': { $in: productIds } } },
            { $group: { _id: null, total: { $sum: { $multiply: ['$items.price', '$items.quantity'] } } } }
        ]);
        const totalSales = salesAgg.length > 0 ? salesAgg[0].total : 0;

        // 4. Total Users (Number of unique customers who bought my products)
        const distinctUsers = await Order.distinct('user', { 'items.product': { $in: productIds } });
        const totalUsers = distinctUsers.length;

        // 5. Sales History (Last 6 months)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const salesHistory = await Order.aggregate([
            {
                $match: {
                    createdAt: { $gte: sixMonthsAgo },
                    'items.product': { $in: productIds }
                }
            },
            { $unwind: '$items' },
            { $match: { 'items.product': { $in: productIds } } },
            {
                $group: {
                    _id: { $month: "$createdAt" },
                    sales: { $sum: { $multiply: ['$items.price', '$items.quantity'] } }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // 6. Sales by Category
        // Need to join with Product collection to get category
        const categoryStats = await Order.aggregate([
            { $match: { 'items.product': { $in: productIds } } },
            { $unwind: '$items' },
            { $match: { 'items.product': { $in: productIds } } },
            {
                $lookup: {
                    from: 'products',
                    localField: 'items.product',
                    foreignField: '_id',
                    as: 'productDetails'
                }
            },
            { $unwind: '$productDetails' },
            {
                $group: {
                    _id: "$productDetails.category",
                    value: { $sum: { $multiply: ['$items.price', '$items.quantity'] } }
                }
            }
        ]);

        // 7. Top 5 Products
        const topProducts = await Order.aggregate([
            { $match: { 'items.product': { $in: productIds } } },
            { $unwind: '$items' },
            { $match: { 'items.product': { $in: productIds } } },
            {
                $lookup: {
                    from: 'products',
                    localField: 'items.product',
                    foreignField: '_id',
                    as: 'productDetails'
                }
            },
            { $unwind: '$productDetails' },
            {
                $group: {
                    _id: "$productDetails.name",
                    revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
                    quantity: { $sum: "$items.quantity" }
                }
            },
            { $sort: { revenue: -1 } },
            { $limit: 5 }
        ]);


        res.json({
            totalProducts,
            totalOrders,
            totalSales,
            totalUsers,
            salesHistory,
            categoryStats,
            topProducts
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
