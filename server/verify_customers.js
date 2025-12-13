const axios = require('axios');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Product = require('./models/Product');
const Order = require('./models/Order');
const bcrypt = require('bcryptjs');

dotenv.config();

const API_URL = 'http://localhost:5001/api';

const verify = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/locallift');

        // 1. Setup Test Vendor
        const email = 'customer_test_vendor@test.com';
        await User.deleteOne({ email });
        const salt = await bcrypt.genSalt(10);
        const vendor = new User({
            name: 'Customer Test Vendor',
            email,
            password: await bcrypt.hash('password', salt),
            role: 'business'
        });
        await vendor.save();

        const loginRes = await axios.post(`${API_URL}/auth/login`, { email, password: 'password' });
        const token = loginRes.data.token;
        const config = { headers: { 'x-auth-token': token } };

        // 2. Setup Test Product
        await Product.deleteMany({ user: vendor._id });
        const product = new Product({
            user: vendor._id,
            name: 'Cust Test Prod',
            price: 100,
            category: 'Test',
            description: 'Test',
            stock: 100
        });
        await product.save();

        // 3. Setup Test Customer and Order
        const customerEmail = 'buyer@test.com';
        await User.deleteOne({ email: customerEmail });
        const customer = new User({
            name: 'Test Buyer',
            email: customerEmail,
            password: await bcrypt.hash('password', salt),
            role: 'customer'
        });
        await customer.save();

        const order = new Order({
            user: customer._id,
            items: [{ product: product._id, quantity: 2, price: 100 }], // Total 200
            totalAmount: 200,
            status: 'Delivered'
        });
        await order.save();

        // 4. Verify API
        console.log('Fetching customers...');
        const res = await axios.get(`${API_URL}/business/customers`, config);

        console.log('Customers found:', res.data.length);
        if (res.data.length !== 1) throw new Error('Expected 1 customer');

        const cust = res.data[0];
        if (cust.totalSpent !== 200) throw new Error(`Expected 200 spend, got ${cust.totalSpent}`);
        if (cust.totalOrders !== 1) throw new Error(`Expected 1 order, got ${cust.totalOrders}`);

        console.log('VERIFICATION PASSED: Customer aggregation correct.');
        process.exit();
    } catch (err) {
        console.error('VERIFICATION FAILED:', err.message);
        if (err.response) console.error(err.response.data);
        process.exit(1);
    }
};

verify();
