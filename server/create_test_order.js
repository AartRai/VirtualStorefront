const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Order = require('./models/Order');
const Product = require('./models/Product');
const User = require('./models/User');

dotenv.config();

const createTestOrder = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        // 1. Find the vendor 'seller1@gmail.com' to target their product
        const seller = await User.findOne({ email: 'seller1@gmail.com' });
        if (!seller) throw new Error('Seller not found');

        // 2. Find a product by this seller
        const product = await Product.findOne({ user: seller._id });
        if (!product) throw new Error('Seller has no products');

        console.log(`Found Product: ${product.name} (Price: ${product.price})`);

        // 3. Create a Dummy Order
        const newOrder = new Order({
            user: seller._id, // Seller buying their own product for test, or random user
            items: [{
                product: product._id,
                quantity: 5, // High quantity to notice change
                price: product.price
            }],
            totalAmount: product.price * 5,
            shippingAddress: {
                fullName: 'Test Buyer',
                addressLine1: '123 Test St',
                city: 'Test City',
                state: 'TS',
                zipCode: '12345',
                country: 'India',
                mobileNumber: '9999999999'
            },
            paymentMethod: 'COD',
            status: 'Pending',
            createdAt: new Date()
        });

        await newOrder.save();
        console.log('✅ Test Order Created Successfully!');
        console.log(`Order ID: ${newOrder._id}`);
        console.log(`Added ₹${product.price * 5} revenue and 5 units.`);

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

createTestOrder();
