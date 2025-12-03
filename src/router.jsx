import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Placeholder pages (will be implemented later)
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import Wishlist from './pages/Wishlist';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
// Dashboard Pages
import Profile from './pages/dashboard/Profile';
import Orders from './pages/dashboard/Orders';
import Payments from './pages/dashboard/Payments';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminCategories from './pages/admin/AdminCategories';
import AdminOrders from './pages/admin/AdminOrders';
import AdminOffers from './pages/admin/AdminOffers';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <MainLayout />,
        children: [
            { path: '/', element: <Home /> },
            { path: 'shop', element: <Shop /> },
            { path: 'product/:id', element: <ProductDetails /> },
            { path: 'cart', element: <Cart /> },
            { path: 'checkout', element: <Checkout /> },
            { path: 'order-confirmation', element: <OrderConfirmation /> },
            { path: 'wishlist', element: <Wishlist /> },
            { path: 'about', element: <About /> },
            { path: 'contact', element: <Contact /> },
        ],
    },
    {
        path: '/auth',
        element: <AuthLayout />,
        children: [
            { path: 'login', element: <Login /> },
            { path: 'signup', element: <Signup /> },
        ],
    },
    {
        path: '/dashboard',
        element: <DashboardLayout role="customer" />,
        children: [
            { index: true, element: <Profile /> },
            { path: 'orders', element: <Orders /> },
            { path: 'payments', element: <Payments /> },
        ],
    },
    {
        path: '/admin',
        element: <DashboardLayout role="admin" />,
        children: [
            { index: true, element: <AdminDashboard /> },
            { path: 'products', element: <AdminProducts /> },
            { path: 'categories', element: <AdminCategories /> },
            { path: 'orders', element: <AdminOrders /> },
            { path: 'offers', element: <AdminOffers /> },
        ],
    },
]);
