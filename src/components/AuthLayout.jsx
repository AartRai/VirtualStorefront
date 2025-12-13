import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            {/* You could add a simple header here if you wanted, e.g., just the Logo */}
            <div className="p-4 absolute top-0 left-0">
                <a href="/" className="text-2xl font-black text-primary tracking-tighter">
                    LocalLift
                </a>
            </div>
            <Outlet />
        </div>
    );
};

export default AuthLayout;
