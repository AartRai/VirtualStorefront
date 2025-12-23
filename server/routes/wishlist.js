const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Wishlist = require('../models/Wishlist');
const Product = require('../models/Product');

// @route   GET api/wishlist
// @desc    Get user's wishlist
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        let wishlist = await Wishlist.findOne({ user: req.user.id }).populate('products');

        if (!wishlist) {
            // Create empty wishlist if not exists
            wishlist = new Wishlist({ user: req.user.id, products: [] });
            await wishlist.save();
        }

        res.json(wishlist.products);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/wishlist/add/:productId
// @desc    Add product to wishlist
// @access  Private
router.post('/add/:productId', auth, async (req, res) => {
    try {
        const productId = req.params.productId;

        // Verify product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ msg: 'Product not found' });
        }

        let wishlist = await Wishlist.findOne({ user: req.user.id });

        if (!wishlist) {
            wishlist = new Wishlist({ user: req.user.id, products: [productId] });
        } else {
            // Check if product already in wishlist
            if (wishlist.products.includes(productId)) {
                return res.status(400).json({ msg: 'Product already in wishlist' });
            }
            wishlist.products.push(productId);
        }

        await wishlist.save();

        // Return populated products? Or just the updated list Ids? 
        // Frontend likely expects full product objects if it replaces state.
        // Let's populate to be safe and consistent with GET.
        await wishlist.populate('products');

        res.json(wishlist.products);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/wishlist/remove/:productId
// @desc    Remove product from wishlist
// @access  Private
router.delete('/remove/:productId', auth, async (req, res) => {
    try {
        const wishlist = await Wishlist.findOne({ user: req.user.id });

        if (!wishlist) {
            return res.status(404).json({ msg: 'Wishlist not found' });
        }

        // Filter out the product
        wishlist.products = wishlist.products.filter(
            (prod) => prod.toString() !== req.params.productId
        );

        await wishlist.save();
        await wishlist.populate('products');

        res.json(wishlist.products);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
