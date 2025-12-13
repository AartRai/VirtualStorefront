const BASE_URL = 'http://127.0.0.1:5001/api';

async function runTest() {
    try {
        console.log('--- Starting System Verification ---');

        // Helper for fetch
        const post = async (url, data, token) => {
            const headers = { 'Content-Type': 'application/json' };
            if (token) headers['x-auth-token'] = token;
            const res = await fetch(`${BASE_URL}${url}`, {
                method: 'POST',
                headers,
                body: JSON.stringify(data)
            });
            if (!res.ok) {
                const err = await res.text();
                throw new Error(`POST ${url} failed: ${res.status} ${err}`);
            }
            return res.json();
        };

        const get = async (url, token) => {
            const headers = { 'Content-Type': 'application/json' };
            if (token) headers['x-auth-token'] = token;
            const res = await fetch(`${BASE_URL}${url}`, { headers });
            if (!res.ok) {
                const err = await res.text();
                throw new Error(`GET ${url} failed: ${res.status} ${err}`);
            }
            return res.json();
        };

        // 1. Register Business User
        const bizName = 'BizUser_' + Date.now();
        const bizEmail = `biz_${Date.now()}@test.com`;
        console.log(`Creating Business User: ${bizEmail}`);

        const bizReg = await post('/auth/register', {
            name: bizName,
            email: bizEmail,
            password: 'password123',
            role: 'business'
        });
        const bizToken = bizReg.token;
        console.log('Business User Created & Logged In');

        // 2. Add Product
        console.log('Adding Product...');
        const productRes = await post('/products', {
            name: 'Verification Gadget',
            description: 'A gadget to verify the system',
            category: 'Electronics',
            price: 5000,
            stock: 100,
            images: ['https://via.placeholder.com/150']
        }, bizToken);
        const productId = productRes._id;
        console.log(`Product Added: ${productId}`);

        // 3. Register Customer User
        const custName = 'CustUser_' + Date.now();
        const custEmail = `cust_${Date.now()}@test.com`;
        console.log(`Creating Customer User: ${custEmail}`);

        const custReg = await post('/auth/register', {
            name: custName,
            email: custEmail,
            password: 'password123',
            role: 'customer'
        });
        const custToken = custReg.token;
        console.log('Customer User Created & Logged In');

        // 4. Place Order
        console.log('Placing Order...');
        const orderRes = await post('/orders', {
            items: [
                { product: productId, quantity: 2, price: 5000 }
            ],
            totalAmount: 10000,
            shippingAddress: {
                address: '123 Test St',
                city: 'Test City',
                postalCode: '12345',
                country: 'TestLand'
            },
            paymentMethod: 'Credit Card'
        }, custToken);
        const orderId = orderRes._id;
        console.log(`Order Placed: ${orderId}`);

        // 5. Verify Business Notification
        console.log('Verifying Business Notifications...');
        const notifications = await get('/notifications', bizToken);
        const hasOrderNotif = notifications.some(n => n.message.includes('New Order Received'));

        if (hasOrderNotif) {
            console.log('SUCCESS: Business received order notification.');
        } else {
            console.error('FAILURE: Business did NOT receive notification.');
            console.log('Notifications found:', notifications);
        }

        console.log('--- Verification Complete ---');
    } catch (err) {
        console.error('TEST FAILED:', err.message);
    }
}

runTest();
