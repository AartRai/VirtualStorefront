const { GoogleGenerativeAI } = require("@google/generative-ai");
const Product = require("../models/Product");

/**
 * Get personalized recommendations for a user based on their history.
 * @param {Object} userHistory - Object containing orders, wishlist, and reviews.
 * @returns {Array} List of recommended products.
 */
const getAIRecommendations = async (userHistory) => {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        console.warn("GEMINI_API_KEY not found. Skipping AI recommendations.");
        return null;
    }

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // 1. Prepare product catalog context (subset for prompt efficiency)
        // We'll fetch top categories and some random products to give AI options
        const categories = [...new Set(userHistory.orders.flatMap(o => o.items.map(i => i.product?.category)).filter(Boolean))];

        let candidateProducts = await Product.find({
            category: { $in: categories },
            isDeleted: { $ne: true }
        }).limit(30).select('name description category price rating');

        if (candidateProducts.length < 10) {
            const extra = await Product.find({ isDeleted: { $ne: true } })
                .sort({ rating: -1 })
                .limit(20)
                .select('name description category price rating');
            candidateProducts = [...candidateProducts, ...extra];
        }

        // 2. Prepare user profile context
        const orderHistory = userHistory.orders.map(o => ({
            items: o.items.map(i => i.name),
            date: o.createdAt
        }));

        const wishlist = userHistory.wishlist?.products?.map(p => p.name) || [];
        const reviews = userHistory.reviews.map(r => ({
            product: r.product?.name,
            rating: r.rating,
            comment: r.comment
        }));

        const prompt = `
            You are an AI shopping assistant for "Virtual Storefront". 
            Based on the user's shopping history, recommend 8 products from the candidate list below.
            
            USER PROFILE:
            - Order History: ${JSON.stringify(orderHistory)}
            - Wishlist: ${JSON.stringify(wishlist)}
            - Reviews given: ${JSON.stringify(reviews)}
            
            CANDIDATE PRODUCTS:
            ${candidateProducts.map(p => `ID: ${p._id}, Name: ${p.name}, Category: ${p.category}, Price: ${p.price}, Rating: ${p.rating}`).join('\n')}
            
            INSTRUCTIONS:
            - Return ONLY a JSON array of product IDs.
            - Do not include any text other than the JSON array.
            - Prioritize products that match the categories or styles the user has shown interest in.
            - Example output: ["6584c...", "6584d..."]
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Clean up the text in case Gemini adds markdown blocks
        const jsonMatch = text.match(/\[.*\]/s);
        const productIds = jsonMatch ? JSON.parse(jsonMatch[0]) : [];

        if (productIds.length > 0) {
            // Fetch the actual product objects
            return await Product.find({ _id: { $in: productIds } });
        }

        return null;
    } catch (error) {
        console.error("AI Recommendation Error:", error);
        return null;
    }
};

module.exports = { getAIRecommendations };
