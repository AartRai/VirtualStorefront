const axios = require('axios');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

const API_URL = 'http://localhost:5001/api';

const verifyImageUpload = async () => {
    try {
        console.log('--- Verifying Base64 Image Upload ---');
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/locallift');

        // 1. Setup Seller
        const sellerEmail = `img_seller_${Date.now()}@test.com`;
        const sellerReg = await axios.post(`${API_URL}/auth/register`, {
            name: 'Img Seller',
            email: sellerEmail,
            password: 'password123',
            role: 'business'
        });
        const sellerToken = sellerReg.data.token;
        const config = { headers: { 'x-auth-token': sellerToken } };

        // 2. Create Product with Base64 Image
        // Tiny 1x1 red pixel GIF
        const base64Image = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

        console.log('Sending Base64 Image...');
        const prodRes = await axios.post(`${API_URL}/products`, {
            name: 'Base64 Product',
            description: 'Desc',
            category: 'Test',
            price: 100,
            stock: 10,
            images: [base64Image]
        }, config);

        const productId = prodRes.data._id;
        console.log(`Product Created: ${productId}`);

        // 3. Verify Image persistence
        const fetchedProduct = await axios.get(`${API_URL}/products/${productId}`);
        const savedImage = fetchedProduct.data.images[0];

        if (savedImage === base64Image) {
            console.log('   -> [PASS] Base64 image saved and retrieved correctly.');
        } else {
            console.log('   -> [FAIL] Image mismatch!');
            console.log('Expected:', base64Image);
            console.log('Got:', savedImage ? savedImage.substring(0, 50) + '...' : 'undefined');
        }

        process.exit(0);

    } catch (err) {
        console.error('FAILED:', err.message);
        if (err.response) console.error(err.response.data);
        process.exit(1);
    }
};

verifyImageUpload();
