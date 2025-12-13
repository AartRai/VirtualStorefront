const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Product = require('../models/Product');

// @route   GET api/products/my-products
// @desc    Get current user's products
// @access  Private
router.get('/my-products', auth, async (req, res) => {
    try {
        const products = await Product.find({
            user: req.user.id,
            isDeleted: { $ne: true }
        }).sort({ createdAt: -1 });
        res.json(products);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/products
// @desc    Get all products
// @access  Public
router.get('/', async (req, res) => {
    try {
        const products = await Product.find({ isDeleted: { $ne: true } }).sort({ createdAt: -1 });
        res.json(products);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/products/:id
// @desc    Get product by ID
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product || product.isDeleted) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json(product);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(500).send('Server Error');
    }
});

// ... (POST and PUT routes remain mostly same, verified below) ...

// @route   POST api/products
// @desc    Create a product
// @access  Private
router.post('/', auth, async (req, res) => {
    const { name, description, category, price, stock, images, colors, sizes, brand } = req.body;

    try {
        const newProduct = new Product({
            user: req.user.id,
            name,
            description,
            category,
            price,
            stock,
            images,
            colors,
            sizes,
            shop: brand // Mapping brand to shop in schema if needed, or just relying on flexible fields if added
        });

        // Dynamic SKU if needed
        if (!newProduct.sku) {
            newProduct.sku = `SKU-${Date.now()}`;
        }

        const product = await newProduct.save();

        res.json(product);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/products/:id
// @desc    Update a product
// @access  Private
router.put('/:id', auth, async (req, res) => {
    const { name, description, category, price, stock, images } = req.body;

    // Build product object
    const productFields = {};
    if (name) productFields.name = name;
    if (description) productFields.description = description;
    if (category) productFields.category = category;
    if (price) productFields.price = price;
    if (stock) productFields.stock = stock;
    if (images) productFields.images = images;

    try {
        let product = await Product.findById(req.params.id);

        if (!product) return res.status(404).json({ message: 'Product not found' });

        // Make sure user owns product
        if (product.user && product.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        product = await Product.findByIdAndUpdate(
            req.params.id,
            { $set: productFields },
            { new: true }
        );

        res.json(product);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/products/:id
// @desc    Soft Delete a product
// @access  Private
router.delete('/:id', auth, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Check user
        if (product.user && product.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        // SOFT DELETE
        product.isDeleted = true;
        await product.save();

        res.json({ message: 'Product removed' });
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(500).send('Server Error');
    }
});

module.exports = router;
