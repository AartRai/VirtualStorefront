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
        image: 'https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcS0PttJPlu8jm8_VHiPCZ1nuBEvOku6oX6FudhihbRZZVArNuiAMNs310KbE5mbTFrOivsxlQteRU_rcNppehqrSYzYmB4Al_SunkzaIkCl7MfxFLO6leVtjto&usqp=CAc',
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
        image: 'https://m.media-amazon.com/images/I/71evPv-TvmL._SX679_.jpg',
        shop: 'Mobile World',
        category: 'Mobiles',
        description: 'Reliable smartphone with all essential features and long battery life.',
        stock: 50,
        colors: ['#3b82f6', '#000000']
    }
    ,

    // --- Beauty & Personal Care ---
    {
        name: 'Vitamin C + E Serum',
        priceUSD: 35.00,
        originalPriceUSD: 45.00,
        rating: 4.9,
        reviews: 500,
        image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80',
        shop: 'Glow Up Essentials',
        category: 'Beauty',
        description: 'Brightening serum for radiant skin. Cruelty-free and vegan.',
        stock: 100,
        sizes: ['30ml', '50ml']
    },
    {
        name: 'Matte Liquid Lipstick Set',
        priceUSD: 25.00,
        originalPriceUSD: 30.00,
        rating: 4.7,
        reviews: 320,
        image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=800&q=80',
        shop: 'Luxe Lips',
        category: 'Beauty',
        description: 'Long-lasting matte finish liquid lipsticks in 3 diverse shades.',
        stock: 60,
        colors: ['#991b1b', '#ec4899', '#f87171']
    },

    // --- Kitchen & Dining ---
    {
        name: 'Non-Stick Cookware Set',
        priceUSD: 120.00,
        originalPriceUSD: 150.00,
        rating: 4.6,
        reviews: 180,
        image: 'https://m.media-amazon.com/images/I/61T0Fe6un2S._SX679_.jpg',
        shop: 'Chef Master',
        category: 'Kitchen',
        description: '10-piece high quality non-stick pots and pans set.',
        stock: 15,
        colors: ['#000000', '#dc2626']
    },
    {
        name: 'Digital Air Fryer',
        priceUSD: 85.00,
        originalPriceUSD: 100.00,
        rating: 4.8,
        reviews: 400,
        image: 'https://m.media-amazon.com/images/I/513r-ytcqDL._SX679_.jpg',
        shop: 'Smart Home',
        category: 'Kitchen',
        description: 'Healthy frying with little to no oil. 5L capacity.',
        stock: 25,
        colors: ['#000000', '#ffffff']
    },

    // --- Books ---
    {
        name: 'The Midnight Library',
        priceUSD: 15.00,
        rating: 4.8,
        reviews: 1500,
        image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=800&q=80',
        shop: 'Book Haven',
        category: 'Books',
        description: 'A bestselling novel about all the lives you could have lived.',
        stock: 200
    },
    {
        name: 'Atomic Habits',
        priceUSD: 18.00,
        rating: 5.0,
        reviews: 2000,
        image: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=800&q=80',
        shop: 'Mindset Books',
        category: 'Books',
        description: 'Tiny Changes, Remarkable Results. No.1 New York Times Bestseller.',
        stock: 150
    },

    // --- Sports & Outdoors ---
    {
        name: 'Yoga Mat with Strap',
        priceUSD: 25.00,
        originalPriceUSD: 35.00,
        rating: 4.7,
        reviews: 220,
        image: 'https://images.unsplash.com/photo-1593811167562-9cef47bfc4d7?auto=format&fit=crop&w=800&q=80',
        shop: 'Zen Fit',
        category: 'Sports',
        description: 'Eco-friendly non-slip yoga mat for all types of exercises.',
        stock: 80,
        colors: ['#6366f1', '#10b981', '#f472b6']
    },
    {
        name: 'Running Shoes',
        priceUSD: 65.00,
        originalPriceUSD: 80.00,
        rating: 4.5,
        reviews: 135,
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
        shop: 'Speed Run',
        category: 'Sports',
        description: 'Lightweight running shoes for maximum performance.',
        stock: 40,
        sizes: ['7', '8', '9', '10', '11'],
        colors: ['#ef4444', '#3b82f6', '#000000']
    },

    // --- Grocery ---
    {
        name: 'Organic Brown Basmati Rice',
        priceUSD: 12.00,
        originalPriceUSD: 15.00,
        rating: 4.8,
        reviews: 340,
        image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80',
        shop: 'Green Earth Organics',
        category: 'Grocery',
        description: 'Premium organic brown rice, rich in fiber and nutrients. 1kg pack.',
        stock: 50
    },
    {
        name: 'Extra Virgin Olive Oil',
        priceUSD: 25.00,
        originalPriceUSD: 30.00,
        rating: 4.9,
        reviews: 210,
        image: 'https://cdn.fcglcdn.com/brainbees/images/products/583x720/14067987a.webp',
        shop: 'Mediterranean Delights',
        category: 'Grocery',
        description: 'Cold-pressed extra virgin olive oil from Italy. 500ml bottle.',
        stock: 30
    },
    {
        name: 'Raw California Almonds',
        priceUSD: 18.00,
        rating: 4.7,
        reviews: 180,
        image: 'https://www.tatanutrikorner.com/cdn/shop/files/61uhdep-NsL._SL1001-removebg-preview_e2ecc184-adf8-4e14-81bb-640c34f1aa3a.png?v=1748858294&width=1346', // Corrected Almonds image
        shop: 'Nutty Naturals',
        category: 'Grocery',
        description: '100% natural raw almonds. Perfect for snacking or baking. 500g.',
        stock: 45
    },
    {
        name: 'Organic Honey',
        priceUSD: 10.00,
        rating: 4.8,
        reviews: 500,
        image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80',
        shop: 'Bee Pure',
        category: 'Grocery',
        description: 'Pure, raw, and unfiltered organic honey. 500g jar.',
        stock: 60
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
            image: p.image || (p.images && p.images[0]),
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
