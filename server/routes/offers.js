const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Offer = require('../models/Offer');

// @route   GET api/offers
// @desc    Get all offers
// @access  Public (or Private depending on needs, currently Public for checkout)
router.get('/', async (req, res) => {
    try {
        const offers = await Offer.find().sort({ createdAt: -1 });
        res.json(offers);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/offers
// @desc    Create an offer
// @access  Private (Admin only)
router.post('/', auth, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admin only.' });
        }

        const { code, discountValue, discountType, expiryDate, minOrderValue } = req.body;

        let offer = await Offer.findOne({ code });
        if (offer) {
            return res.status(400).json({ message: 'Offer code already exists' });
        }

        offer = new Offer({
            code,
            discountValue,
            discountType,
            expiryDate,
            minOrderValue
        });

        await offer.save();
        res.json(offer);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/offers/:id
// @desc    Delete an offer
// @access  Private (Admin only)
router.delete('/:id', auth, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admin only.' });
        }

        const offer = await Offer.findById(req.params.id);

        if (!offer) {
            return res.status(404).json({ message: 'Offer not found' });
        }

        await offer.deleteOne();
        res.json({ message: 'Offer removed' });
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Offer not found' });
        }
        res.status(500).send('Server Error');
    }
});

module.exports = router;
