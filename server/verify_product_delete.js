const axios = require('axios');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Product = require('./models/Product');
const bcrypt = require('bcryptjs');

dotenv.config();

const API_URL = 'http://localhost:5001/api';

const verify = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/locallift');

        // 1. Create a Test Seller
        const email = 'test_seller_delete@test.com';
        await User.deleteOne({ email });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('password', salt);

        const user = new User({
            name: 'Test Seller',
            email,
            password: hashedPassword,
            role: 'business'
        });
        await user.save();
        console.log('Test seller created.');

        // 2. Login to get token
        const loginRes = await axios.post(`${API_URL}/auth/login`, {
            email,
            password: 'password'
        });
        const token = loginRes.data.token;
        const config = { headers: { 'x-auth-token': token } };
        console.log('Logged in.');

        // 3. Create a Test Product
        const prodRes = await axios.post(`${API_URL}/products`, {
            name: 'Delete Me Product',
            price: 100,
            category: 'Test',
            stock: 10,
            description: 'Test Desc'
        }, config);
        const productId = prodRes.data._id;
        console.log(`Product created: ${productId}`);

        // 4. Delete the Product
        console.log(`Deleting product ${productId}...`);
        await axios.delete(`${API_URL}/products/${productId}`, config);
        console.log('Delete request successful.');

        // 5. Verify Deletion in DB
        const check = await Product.findById(productId);
        if (!check) {
            console.log('VERIFICATION PASSED: Product not found in DB.');
        } else {
            console.error('VERIFICATION FAILED: Product still exists in DB.');
        }

        process.exit();
    } catch (err) {
        console.error('VERIFICATION FAILED:', err.response ? err.response.data : err.message);
        process.exit(1);
    }
};

verify();
