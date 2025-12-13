import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, ArrowRight, Store } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';

const Signup = () => {
    const [role, setRole] = useState('customer'); // 'customer' or 'business'
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            const response = await api.post('/auth/register', {
                name: formData.name,
                email: formData.email,
                password: formData.password,
                role
            });

            const data = response.data;

            // Use login from AuthContext
            login(data.token, data.user);

            console.log('Signup successful:', data);
            navigate('/'); // Redirect to home
        } catch (err) {
            console.error('Signup Error:', err);
            setError(err.response?.data?.message || 'Signup failed');
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] shadow-xl p-8 md:p-12 w-full max-w-lg relative overflow-hidden transition-colors duration-300">
                {/* Decorative Background Blob */}
                <div className="absolute -top-20 -left-20 w-64 h-64 bg-[#FFE8A3] dark:bg-orange-900/40 rounded-full blur-3xl opacity-50"></div>

                <div className="relative z-10">
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold text-dark dark:text-white mb-2">Join LocalLift</h1>
                        <p className="text-gray-500 dark:text-gray-400">Start your journey with us today</p>
                    </div>

                    {error && <div className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-3 rounded-lg mb-4 text-center text-sm font-bold">{error}</div>}

                    {/* Role Selection */}
                    <div className="grid grid-cols-2 gap-4 mb-8 bg-surface-alt dark:bg-gray-700 p-2 rounded-2xl">
                        <button
                            onClick={() => setRole('customer')}
                            className={`flex items-center justify-center py-3 rounded-xl font-bold transition ${role === 'customer' ? 'bg-white dark:bg-gray-600 text-dark dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-dark dark:hover:text-white'}`}
                        >
                            <User className="w-4 h-4 mr-2" /> Shopper
                        </button>
                        <button
                            onClick={() => setRole('business')}
                            className={`flex items-center justify-center py-3 rounded-xl font-bold transition ${role === 'business' ? 'bg-white dark:bg-gray-600 text-dark dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-dark dark:hover:text-white'}`}
                        >
                            <Store className="w-4 h-4 mr-2" /> Business
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-dark dark:text-white ml-4">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full bg-surface-alt dark:bg-gray-700 border-none rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-primary outline-none transition text-dark dark:text-white placeholder-gray-400"
                                    placeholder="John Doe"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-dark dark:text-white ml-4">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
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
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full bg-surface-alt dark:bg-gray-700 border-none rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-primary outline-none transition text-dark dark:text-white placeholder-gray-400"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-dark dark:text-white ml-4">Confirm Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className="w-full bg-surface-alt dark:bg-gray-700 border-none rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-primary outline-none transition text-dark dark:text-white placeholder-gray-400"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-dark dark:bg-primary text-white font-bold py-4 rounded-full shadow-lg hover:bg-gray-800 dark:hover:bg-orange-600 transition transform active:scale-95 flex items-center justify-center"
                        >
                            Create Account <ArrowRight className="ml-2 h-5 w-5" />
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-gray-500 dark:text-gray-400">
                            Already have an account?{' '}
                            <Link to="/auth/login" className="font-bold text-primary hover:text-secondary">
                                Sign In
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;
