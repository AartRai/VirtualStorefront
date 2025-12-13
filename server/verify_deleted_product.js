const axios = require('axios');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const API_URL = 'http://localhost:5001/api';

const verifyDeletedProduct = async () => {
    try {
        console.log('--- Verifying Deleted Product Order Visibility ---');
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/locallift');

        // 1. Setup
        const sellerEmail = `del_prod_seller_${Date.now()}@test.com`;
        const sellerReg = await axios.post(`${API_URL}/auth/register`, {
            name: 'Del Prod Seller',
            email: sellerEmail,
            password: 'password123',
            role: 'business'
        });
        const sellerToken = sellerReg.data.token;
        const config = { headers: { 'x-auth-token': sellerToken } };

        const prodRes = await axios.post(`${API_URL}/products`, {
            name: 'To Be Deleted',
            description: 'Desc',
            category: 'Test',
            price: 100,
            stock: 10,
            images: ['img']
        }, config);
        const productId = prodRes.data._id;

        const custEmail = `del_prod_cust_${Date.now()}@test.com`;
        const custReg = await axios.post(`${API_URL}/auth/register`, {
            name: 'Cust',
            email: custEmail,
            password: 'pw',
            role: 'customer'
        });
        const custToken = custReg.data.token;

        await axios.post(`${API_URL}/orders`, {
            items: [{ product: productId, quantity: 1, price: 100 }],
            totalAmount: 100,
            paymentInfo: { method: 'Online' }
        }, { headers: { 'x-auth-token': custToken } });

        // 2. Verify Order Visible
        let ordersRes = await axios.get(`${API_URL}/orders/business`, config);
        console.log(`Orders visible BEFORE delete: ${ordersRes.data.length}`);
        if (ordersRes.data.length !== 1) throw new Error('Setup failed: Order not visible');

        // 3. Delete Product
        console.log('Deleting Object...');
        await axios.delete(`${API_URL}/products/${productId}`, config);

        // 4. Verify Order Visibility
        ordersRes = await axios.get(`${API_URL}/orders/business`, config);
        console.log(`Orders visible AFTER delete: ${ordersRes.data.length}`);

        if (ordersRes.data.length === 1) {
            console.log('   -> [PASS] Order STILL visible after product deletion (Soft Delete works).');
        } else {
            console.log('   -> [FAIL] Order disappeared! Soft Delete not working.');
            process.exit(1);
        }

        process.exit(0);
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

verifyDeletedProduct();
