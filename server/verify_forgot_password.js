const BASE_URL = 'http://127.0.0.1:5001/api';

async function verifyForgotPassword() {
    try {
        console.log('--- Verifying Forgot Password Flow ---');

        // Helper
        const post = async (url, data) => {
            const res = await fetch(`${BASE_URL}${url}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (!res.ok) {
                const txt = await res.text();
                throw new Error(`POST ${url} failed: ${res.status} ${txt}`);
            }
            return res.json();
        };

        // 1. Create a User
        const email = `fp_user_${Date.now()}@test.com`;
        console.log(`Creating user ${email}...`);
        await post('/auth/register', {
            name: 'Forgot Pw User',
            email,
            password: 'oldpassword',
            role: 'customer'
        });

        // 2. Request Forgot Password
        console.log('Requesting password reset...');
        const fpRes = await post('/auth/forgot-password', { email });
        console.log('Forgot Password Response:', fpRes);

        console.log('--- Check Server Logs for the Mock Link! ---');
    } catch (err) {
        console.error('TEST FAILED:', err.message);
    }
}

verifyForgotPassword();
