// Native fetch is available in Node > 18
const api = 'http://localhost:5001/api';

async function run() {
    const api = 'http://localhost:5001/api';
    const timestamp = Date.now();
    const vendorEmail = `vendor_${timestamp}@test.com`;
    const customerEmail = `customer_${timestamp}@test.com`;
    const password = 'password123';

    try {
        console.log("=== Starting Vendor Flow Verification ===");

        // 1. Register Vendor
        console.log(`\n1. Registering Vendor (${vendorEmail})...`);
        const vendorRegRes = await fetch(`${api}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: 'Vendor Test', email: vendorEmail, password, role: 'business' })
        });
        const vendorData = await vendorRegRes.json();
        if (!vendorRegRes.ok) throw new Error(`Vendor Reg Failed: ${JSON.stringify(vendorData)}`);
        const vendorToken = vendorData.token;
        console.log("   -> Vendor Registered. Token acquired.");

        // 2. Add Product
        console.log("\n2. Adding Product...");
        const productRes = await fetch(`${api}/products`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'x-auth-token': vendorToken },
            body: JSON.stringify({
                name: `Test Product ${timestamp}`,
                description: 'A great test product',
                category: 'Electronics',
                price: 1000,
                stock: 10,
                images: ['https://via.placeholder.com/150']
            })
        });
        const productData = await productRes.json();
        if (!productRes.ok) throw new Error(`Add Product Failed: ${JSON.stringify(productData)}`);
        const productId = productData._id;
        console.log(`   -> Product Added: ${productData.name} (ID: ${productId})`);

        // 3. Register Customer
        console.log(`\n3. Registering Customer (${customerEmail})...`);
        const customerRegRes = await fetch(`${api}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: 'Customer Test', email: customerEmail, password, role: 'customer' })
        });
        const customerData = await customerRegRes.json();
        if (!customerRegRes.ok) throw new Error(`Customer Reg Failed: ${JSON.stringify(customerData)}`);
        const customerToken = customerData.token;
        console.log("   -> Customer Registered. Token acquired.");

        // 4. Place Order
        console.log("\n4. Placing Order...");
        const orderRes = await fetch(`${api}/orders`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'x-auth-token': customerToken },
            body: JSON.stringify({
                items: [{ product: productId, quantity: 2 }]
            })
        });
        const orderData = await orderRes.json();
        if (!orderRes.ok) throw new Error(`Order Failed: ${JSON.stringify(orderData)}`);
        console.log(`   -> Order Placed. Total: ₹${orderData.totalAmount}`);

        // 5. Verify Vendor Dashboard Stats
        console.log("\n5. Verifying Vendor Dashboard Stats...");
        const statsRes = await fetch(`${api}/dashboard/stats`, {
            method: 'GET',
            headers: { 'x-auth-token': vendorToken }
        });
        const statsData = await statsRes.json();
        if (!statsRes.ok) throw new Error(`Stats Fetch Failed: ${JSON.stringify(statsData)}`);

        console.log("   -> Stats Received:", statsData);

        // Assertions
        if (statsData.totalProducts !== 1) console.error("   [FAIL] Total Products should be 1");
        else console.log("   [PASS] Total Products is 1");

        // Previous logic might return total orders containing this vendor's product
        if (statsData.totalOrders < 1) console.error("   [FAIL] Total Orders should be at least 1");
        else console.log("   [PASS] Total Orders >= 1");

        if (statsData.totalSales !== 2000) console.error(`   [FAIL] Total Sales should be 2000, got ${statsData.totalSales}`);
        else console.log("   [PASS] Total Sales is 2000");

        console.log("\n=== Verification Complete ===");

    } catch (err) {
        console.error("\n[ERROR] Verification Failed:", err.message);
    }
}

run();
