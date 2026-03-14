# VirtualStorefront Deployment & Troubleshooting Guide

## 🔴 CRITICAL ISSUES FIXED

### 1. **API URL Mismatch** ✅ FIXED

- **Problem**: Frontend was hardcoded to `http://localhost:5002/api` but server runs on port `5000`
- **Solution**: Updated [src/api/axios.js](src/api/axios.js) to dynamically detect environment and use correct port
- **Now supports**:
  - Local development: `http://localhost:5000/api`
  - Production: Uses `${window.location.origin}/api` OR `VITE_API_URL` env variable

### 2. **Environment Variables Not Configured** ⚙️

- Need to set up `.env` files in both root and server directories

---

## 🚀 QUICK START - LOCAL TESTING

### Step 1: Configure Server Environment

```bash
cd server
cp .env.example .env
```

Edit `server/.env`:

```env
PORT=5000
MONGO_URI=mongodb+srv://your_username:your_password@your_cluster.mongodb.net/VirtualStorefront?retryWrites=true&w=majority
JWT_SECRET=your_secret_key_12345
```

### Step 2: Configure Frontend Environment

File: `.env` (already created)

```env
VITE_API_URL=http://localhost:5000/api
```

### Step 3: Install & Run Locally

```bash
# Terminal 1: Server
cd server
npm install
npm start      # or npm run dev for watch mode

# Terminal 2: Frontend
npm install
npm run dev
```

### Step 4: Test Login & Products

- **Login URL**: http://localhost:5173/auth/login
- **Shop URL**: http://localhost:5173/shop
- **MongoDB Products**: Should display from your cloud database

---

## 🌐 PRODUCTION DEPLOYMENT GUIDE

### For Frontend (Build & Deploy)

```bash
npm run build
# dist/ folder ready to deploy to:
# - Vercel
# - Netlify
# - Your hosting (AWS S3, GitHub Pages, etc)
```

### For Backend (Node.js Server)

Deploy to:

- **Vercel** (with serverless functions)
- **Railway.app** (easiest, has MongoDB integration)
- **Heroku/Render/Fly.io**
- **Your own server** (VPS/EC2)

### Critical: Production Environment Variables

**On your hosting platform, set these:**

**Backend Environment**:

```
PORT=5000
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/VirtualStorefront?retryWrites=true&w=majority
JWT_SECRET=generate-a-strong-random-secret
GOOGLE_API_KEY=your_key_if_using_ai_features
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=app-specific-password
```

**Frontend Environment** (if deploying separately):

```
VITE_API_URL=https://your-backend-domain.com/api
```

---

## 🔍 DEBUGGING CHECKLIST

### ✅ Login Not Working?

1. Open browser DevTools → Network tab
2. Check the login POST request endpoint
3. Verify response has `token` and `user` data
4. Check browser console for errors
5. Verify `JWT_SECRET` is same on backend

### ✅ Products Not Showing?

1. Check Network tab → GET `/api/products` response
2. Verify MongoDB `MONGO_URI` is correct
3. Check server console: `MongoDB Connected` message
4. Verify products exist in MongoDB Atlas

### ✅ CORS Issues?

- Backend [server/index.js](server/index.js) already has CORS enabled for all origins
- If still getting errors, check browser console for exact error

### ✅ Both Frontend & Backend Running but Still Not Working?

1. **Clear Browser Cache**: Ctrl+Shift+Delete or Cmd+Shift+Delete
2. **Hard Refresh**: Ctrl+F5 or Cmd+Shift+R
3. **Check Server Logs**: Should show "MongoDB Connected" and "Server running on port 5000"
4. **Check Frontend Logs**: DevTools → Console tab

---

## 📝 API BASE URL LOGIC (After Fix)

New [src/api/axios.js](src/api/axios.js) logic:

1. If `VITE_API_URL` environment variable exists → Use it
2. Else if `localhost` → Use `http://localhost:5000/api`
3. Else (production) → Use same origin: `${window.location.origin}/api`

**For Production Deployment**:

- If backend on different domain: Set `VITE_API_URL=https://your-api-domain.com/api`
- If backend on same domain: Let it auto-detect (works without setting variable)

---

## 🎯 NEXT STEPS

1. ✅ Configure `server/.env` with your MongoDB URI
2. ✅ Run server locally: `cd server && npm start`
3. ✅ Run frontend locally: `npm run dev`
4. ✅ Test login & product loading
5. ✅ Deploy backend (Railway/Render is easiest)
6. ✅ Set frontend `VITE_API_URL` to your backend URL
7. ✅ Deploy frontend (Vercel/Netlify)

---

## 💡 Common Issues

| Issue                      | Cause               | Solution                                      |
| -------------------------- | ------------------- | --------------------------------------------- |
| Products not showing       | API URL wrong       | Check `.env` file, verify `VITE_API_URL`      |
| Login fails                | JWT_SECRET mismatch | Ensure backend `.env` has `JWT_SECRET`        |
| "Cannot connect to server" | Backend not running | Run `npm start` in server folder              |
| CORS error                 | Backend not allowed | Already enabled, check console for real error |
| MongoDB connection error   | Wrong MONGO_URI     | Verify connection string in server/.env       |

---

## 📞 Quick Reference

- **Frontend Port**: 5173 (Vite default)
- **Backend Port**: 5000
- **Default Local APIs**:
  - POST `/api/auth/login` → Login endpoint
  - GET `/api/products` → Fetch products
  - GET `/api/auth` → Verify token
