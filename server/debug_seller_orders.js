const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Product = require('./models/Product');
const Order = require('./models/Order');

dotenv.config();

const debugSellerOrders = async () => {
    try {
        console.log('--- Debugging Seller Orders ---');
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/locallift');

        // 1. Get the Seller created in verify_admin_full.js (or any business user)
        // We know the email from verify_admin_full.js usually starts with seller_full_...
        // But let's find ANY business user with products.

        const products = await Product.find().limit(10);
        if (products.length === 0) {
            console.log('No products found.');
            process.exit(0);
        }

        // Find a business user who owns a product
        const product = products[0];
        const sellerId = product.user;
        console.log(`Analyzing Seller ID: ${sellerId}`);

        // 2. Mock the Route Logic
        // Logic from routes/orders.js:
        // const myProducts = await Product.find({ user: req.user.id }).select('_id');
        // const productIds = myProducts.map(p => p._id);
        // const orders = await Order.find({ 'items.product': { $in: productIds } })

        const myProducts = await Product.find({ user: sellerId }).select('_id name');
        console.log(`Found ${myProducts.length} products for this seller.`);
        const productIds = myProducts.map(p => p._id);
        console.log('Product IDs owned by seller:', productIds);

        // Check if there are ANY orders in entire DB
        const allOrders = await Order.find().limit(5);
        console.log(`Total Orders in DB (sample 5): ${allOrders.length}`);
        if (allOrders.length > 0) {
            console.log('Sample Order Items:', JSON.stringify(allOrders[0].items, null, 2));
        }

        // Run the query
        const orders = await Order.find({ 'items.product': { $in: productIds } });
        console.log(`Query Result: Found ${orders.length} matching orders for this seller.`);

        if (orders.length === 0) {
            console.log('--- FAILURE ANALYIS ---');
            console.log('Why 0? Let\'s check specific match.');
            // Take first product ID
            if (productIds.length > 0) {
                const pid = productIds[0];
                console.log(`Checking for Product ID: ${pid}`);
                const specificOrders = await Order.find({ 'items.product': pid });
                console.log(`Orders specifically with this product ID: ${specificOrders.length}`);
            }
        } else {
            console.log('Result:', JSON.stringify(orders.map(o => ({ id: o._id, items: o.items })), null, 2));
        }

        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
};

debugSellerOrders();
