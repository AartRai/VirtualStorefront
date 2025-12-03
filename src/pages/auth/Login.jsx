
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Login failed');
            }

            // Use login from AuthContext
            login(data.token, data.user);

            console.log('Login successful:', data);
            navigate('/'); // Redirect to home
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] shadow-xl p-8 md:p-12 w-full max-w-md relative overflow-hidden transition-colors duration-300">
                {/* Decorative Background Blob */}
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#FFE8A3] dark:bg-orange-900/40 rounded-full blur-3xl opacity-50"></div>

                <div className="relative z-10">
                    <div className="text-center mb-10">
                        <h1 className="text-4xl font-bold text-dark dark:text-white mb-2">Welcome Back</h1>
                        <p className="text-gray-500 dark:text-gray-400">Sign in to continue your local shopping journey</p>
                    </div>

                    {error && <div className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-3 rounded-lg mb-4 text-center text-sm font-bold">{error}</div>}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-dark dark:text-white ml-4">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-surface-alt dark:bg-gray-700 border-none rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-primary outline-none transition text-dark dark:text-white placeholder-gray-400"
                                    placeholder="hello@example.com"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-dark dark:text-white ml-4">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-surface-alt dark:bg-gray-700 border-none rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-primary outline-none transition text-dark dark:text-white placeholder-gray-400"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                            <div className="text-right">
                                <Link to="/auth/forgot-password" className="text-sm font-bold text-primary hover:text-secondary">Forgot Password?</Link>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-dark dark:bg-primary text-white font-bold py-4 rounded-full shadow-lg hover:bg-gray-800 dark:hover:bg-orange-600 transition transform active:scale-95 flex items-center justify-center"
                        >
                            Sign In <ArrowRight className="ml-2 h-5 w-5" />
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-gray-500 dark:text-gray-400">
                            Don't have an account?{' '}
                            <Link to="/auth/signup" className="font-bold text-primary hover:text-secondary">
                                Create Account
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
