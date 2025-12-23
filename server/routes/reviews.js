const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Review = require('../models/Review');
const Product = require('../models/Product');
const Order = require('../models/Order');

// @route   POST api/reviews
// @desc    Add a review
// @access  Private
router.post('/', auth, async (req, res) => {
    const { productId, rating, comment } = req.body;

    try {
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Check if user already reviewed
        const alreadyReviewed = await Review.findOne({ user: req.user.id, product: productId });
        if (alreadyReviewed) {
            return res.status(400).json({ message: 'Product already reviewed' });
        }

        // Check if user bought product and it is delivered
        const hasBought = await Order.findOne({
            user: req.user.id,
            'items.product': productId,
            status: 'Delivered'
        });

        if (!hasBought) {
            return res.status(400).json({ message: 'You must purchase and receive this product to review it.' });
        }

        const review = new Review({
            user: req.user.id,
            product: productId,
            rating: Number(rating),
            comment
        });

        await review.save();

        // Update Product Rating
        const reviews = await Review.find({ product: productId });
        const numReviews = reviews.length;
        const avgRating = reviews.reduce((acc, item) => item.rating + acc, 0) / numReviews;

        product.rating = avgRating;
        product.numReviews = numReviews;
        await product.save();

        res.status(201).json(review);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/reviews/can-review/:productId
// @desc    Check if user can review a product
// @access  Private
router.get('/can-review/:productId', auth, async (req, res) => {
    try {
        const { productId } = req.params;

        // 1. Check if already reviewed
        const alreadyReviewed = await Review.findOne({ user: req.user.id, product: productId });
        if (alreadyReviewed) {
            return res.json({ canReview: false, reason: 'You have already reviewed this product.' });
        }

        // 2. Check if purchased and delivered
        const order = await Order.findOne({
            user: req.user.id,
            'items.product': productId,
            status: 'Delivered'
        });

        if (!order) {
            return res.json({ canReview: false, reason: 'You haven\'t purchased this product yet.' });
        }

        res.json({ canReview: true });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/reviews/product/:productId
// @desc    Get reviews for a product
// @access  Public
router.get('/product/:productId', async (req, res) => {
    try {
        const reviews = await Review.find({ product: req.params.productId })
            .populate('user', 'name')
            .sort({ createdAt: -1 });
        res.json(reviews);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
