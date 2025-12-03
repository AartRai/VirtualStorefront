import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
            <div className="w-full max-w-md space-y-8">
                <Outlet />
            </div>
        </div>
    );
};

export default AuthLayout;
