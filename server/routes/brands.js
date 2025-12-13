const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Brand = require('../models/Brand');

// @route   GET api/brands
// @desc    Get all brands
// @access  Public
router.get('/', async (req, res) => {
    try {
        const brands = await Brand.find().sort({ name: 1 });
        res.json(brands);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/brands
// @desc    Create a brand
// @access  Private (Admin only)
router.post('/', auth, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admin only.' });
        }

        const { name, logo } = req.body;

        let brand = await Brand.findOne({ name });
        if (brand) {
            return res.status(400).json({ message: 'Brand already exists' });
        }

        brand = new Brand({
            name,
            logo
        });

        await brand.save();
        res.json(brand);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/brands/:id
// @desc    Delete a brand
// @access  Private (Admin only)
router.delete('/:id', auth, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admin only.' });
        }

        const brand = await Brand.findById(req.params.id);

        if (!brand) {
            return res.status(404).json({ message: 'Brand not found' });
        }

        await brand.deleteOne();
        res.json({ message: 'Brand removed' });
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Brand not found' });
        }
        res.status(500).send('Server Error');
    }
});

module.exports = router;
