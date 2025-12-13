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

const verifyAdminFull = async () => {
    try {
        console.log('--- Starting Admin Full Verification ---');
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/locallift');

        // 1. Setup Seller
        const sellerEmail = `seller_full_${Date.now()}@test.com`;
        const sellerPassword = 'initialPassword123';
        console.log(`1. creating Seller: ${sellerEmail}`);

        // Cleanup
        await User.deleteOne({ email: sellerEmail });

        const sellerReg = await axios.post(`${API_URL}/auth/register`, {
            name: 'Full Verifier Seller',
            email: sellerEmail,
            password: sellerPassword,
            role: 'business'
        });
        let sellerToken = sellerReg.data.token;
        const sellerId = sellerReg.data.user.id;
        let sellerConfig = { headers: { 'x-auth-token': sellerToken } };
        console.log('   -> Seller Created & Logged In');

        // 2. Add Product (Full Details)
        console.log('2. Adding Product with Full Details...');
        const productData = {
            name: 'Pro Widget ' + Date.now(),
            description: 'A high quality test widget',
            category: 'Electronics',
            price: 1000,
            stock: 50,
            images: ['http://example.com/img1.jpg', 'http://example.com/img2.jpg'],
            // Assuming schema supports dynamic fields or we use what's available
            // If specific fields like brand/colors/sizes aren't in schema, they won't save, 
            // but we test the route accepts them. Based on previous ViewFile, Product schema structure is generic.
            // verifying schema fields typically supported in such apps:
            colors: ['Red', 'Blue'],
            sizes: ['M', 'L']
        };

        const prodRes = await axios.post(`${API_URL}/products`, productData, sellerConfig);
        const productId = prodRes.data._id;
        console.log(`   -> Product Added: ${productId}`);
        console.log(`   -> Name: ${prodRes.data.name}`);
        console.log(`   -> Price: ${prodRes.data.price}`);

        // 3. Initial Stats Check
        console.log('3. Checking Initial Stats...');
        const initStats = await axios.get(`${API_URL}/business/stats`, sellerConfig);
        console.log(`   -> Initial Revenue: ${initStats.data.totalRevenue}`);
        console.log(`   -> Initial Orders: ${initStats.data.totalOrders}`);
        if (initStats.data.totalRevenue !== 0) console.warn('WARNING: Initial revenue not 0');

        // 4. Setup Customer & Purchase
        console.log('4. Customer Purchase Flow...');
        const custEmail = `cust_full_${Date.now()}@test.com`;
        await User.deleteOne({ email: custEmail });
        const custReg = await axios.post(`${API_URL}/auth/register`, {
            name: 'Full Verifier Cust',
            email: custEmail,
            password: 'password123',
            role: 'customer'
        });
        const custToken = custReg.data.token;
        const custConfig = { headers: { 'x-auth-token': custToken } };

        // Place Order
        const orderRes = await axios.post(`${API_URL}/orders`, {
            items: [{ product: productId, quantity: 2, price: 1000 }],
            totalAmount: 2000,
            shippingAddress: { address: '123 St', city: 'City', zip: '12345', country: 'Country' },
            paymentMethod: 'Online'
        }, custConfig);
        console.log(`   -> Order Placed: ${orderRes.data._id} (Total: 2000)`);

        // 5. Verify Seller Dashboard Updates
        console.log('5. Verifying Dashboard Sync...');
        const updatedStats = await axios.get(`${API_URL}/business/stats`, sellerConfig);

        console.log(`   -> New Revenue: ${updatedStats.data.totalRevenue}`);
        console.log(`   -> New Orders: ${updatedStats.data.totalOrders}`);

        if (updatedStats.data.totalRevenue !== 2000) throw new Error(`Revenue mismatch. Expected 2000, got ${updatedStats.data.totalRevenue}`);
        if (updatedStats.data.totalOrders !== 1) throw new Error(`Order count mismatch. Expected 1, got ${updatedStats.data.totalOrders}`);
        console.log('   -> [PASS] Revenue and Orders updated correctly.');

        // Verify Inventory Update
        const productCheck = await Product.findById(productId);
        console.log(`   -> New Stock: ${productCheck.stock}`);
        if (productCheck.stock !== 48) throw new Error(`Stock mismatch. Expected 48 (50-2), got ${productCheck.stock}`);
        console.log('   -> [PASS] Stock updated correctly.');

        // 6. Verify Sales Analytics (Product-wise)
        console.log('6. Verifying Sales Analytics...');
        const topProducts = await axios.get(`${API_URL}/business/top-products`, sellerConfig);
        const topProd = topProducts.data.find(p => p._id === productId);
        if (!topProd || topProd.sales !== 2) throw new Error('Top Product analytics failed');
        console.log('   -> [PASS] Top Products analytics correct.');

        // 7. Change Password Verification
        console.log('7. Verifying Change Password...');
        const newPassword = 'newSecretPassword456';

        // Change Password
        await axios.put(`${API_URL}/auth/update-password`, {
            currentPassword: sellerPassword,
            newPassword: newPassword
        }, sellerConfig);
        console.log('   -> Password Change Request Sent.');

        // Verify Old Password Fails
        try {
            await axios.post(`${API_URL}/auth/login`, { email: sellerEmail, password: sellerPassword });
            throw new Error('Login with OLD password should have failed!');
        } catch (e) {
            if (e.response && e.response.status === 400) {
                console.log('   -> [PASS] Login with Old Password failed as expected.');
            } else {
                throw e; // Unexpected error
            }
        }

        // Verify New Password Works
        const newLogin = await axios.post(`${API_URL}/auth/login`, { email: sellerEmail, password: newPassword });
        if (newLogin.data.token) {
            console.log('   -> [PASS] Login with New Password successful.');
        } else {
            throw new Error('Login with New Password failed.');
        }

        console.log('--- ALL ADMIN CHECKS PASSED ---');
        process.exit(0);

    } catch (err) {
        console.error('VERIFICATION FAILED:', err.message);
        if (err.response) {
            console.error('API Response:', err.response.data);
            console.error('Status:', err.response.status);
        }
        process.exit(1);
    }
};

verifyAdminFull();
