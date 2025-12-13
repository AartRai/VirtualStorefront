const axios = require('axios');

const API_URL = 'http://localhost:5001/api';
const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjkzOTdlZTBlZDJmYTYxMDQwZGI5ODAyIiwicm9sZSI6ImFkbWluIn0sImlhdCI6MTc2NTM4MDc2NiwiZXhwIjoxNzY1Mzg0MzY2fQ.qrMB7nA_2v5bdS-wwzGauaXloIuUtaKKQ3IvmdRMBss';

const config = {
    headers: { 'x-auth-token': TOKEN }
};

const runTests = async () => {
    try {
        console.log('--- TESTING CATEGORIES ---');
        // 1. Create Category
        const catRes = await axios.post(`${API_URL}/categories`, { name: 'API Test Cat', image: 'http://img.com/1.jpg' }, config);
        console.log('Created Category:', catRes.data.name, catRes.data._id);
        const catId = catRes.data._id;

        // 2. List Categories
        const catsRes = await axios.get(`${API_URL}/categories`);
        console.log('Categories Count:', catsRes.data.length);
        const exists = catsRes.data.find(c => c._id === catId);
        console.log('Category Exists in List:', !!exists);

        // 3. Delete Category
        if (catId) {
            await axios.delete(`${API_URL}/categories/${catId}`, config);
            console.log('Deleted Category');
        }

        console.log('\n--- TESTING BRANDS ---');
        // 4. Create Brand
        const brandRes = await axios.post(`${API_URL}/brands`, { name: 'API Test Brand', logo: 'http://img.com/logo.jpg' }, config);
        console.log('Created Brand:', brandRes.data.name, brandRes.data._id);
        const brandId = brandRes.data._id;

        // 5. List Brands
        const brandsRes = await axios.get(`${API_URL}/brands`);
        console.log('Brands Count:', brandsRes.data.length);
        const brandExists = brandsRes.data.find(b => b._id === brandId);
        console.log('Brand Exists in List:', !!brandExists);

        // 6. Delete Brand
        if (brandId) {
            await axios.delete(`${API_URL}/brands/${brandId}`, config);
            console.log('Deleted Brand');
        }

    } catch (err) {
        console.error('TEST FAILED:', err.response ? err.response.data : err.message);
    }
};

runTests();
