const axios = require('axios');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Product = require('./models/Product');
const Order = require('./models/Order');

dotenv.config();

const API_URL = 'http://localhost:5001/api';

const verifySellerOrdersApi = async () => {
    try {
        console.log('--- Verifying Seller Orders API ---');
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/locallift');

        // 1. Register a NEW Seller
        const sellerEmail = `api_test_seller_${Date.now()}@test.com`;
        const sellerReg = await axios.post(`${API_URL}/auth/register`, {
            name: 'API Seller',
            email: sellerEmail,
            password: 'password123',
            role: 'business'
        });
        const sellerToken = sellerReg.data.token;
        const sellerId = sellerReg.data.user.id;
        const config = { headers: { 'x-auth-token': sellerToken } };
        console.log('1. Seller Created');

        // 2. Create Product
        const prodData = {
            name: 'API Product',
            description: 'Desc',
            category: 'Test',
            price: 100,
            stock: 10,
            images: ['img.jpg']
        };
        const prodRes = await axios.post(`${API_URL}/products`, prodData, config);
        const productId = prodRes.data._id;
        console.log('2. Product Created:', productId);

        // 3. Register Customer & Buy
        const custEmail = `api_test_cust_${Date.now()}@test.com`;
        const custReg = await axios.post(`${API_URL}/auth/register`, {
            name: 'API Cust',
            email: custEmail,
            password: 'pw',
            role: 'customer'
        });
        const custToken = custReg.data.token;
        const custConfig = { headers: { 'x-auth-token': custToken } };

        const orderRes = await axios.post(`${API_URL}/orders`, {
            items: [{ product: productId, quantity: 1, price: 100 }],
            totalAmount: 100,
            paymentInfo: { method: 'Online' }
        }, custConfig);
        console.log('3. Order Placed:', orderRes.data._id);

        // 4. Verification: Call GET /api/orders/business
        console.log('4. Fetching Orders via API...');
        const listRes = await axios.get(`${API_URL}/orders/business`, config);

        console.log(`   -> Status: ${listRes.status}`);
        console.log(`   -> Orders Found: ${listRes.data.length}`);

        if (listRes.data.length === 1) {
            console.log('   -> [PASS] Order found in logic.');
            console.log('   -> Order Data:', JSON.stringify(listRes.data[0], null, 2));
        } else {
            console.error('   -> [FAIL] Order NOT found via API!!!');
        }

        process.exit(0);

    } catch (err) {
        console.error('FAILED:', err.message);
        if (err.response) console.error('Response:', err.response.data);
        process.exit(1);
    }
};

verifySellerOrdersApi();
