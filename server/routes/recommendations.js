const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Order = require('../models/Order');
const Product = require('../models/Product');
const Wishlist = require('../models/Wishlist');
const Review = require('../models/Review');
const { getAIRecommendations } = require('../utils/aiRecommender');

// @route   GET api/recommendations
// @desc    Get AI-based recommendations based on past orders, wishlist and reviews
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        // 1. Fetch user's history
        const [orders, wishlist, reviews] = await Promise.all([
            Order.find({ user: req.user.id })
                .sort({ createdAt: -1 })
                .limit(10)
                .populate('items.product'),
            Wishlist.findOne({ user: req.user.id }).populate('products'),
            Review.find({ user: req.user.id }).populate('product')
        ]);

        const userHistory = { orders, wishlist, reviews };

        // 2. Try to get AI-based recommendations
        const aiRecommendations = await getAIRecommendations(userHistory);

        if (aiRecommendations && aiRecommendations.length > 0) {
            return res.json(aiRecommendations);
        }

        console.log("No AI recommendations found or error occurred. Falling back to category-based logic.");

        // 3. Fallback: Category-based logic
        if (!orders || orders.length === 0) {
            // Fallback: Return top rated products if no history
            const fallbackProducts = await Product.find({ isDeleted: { $ne: true } })
                .sort({ rating: -1 })
                .limit(8);
            return res.json(fallbackProducts);
        }

        // Identify top categories from past orders
        const categoryCounts = {};
        const purchasedProductIds = new Set();

        orders.forEach(order => {
            order.items.forEach(item => {
                if (item.product) {
                    const category = item.product.category;
                    categoryCounts[category] = (categoryCounts[category] || 0) + 1;
                    purchasedProductIds.add(item.product._id.toString());
                }
            });
        });

        const topCategories = Object.entries(categoryCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(entry => entry[0]);

        // Query for similar products in those categories
        const recommendations = await Product.find({
            category: { $in: topCategories },
            _id: { $nin: Array.from(purchasedProductIds) },
            isDeleted: { $ne: true }
        })
            .limit(10);

        // If not enough recommendations, add some top rated ones
        const finalResults = recommendations;
        if (finalResults.length < 5) {
            const extra = await Product.find({
                _id: { $nin: [...Array.from(purchasedProductIds), ...finalResults.map(p => p._id.toString())] },
                isDeleted: { $ne: true }
            })
                .sort({ rating: -1 })
                .limit(8 - finalResults.length);

            return res.json([...finalResults, ...extra]);
        }

        res.json(finalResults);
    } catch (err) {
        console.error("Recommendations Route Error:", err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
