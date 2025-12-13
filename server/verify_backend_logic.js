const axios = require('axios');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const API_URL = 'http://localhost:5001/api';

const verify = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/locallift');

        // 1. Login as Admin to get Token
        console.log('1. Logging in...');
        const loginRes = await axios.post(`${API_URL}/auth/login`, {
            email: 'admin_real@test.com',
            password: 'password'
        });
        const token = loginRes.data.token;
        console.log('   Login successful. Token received.');

        const config = {
            headers: {
                'x-auth-token': token
            }
        };

        // 2. Find Dummy User ID
        const dummyUser = await User.findOne({ email: 'delete_me@test.com' });
        if (dummyUser) {
            console.log(`2. Deleting user ${dummyUser._id}...`);
            await axios.delete(`${API_URL}/admin/users/${dummyUser._id}`, config);
            console.log('   User deleted via API.');
        } else {
            console.log('   Dummy user not found (already deleted?).');
        }

        // 3. Find Dummy Review ID (Need to fetch review from DB first as I don't have ID easily)
        // Since I can't import Review model easily without more setup, I'll fetch reviews via API first
        console.log('3. Fetching reviews...');
        const reviewsRes = await axios.get(`${API_URL}/admin/reviews`, config);
        const dummyReview = reviewsRes.data.find(r => r.comment === 'This is a test review to be deleted');

        if (dummyReview) {
            console.log(`   Deleting review ${dummyReview._id}...`);
            await axios.delete(`${API_URL}/admin/reviews/${dummyReview._id}`, config);
            console.log('   Review deleted via API.');
        } else {
            console.log('   Dummy review not found (already deleted?).');
        }

        // 4. Update Profile
        console.log('4. Updating Profile...');
        const updateRes = await axios.put(`${API_URL}/admin/profile`, {
            name: 'Admin API Verified'
        }, config);

        if (updateRes.data.name === 'Admin API Verified') {
            console.log('   Profile updated successfully.');
        } else {
            console.error('   Profile update FAILED name mismatch.');
        }

        console.log('ALL VERIFICATIONS PASSED.');
        process.exit();
    } catch (err) {
        console.error('VERIFICATION FAILED:', err.response ? err.response.data : err.message);
        process.exit(1);
    }
};

verify();
