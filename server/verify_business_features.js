const axios = require('axios');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Product = require('./models/Product');
const Order = require('./models/Order');
const InventoryLog = require('./models/InventoryLog');
const bcrypt = require('bcryptjs');

dotenv.config();

const API_URL = 'http://localhost:5001/api';

const verify = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/locallift');

        // 1. Setup Test User
        const email = 'verify_biz_features@test.com';
        await User.deleteOne({ email });
        const salt = await bcrypt.genSalt(10);
        const user = new User({
            name: 'Biz Verifier',
            email,
            password: await bcrypt.hash('password', salt),
            role: 'business'
        });
        await user.save();

        const loginRes = await axios.post(`${API_URL}/auth/login`, { email, password: 'password' });
        const token = loginRes.data.token;
        const config = { headers: { 'x-auth-token': token } };

        // 2. Setup Test Product
        await Product.deleteMany({ user: user._id });
        const product = new Product({
            user: user._id,
            name: 'Inventory Test Product',
            price: 50,
            category: 'Test',
            description: 'Test',
            stock: 10,
            sku: 'TEST-SKU-' + Date.now()
        });
        await product.save();

        // 3. Verify Inventory Log Route
        console.log('Testing Inventory Log...');
        await axios.post(`${API_URL}/business/inventory/log`, {
            productId: product._id,
            change: 5,
            reason: 'Restock'
        }, config);

        const updatedProduct = await Product.findById(product._id);
        if (updatedProduct.stock !== 15) throw new Error(`Stock mismatch: ${updatedProduct.stock}`);

        const logs = await InventoryLog.find({ product: product._id });
        if (logs.length !== 1) throw new Error('Log not created');
        console.log('Inventory Log Verified.');

        // 4. Verify Newsletter
        console.log('Testing Newsletter...');
        const newsRes = await axios.post(`${API_URL}/business/newsletter/send`, {
            subject: 'Test News',
            content: 'Hello',
            recipients: 'All'
        }, config);
        if (!newsRes.data.msg.includes('queued')) throw new Error('Newsletter failed');
        console.log('Newsletter Verified.');

        // 5. Verify Business Order Status Update
        console.log('Testing Order Status Update...');
        const order = new Order({
            user: user._id, // Self-purchase for simplicity
            items: [{ product: product._id, quantity: 1, price: 50 }],
            totalAmount: 50,
            status: 'Pending'
        });
        await order.save();

        await axios.put(`${API_URL}/orders/${order._id}/business-status`, { status: 'Shipped' }, config);

        const updatedOrder = await Order.findById(order._id);
        if (updatedOrder.status !== 'Shipped') throw new Error('Order status update failed');
        console.log('Order Status Update Verified.');

        console.log('ALL BUSINESS FEATURES VERIFIED.');
        process.exit();
    } catch (err) {
        console.error('VERIFICATION FAILED:', err.message);
        if (err.response) console.error(err.response.data);
        process.exit(1);
    }
};

verify();
