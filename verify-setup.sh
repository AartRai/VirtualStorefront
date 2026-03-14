#!/bin/bash

# VirtualStorefront - Quick Verification Script

echo "🔍 VirtualStorefront Deployment Verification"
echo "=============================================="
echo ""

# Check if .env files exist
echo "📝 Checking .env configuration files..."
if [ -f ".env" ]; then
    echo "✅ Root .env exists"
    grep "VITE_API_URL" .env && echo "   - VITE_API_URL configured" || echo "   ⚠️  VITE_API_URL not set"
else
    echo "❌ Root .env NOT found - Create it!"
fi

if [ -f "server/.env" ]; then
    echo "✅ Server .env exists"
    grep "PORT" server/.env && echo "   - PORT configured" || echo "   ⚠️  PORT not set"
    grep "MONGO_URI" server/.env && echo "   - MONGO_URI configured" || echo "   ⚠️  MONGO_URI not set"
    grep "JWT_SECRET" server/.env && echo "   - JWT_SECRET configured" || echo "   ⚠️  JWT_SECRET not set"
else
    echo "❌ Server .env NOT found"
    echo "   Run: cp server/.env.example server/.env"
fi

echo ""
echo "📦 Checking dependencies..."

# Check if node_modules exist
if [ -d "node_modules" ]; then
    echo "✅ Frontend dependencies installed"
else
    echo "❌ Frontend dependencies NOT installed"
    echo "   Run: npm install"
fi

if [ -d "server/node_modules" ]; then
    echo "✅ Server dependencies installed"
else
    echo "❌ Server dependencies NOT installed"
    echo "   Run: cd server && npm install"
fi

echo ""
echo "🔗 Checking API configuration..."

# Check axios configuration
if grep -q "VITE_API_URL" src/api/axios.js; then
    echo "✅ Frontend API uses dynamic URL (NEW FIX APPLIED)"
else
    echo "⚠️  Frontend API configuration may need update"
fi

echo ""
echo "✨ SETUP CHECKLIST:"
echo "━━━━━━━━━━━━━━━━━"
echo "1. [ ] Setup server/.env with MONGO_URI"
echo "2. [ ] Run: cd server && npm install && npm start"
echo "3. [ ] Run: npm install && npm run dev"
echo "4. [ ] Test login at http://localhost:5173/auth/login"
echo "5. [ ] Check products at http://localhost:5173/shop"
echo ""
echo "For Production:"
echo "6. [ ] Deploy backend (Railway/Render/Vercel)"
echo "7. [ ] Set VITE_API_URL to backend URL"
echo "8. [ ] Deploy frontend (Vercel/Netlify)"
echo ""
