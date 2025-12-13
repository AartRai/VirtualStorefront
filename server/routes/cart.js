const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// @route   GET api/cart
// @desc    Get user cart
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        let cart = await Cart.findOne({ user: req.user.id }).populate('items.product');
        if (!cart) {
            cart = new Cart({ user: req.user.id, items: [] });
            await cart.save();
        }
        res.json(cart);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/cart
// @desc    Add item to cart
// @access  Private
router.post('/', auth, async (req, res) => {
    const { productId, quantity } = req.body;

    try {
        let cart = await Cart.findOne({ user: req.user.id });

        if (!cart) {
            cart = new Cart({ user: req.user.id, items: [] });
        }

        // Check if product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Check if item already in cart
        const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);

        if (itemIndex > -1) {
            cart.items[itemIndex].quantity += quantity || 1;
        } else {
            cart.items.push({ product: productId, quantity: quantity || 1 });
        }

        cart.updatedAt = Date.now();
        await cart.save();

        // Populate product details before sending response
        await cart.populate('items.product');

        res.json(cart);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/cart/:productId
// @desc    Remove item from cart
// @access  Private
router.delete('/:productId', auth, async (req, res) => {
    try {
        let cart = await Cart.findOne({ user: req.user.id });

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        cart.items = cart.items.filter(item => item.product.toString() !== req.params.productId);

        cart.updatedAt = Date.now();
        await cart.save();

        await cart.populate('items.product');
        res.json(cart);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/cart/:productId
// @desc    Update item quantity
// @access  Private
router.put('/:productId', auth, async (req, res) => {
    const { quantity } = req.body;

    try {
        let cart = await Cart.findOne({ user: req.user.id });

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const itemIndex = cart.items.findIndex(item => item.product.toString() === req.params.productId);

        if (itemIndex > -1) {
            if (quantity > 0) {
                cart.items[itemIndex].quantity = quantity;
            } else {
                // Remove item if quantity is 0 or less
                cart.items.splice(itemIndex, 1);
            }
        } else {
            return res.status(404).json({ message: 'Item not found in cart' });
        }

        cart.updatedAt = Date.now();
        await cart.save();

        await cart.populate('items.product');
        res.json(cart);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
