const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');

// Register
router.post('/register', async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
        // Check if user exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create new user instance
        user = new User({
            name,
            email,
            password,
            role: role || 'customer'
        });

        // Hash password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        // Save user to database
        await user.save();

        // Create token
        const payload = {
            user: {
                id: user.id,
                role: user.role
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET || 'secret',
            { expiresIn: '1h' },
            (err, token) => {
                if (err) throw err;
                res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    console.log('Login attempt for:', email);

    try {
        // Check user
        let user = await User.findOne({ email });
        if (!user) {
            console.log('User not found');
            return res.status(400).json({ message: 'Invalid Credentials' });
        }
        console.log('User found:', user.email);

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log('Password mismatch');
            return res.status(400).json({ message: 'Invalid Credentials' });
        }
        console.log('Password matched');

        // Create token
        const payload = {
            user: {
                id: user.id,
                role: user.role
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET || 'secret',
            { expiresIn: '1h' },
            (err, token) => {
                if (err) throw err;
                res.json({
                    token,
                    user: {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        role: user.role,
                        addresses: user.addresses
                    }
                });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

const sendEmail = require('../utils/sendEmail');

// Forgot Password
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Get Reset Token
        const crypto = require('crypto');
        const resetToken = crypto.randomBytes(20).toString('hex');

        // Hash token and set to resetPasswordToken field
        user.resetPasswordToken = crypto
            .createHash('sha256')
            .update(resetToken)
            .digest('hex');

        // Set expire (10 minutes)
        user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

        await user.save();

        // Create reset url
        const resetUrl = `http://localhost:5173/auth/reset-password/${resetToken}`;

        const message = `
            You have requested a password reset. Please click the link below to verify your email and set a new password:

            ${resetUrl}

            If you did not make this request, please ignore changed this email.
        `;

        console.log("Email Message being sent:", message); // Debug log to see content

        try {
            await sendEmail({
                email: user.email,
                subject: 'Password Reset Token',
                message
            });

            res.status(200).json({ success: true, data: 'Email sent' });
        } catch (err) {
            console.error(err);
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            await user.save();
            return res.status(500).json({ message: 'Email could not be sent' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Reset Password
router.put('/reset-password/:resetToken', async (req, res) => {
    const crypto = require('crypto');

    // Get hashed token
    const resetPasswordToken = crypto
        .createHash('sha256')
        .update(req.params.resetToken)
        .digest('hex');

    try {
        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid Token' });
        }

        // Set new password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(req.body.password, salt);

        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        res.status(200).json({ success: true, data: 'Password updated success' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Get User Data
router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Update Profile
router.put('/profile', auth, async (req, res) => {
    const { name, phone, avatar, businessAddress } = req.body;

    try {
        let user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (name) user.name = name;
        if (phone) user.phone = phone;
        if (avatar) user.avatar = avatar;
        if (businessAddress) user.businessAddress = businessAddress;

        await user.save();

        res.json({
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            avatar: user.avatar,
            role: user.role,
            addresses: user.addresses,
            businessAddress: user.businessAddress
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Add Address
router.post('/address', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const { name, street, city, state, zip, mobile, default: isDefault } = req.body;

        if (!name || !street || !city || !state || !zip || !mobile) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const newAddress = { name, street, city, state, zip, mobile, default: isDefault || false };

        // If set as default, unset others
        if (newAddress.default) {
            user.addresses.forEach(addr => addr.default = false);
        } else if (user.addresses.length === 0) {
            // First address is always default
            newAddress.default = true;
        }

        user.addresses.push(newAddress);
        await user.save();
        res.json(user.addresses);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Update Address
router.put('/address/:id', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const addressIndex = user.addresses.findIndex(addr => addr._id.toString() === req.params.id);

        if (addressIndex === -1) {
            return res.status(404).json({ message: 'Address not found' });
        }

        const { name, street, city, state, zip, mobile, default: isDefault } = req.body;

        // Update fields
        const address = user.addresses[addressIndex];
        if (name) address.name = name;
        if (street) address.street = street;
        if (city) address.city = city;
        if (state) address.state = state;
        if (zip) address.zip = zip;
        if (mobile) address.mobile = mobile;

        if (isDefault !== undefined) {
            if (isDefault) {
                user.addresses.forEach(addr => addr.default = false);
            }
            address.default = isDefault;
        }

        await user.save();
        res.json(user.addresses);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});


// Delete Address
router.delete('/address/:id', auth, async (req, res) => {
    try {
        console.log(`[DEBUG] Delete Address Request - User: ${req.user.id}, AddressID: ${req.params.id}`);
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if address exists
        const addressExists = user.addresses.some(addr => addr._id.toString() === req.params.id);
        if (!addressExists) {
            console.log(`[DEBUG] Address with ID ${req.params.id} not found in user's list.`);
            return res.status(404).json({ message: 'Address not found' });
        }

        // Use Mongoose pull to remove the subdocument by ID
        user.addresses.pull(req.params.id);

        await user.save();
        console.log(`[DEBUG] Address deleted successfully. Remaining addresses: ${user.addresses.length}`);

        res.json(user.addresses);
    } catch (err) {
        console.error("Delete Address Error:", err.message);
        res.status(500).send('Server error');
    }
});

// Update Password (Authenticated)
router.put('/update-password', auth, async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check current password
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Incorrect current password' });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();

        res.json({ message: 'Password updated successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
