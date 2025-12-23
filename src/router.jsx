import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';
import AuthLayout from './components/AuthLayout';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';

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
import FAQ from './pages/FAQ';
import ShippingPolicy from './pages/ShippingPolicy';
import ReturnsPolicy from './pages/ReturnsPolicy';
import PrivacyPolicy from './pages/PrivacyPolicy';
// Dashboard Pages
import Profile from './pages/dashboard/Profile';
import Orders from './pages/dashboard/Orders';
import OrderDetails from './pages/dashboard/OrderDetails';
import Payments from './pages/dashboard/Payments';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminCategories from './pages/admin/AdminCategories';
import AdminOrders from './pages/admin/AdminOrders';
import AdminOffers from './pages/admin/AdminOffers';
import AdminInventory from './pages/admin/AdminInventory';
import AdminUsers from './pages/admin/AdminUsers';
import AdminReviews from './pages/admin/AdminReviews';
import AdminProfile from './pages/admin/AdminProfile';

// Business Pages
import BusinessOverview from './pages/business/BusinessOverview';
import MyProducts from './pages/business/MyProducts';
import BusinessOrders from './pages/business/BusinessOrders';
import AddProduct from './pages/business/AddProduct';
import BusinessProfile from './pages/business/BusinessProfile';
import BusinessReviews from './pages/business/BusinessReviews';
import BusinessNewsletter from './pages/business/BusinessNewsletter';
import BusinessInventory from './pages/business/BusinessInventory';
import BusinessOrderDetails from './pages/business/BusinessOrderDetails';
import BusinessCustomers from './pages/business/BusinessCustomers';
import BusinessAnalytics from './pages/business/BusinessAnalytics';
import BusinessSales from './pages/business/BusinessSales';
import BusinessUsers from './pages/business/BusinessUsers';



export const router = createBrowserRouter([
    {
        path: '/',
        element: <MainLayout />,
        children: [
            { index: true, element: <Home /> },
            { path: 'shop', element: <Shop /> },
            { path: 'product/:id', element: <ProductDetails /> },
            { path: 'cart', element: <Cart /> },
            { path: 'checkout', element: <Checkout /> },
            { path: 'order-confirmation', element: <OrderConfirmation /> },
            { path: 'wishlist', element: <Wishlist /> },
            { path: 'contact', element: <Contact /> },
            { path: 'about', element: <About /> },
            { path: 'profile', element: <Profile /> },
            { path: 'faq', element: <FAQ /> },
            { path: 'shipping', element: <ShippingPolicy /> },
            { path: 'returns', element: <ReturnsPolicy /> },
            { path: 'privacy', element: <PrivacyPolicy /> },
        ],
    },
    {
        element: <AuthLayout />,
        children: [
            { path: 'auth/login', element: <Login /> },
            { path: 'auth/signup', element: <Signup /> },
            { path: 'auth/forgot-password', element: <ForgotPassword /> },
            { path: 'auth/reset-password/:token', element: <ResetPassword /> },
        ]
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
            { path: 'profile', element: <Profile /> },
            { path: 'orders', element: <Orders /> },
            { path: 'orders/:id', element: <OrderDetails /> },
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
            { path: 'inventory', element: <AdminInventory /> },
            { path: 'users', element: <AdminUsers /> },
            { path: 'reviews', element: <AdminReviews /> },
            { path: 'profile', element: <AdminProfile /> },
        ],
    },
    {
        path: '/business',
        element: <DashboardLayout role="business" />,
        children: [
            { index: true, element: <BusinessOverview /> },
            { path: 'analytics', element: <BusinessAnalytics /> },
            { path: 'sales', element: <BusinessSales /> },
            { path: 'products', element: <MyProducts /> },
            { path: 'orders', element: <BusinessOrders /> },
            { path: 'orders/:id', element: <BusinessOrderDetails /> },
            { path: 'add-product', element: <AddProduct /> },
            { path: 'profile', element: <BusinessProfile /> },
            { path: 'reviews', element: <BusinessReviews /> },
            { path: 'users', element: <BusinessUsers /> },
            { path: 'customers', element: <BusinessCustomers /> },
            { path: 'newsletter', element: <BusinessNewsletter /> },
            { path: 'inventory', element: <BusinessInventory /> },
        ],
    },
]);
