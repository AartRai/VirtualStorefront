const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Category = require('../models/Category');

// @route   GET api/categories
// @desc    Get all categories
// @access  Public
router.get('/', async (req, res) => {
    try {
        const categories = await Category.find().sort({ name: 1 });
        res.json(categories);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/categories
// @desc    Create a category
// @access  Private (Admin only)
router.post('/', auth, async (req, res) => {
    try {
        // Check for admin role (Assuming req.user is populated by auth middleware)
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admin only.' });
        }

        const { name, image } = req.body;

        let category = await Category.findOne({ name });
        if (category) {
            return res.status(400).json({ message: 'Category already exists' });
        }

        category = new Category({
            name,
            image
        });

        await category.save();
        res.json(category);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/categories/:id
// @desc    Delete a category
// @access  Private (Admin only)
router.delete('/:id', auth, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admin only.' });
        }

        const category = await Category.findById(req.params.id);

        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        await category.deleteOne();
        res.json({ message: 'Category removed' });
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.status(500).send('Server Error');
    }
});

module.exports = router;
