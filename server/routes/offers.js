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

        const { name, code, discountValue, discountType, startDate, expiryDate, minOrderValue, applicableType, applicableTo } = req.body;

        let offer = await Offer.findOne({ code });
        if (offer) {
            return res.status(400).json({ message: 'Offer code already exists' });
        }

        offer = new Offer({
            name,
            code,
            discountValue,
            discountType,
            startDate,
            expiryDate,
            minOrderValue,
            applicableType,
            applicableTo
        });

        await offer.save();
        res.json(offer);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/offers/:id
// @desc    Update an offer
// @access  Private (Admin only)
router.put('/:id', auth, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admin only.' });
        }

        const { name, code, discountValue, discountType, startDate, expiryDate, minOrderValue, status, applicableType, applicableTo } = req.body;

        let offer = await Offer.findById(req.params.id);
        if (!offer) {
            return res.status(404).json({ message: 'Offer not found' });
        }

        // Check if code is being changed and if it conflicts
        if (code && code !== offer.code) {
            const existing = await Offer.findOne({ code });
            if (existing) return res.status(400).json({ message: 'Offer code already exists' });
        }

        offer.name = name || offer.name;
        offer.code = code || offer.code;
        offer.discountValue = discountValue || offer.discountValue;
        offer.discountType = discountType || offer.discountType;
        offer.startDate = startDate || offer.startDate;
        offer.expiryDate = expiryDate || offer.expiryDate;
        offer.minOrderValue = minOrderValue || offer.minOrderValue;
        offer.status = status || offer.status;
        offer.applicableType = applicableType || offer.applicableType;
        offer.applicableTo = applicableTo || offer.applicableTo;

        await offer.save();
        res.json(offer);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/offers/validate
// @desc    Validate offer and return discount
// @access  Private
router.post('/validate', auth, async (req, res) => {
    const { code, cartTotal, items } = req.body;

    try {
        const offer = await Offer.findOne({ code, status: 'ACTIVE' });

        if (!offer) {
            return res.status(400).json({ message: 'Invalid or inactive offer code' });
        }

        const now = new Date();
        if (new Date(offer.startDate) > now || new Date(offer.expiryDate) < now) {
            return res.status(400).json({ message: 'Offer is expired or not yet active' });
        }

        if (cartTotal < offer.minOrderValue) {
            return res.status(400).json({ message: `Minimum order value of ₹${offer.minOrderValue} required` });
        }

        // Logic check for applicable items would go here
        // For now, we assume global applicability or specific logic
        // Simple logic for verifying applicableType

        let discount = 0;
        if (offer.discountType === 'PERCENTAGE') {
            discount = (cartTotal * offer.discountValue) / 100;
        } else {
            discount = offer.discountValue;
        }

        res.json({
            success: true,
            discountAmount: discount,
            message: 'Offer applied'
        });

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
