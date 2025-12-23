
import React from 'react';
import { RefreshCw, PackageCheck, AlertCircle, CreditCard } from 'lucide-react';

const ReturnsPolicy = () => {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-16 px-4 transition-colors duration-300">
            <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-[2rem] shadow-xl overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-green-600 to-green-800 p-12 text-center text-white relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -ml-16 -mt-16"></div>
                    <RefreshCw className="h-16 w-16 mx-auto mb-6 text-green-200" />
                    <h1 className="text-4xl font-extrabold mb-2">Returns & Refunds</h1>
                    <p className="text-green-100 text-lg">Hassle-free 7-day return policy.</p>
                </div>

                <div className="p-8 md:p-12 space-y-12">
                    {/* Intro */}
                    <div className="text-center max-w-2xl mx-auto">
                        <p className="text-gray-600 dark:text-gray-400 text-lg">
                            We want you to love what you ordered! If something isn't right, let us know.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Policy Card 1 */}
                        <div className="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-2xl border border-gray-100 dark:border-gray-700">
                            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4">
                                <Clock className="h-5 w-5" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">7 Days to Return</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                You have 7 days from the date of delivery to request a return for eligible items.
                            </p>
                        </div>
                        {/* Policy Card 2 */}
                        <div className="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-2xl border border-gray-100 dark:border-gray-700">
                            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center text-purple-600 dark:text-purple-400 mb-4">
                                <PackageCheck className="h-5 w-5" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Condition</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Items must be unused, unwashed, and in original packaging with tags attached.
                            </p>
                        </div>
                    </div>

                    {/* Process */}
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                            How to Return
                        </h2>
                        <ol className="relative border-l border-gray-200 dark:border-gray-700 ml-3 space-y-8">
                            <li className="mb-10 ml-6">
                                <span className="absolute flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full -left-4 ring-4 ring-white dark:ring-gray-800 dark:bg-blue-900">
                                    <span className="font-bold text-blue-600 dark:text-blue-300">1</span>
                                </span>
                                <h3 className="font-bold text-lg leading-tight text-gray-900 dark:text-white mb-2">Initiate Request</h3>
                                <p className="text-gray-600 dark:text-gray-400">Go to My Orders, select the order, and click "Return". Choose your reason and submit.</p>
                            </li>
                            <li className="mb-10 ml-6">
                                <span className="absolute flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full -left-4 ring-4 ring-white dark:ring-gray-800 dark:bg-blue-900">
                                    <span className="font-bold text-blue-600 dark:text-blue-300">2</span>
                                </span>
                                <h3 className="font-bold text-lg leading-tight text-gray-900 dark:text-white mb-2">Pickup Scheduled</h3>
                                <p className="text-gray-600 dark:text-gray-400">Our courier partner will pick up the package within 2-3 business days.</p>
                            </li>
                            <li className="ml-6">
                                <span className="absolute flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full -left-4 ring-4 ring-white dark:ring-gray-800 dark:bg-blue-900">
                                    <span className="font-bold text-blue-600 dark:text-blue-300">3</span>
                                </span>
                                <h3 className="font-bold text-lg leading-tight text-gray-900 dark:text-white mb-2">Refund Processed</h3>
                                <p className="text-gray-600 dark:text-gray-400">Once verified at our warehouse, refund will be initiated to your original payment mode within 48 hours.</p>
                            </li>
                        </ol>
                    </div>

                    {/* Non-returnable */}
                    <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-2xl border border-red-100 dark:border-red-900/30 flex gap-4">
                        <AlertCircle className="h-6 w-6 text-red-500 flex-shrink-0 mt-0.5" />
                        <div>
                            <h3 className="font-bold text-red-700 dark:text-red-400 mb-1">Non-returnable Items</h3>
                            <p className="text-sm text-red-600 dark:text-red-300">
                                Personal hygiene products, beauty products (opened), and customized items are not eligible for return.
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

// Helper for icon (mocking usage since I didn't import Clock above, let's add it)
import { Clock } from 'lucide-react';

export default ReturnsPolicy;
