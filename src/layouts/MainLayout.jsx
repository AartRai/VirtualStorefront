import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CategoryBar from '../components/CategoryBar';
import NotificationToast from '../components/NotificationToast';

const MainLayout = () => {
    return (
        <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            <Navbar />
            <CategoryBar />
            <main className="flex-grow">
                <Outlet />
            </main>
            <Footer />
            <NotificationToast />
        </div>
    );
};

export default MainLayout;
