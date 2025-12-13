import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowRight, ArrowLeft } from 'lucide-react';
import api from '../../api/axios';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');

        try {
            const res = await api.post('/auth/forgot-password', { email });
            setMessage('Email sent! Please check your inbox (or server console) for the reset link.');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send email');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] shadow-xl p-8 md:p-12 w-full max-w-lg relative overflow-hidden transition-colors duration-300">
                <div className="relative z-10">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-dark dark:text-white mb-2">Forgot Password?</h1>
                        <p className="text-gray-500 dark:text-gray-400">Enter your email to reset it.</p>
                    </div>

                    {message && <div className="bg-green-100 text-green-700 p-3 rounded-lg mb-4 text-center text-sm font-bold">{message}</div>}
                    {error && <div className="bg-red-100 text-red-600 p-3 rounded-lg mb-4 text-center text-sm font-bold">{error}</div>}

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

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-dark dark:bg-primary text-white font-bold py-4 rounded-full shadow-lg hover:bg-gray-800 dark:hover:bg-orange-600 transition transform active:scale-95 flex items-center justify-center disabled:opacity-50"
                        >
                            {loading ? 'Sending...' : 'Send Reset Link'} <ArrowRight className="ml-2 h-5 w-5" />
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <Link to="/auth/login" className="flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-dark dark:hover:text-white transition">
                            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
