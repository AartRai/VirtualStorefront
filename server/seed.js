const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const User = require('./models/User');

dotenv.config();

const productsRaw = [
    // --- Fashion ---
    {
        name: 'Classic Denim Jacket',
        priceUSD: 59.99,
        originalPriceUSD: 89.99,
        rating: 4.5,
        reviews: 120,
        image: 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?auto=format&fit=crop&w=800&q=80',
        images: [
            'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?auto=format&fit=crop&w=800&q=80' // Duplicate for gallery effect
        ],
        shop: 'Urban Style',
        category: 'Fashion',
        description: 'Timeless denim jacket, perfect for layering. Made from 100% durable cotton.',
        stock: 15,
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['#3b82f6', '#1e3a8a'] // Blue shades
    },
    {
        name: 'Floral Summer Dress',
        priceUSD: 45.50,
        originalPriceUSD: 55.00,
        rating: 4.8,
        reviews: 85,
        image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80',
        images: [
            'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=800&q=80'
        ],
        shop: 'Bloom Boutique',
        category: 'Fashion',
        description: 'Lightweight and airy floral dress for sunny days.',
        stock: 20,
        sizes: ['XS', 'S', 'M', 'L'],
        colors: ['#fee2e2', '#fef3c7'] // Pink/Yellowish
    },
    {
        name: 'Leather Ankle Boots',
        priceUSD: 89.00,
        originalPriceUSD: 120.00,
        rating: 4.6,
        reviews: 42,
        image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=800&q=80',
        shop: 'Step Up',
        category: 'Fashion',
        description: 'Genuine leather boots with a comfortable heel.',
        stock: 8,
        sizes: ['37', '38', '39', '40', '41', '42'],
        colors: ['#3f2c22', '#000000'] // Brown, Black
    },
    {
        name: 'Striped Cotton T-Shirt',
        priceUSD: 25.00,
        rating: 4.3,
        reviews: 200,
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80',
        shop: 'Basics Co.',
        category: 'Fashion',
        description: 'Soft organic cotton tee with classic stripes.',
        stock: 50,
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        colors: ['#ffffff', '#000000', '#1d4ed8']
    },
    {
        name: 'Vintage Sunglasses',
        priceUSD: 35.00,
        originalPriceUSD: 50.00,
        rating: 4.7,
        reviews: 60,
        image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80',
        shop: 'Retro Specs',
        category: 'Fashion',
        description: 'Stylish vintage-inspired sunglasses with UV protection.',
        stock: 12,
        colors: ['#000000', '#92400e'] // Black, Brown
    },

    // --- Electronics ---
    {
        name: 'Wireless Noise-Canceling Headphones',
        priceUSD: 199.99,
        originalPriceUSD: 249.99,
        rating: 4.8,
        reviews: 350,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
        images: [
            'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=800&q=80'
        ],
        shop: 'AudioTech',
        category: 'Electronics',
        description: 'Immersive sound quality with active noise cancellation and 30-hour battery life.',
        stock: 10,
        colors: ['#000000', '#f3f4f6', '#1d4ed8'] // Black, White, Blue
    },
    {
        name: 'Smart Fitness Watch',
        priceUSD: 129.50,
        originalPriceUSD: 159.00,
        rating: 4.5,
        reviews: 150,
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
        shop: 'FitGear',
        category: 'Electronics',
        description: 'Track your health and fitness goals with precision. Heart rate monitor included.',
        stock: 30,
        colors: ['#000000', '#ec4899'] // Black, Pink
    },
    {
        name: 'Portable Bluetooth Speaker',
        priceUSD: 59.99,
        rating: 4.6,
        reviews: 90,
        image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=800&q=80',
        shop: 'SoundWave',
        category: 'Electronics',
        description: 'Compact speaker with powerful bass.',
        stock: 20,
        colors: ['#ef4444', '#3b82f6', '#000000']
    },

    // --- Home ---
    {
        name: 'Handcrafted Ceramic Vase',
        priceUSD: 45.00,
        rating: 4.8,
        reviews: 124,
        image: 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?auto=format&fit=crop&w=800&q=80',
        shop: 'Clay & Co.',
        category: 'Home',
        description: 'Beautifully handcrafted ceramic vase, perfect for any modern home.',
        stock: 5,
        colors: ['#fef3c7', '#d1d5db'] // Cream, Gray
    },
    {
        name: 'Scented Soy Candle',
        priceUSD: 22.00,
        rating: 4.9,
        reviews: 200,
        image: 'https://images.unsplash.com/photo-1602825389660-18c565057c0d?auto=format&fit=crop&w=800&q=80',
        shop: 'Glow Candles',
        category: 'Home',
        description: 'Hand-poured soy candle with calming lavender scent.',
        stock: 40
    },

    // --- Mobiles ---
    {
        name: 'Smartphone X Pro',
        priceUSD: 999.00,
        originalPriceUSD: 1199.00,
        rating: 4.8,
        reviews: 200,
        image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80',
        images: [
            'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1598327105666-5b89351aff23?auto=format&fit=crop&w=800&q=80'
        ],
        shop: 'Tech Giant',
        category: 'Mobiles',
        description: 'Latest flagship smartphone with pro-grade camera and 120Hz display.',
        stock: 10,
        colors: ['#000000', '#ffffff', '#c0c0c0'] // Black, White, Silver
    },
    {
        name: 'Budget Android Phone',
        priceUSD: 199.00,
        originalPriceUSD: 229.00,
        rating: 4.2,
        reviews: 150,
        image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff23?auto=format&fit=crop&w=800&q=80',
        shop: 'Mobile World',
        category: 'Mobiles',
        description: 'Reliable smartphone with all essential features and long battery life.',
        stock: 50,
        colors: ['#3b82f6', '#000000']
    }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/locallift');
        console.log('MongoDB Connected for seeding');

        // Find a business user or create one
        let vendor = await User.findOne({ role: 'business' });

        if (!vendor) {
            console.log('No business user found. Finding any user fallback...');
            vendor = await User.findOne({});
            if (vendor) console.log(`Assigning products to user: ${vendor.name} (${vendor.role})`);
        } else {
            console.log(`Assigning products to business user: ${vendor.name}`);
        }

        if (!vendor) {
            console.error('No users found in database. Please register a user first.');
            process.exit(1);
        }

        await Product.deleteMany({}); // CLEAR existing products
        console.log('Cleared existing products');

        // Process products: Convert USD to INR and add user ID
        const EXCHANGE_RATE = 85;

        const productsToInsert = productsRaw.map(p => ({
            name: p.name,
            description: p.description,
            category: p.category,
            price: Math.round(p.priceUSD * EXCHANGE_RATE),
            originalPrice: p.originalPriceUSD ? Math.round(p.originalPriceUSD * EXCHANGE_RATE) : null,
            stock: p.stock,
            images: p.images || [p.image],
            colors: p.colors || [],
            sizes: p.sizes || [],
            rating: p.rating,
            numReviews: p.reviews,
            shop: p.shop,
            user: vendor._id
        }));

        await Product.insertMany(productsToInsert);
        console.log(`Added ${productsToInsert.length} mock products with INR prices and variants successfully!`);

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedDB();
