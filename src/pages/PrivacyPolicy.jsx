
import React from 'react';
import { Shield, Lock, Eye, Database } from 'lucide-react';

const PrivacyPolicy = () => {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-16 px-4 transition-colors duration-300">
            <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-[2rem] shadow-xl overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-gray-800 to-black p-12 text-center text-white relative overflow-hidden">
                    <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-16 -mb-16"></div>
                    <Shield className="h-16 w-16 mx-auto mb-6 text-gray-300" />
                    <h1 className="text-4xl font-extrabold mb-2">Privacy Policy</h1>
                    <p className="text-gray-400 text-lg">Your trust is our top priority.</p>
                </div>

                <div className="p-8 md:p-12 space-y-10">
                    <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
                        At LocalLift, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, and safeguard your data.
                    </p>

                    {/* Section 1 */}
                    <div className="border-l-4 border-primary pl-6">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <Database className="h-6 w-6 text-gray-400" /> Information We Collect
                        </h2>
                        <ul className="space-y-3 text-gray-600 dark:text-gray-400 list-disc list-inside">
                            <li><strong>Personal Information:</strong> Name, email address, phone number, shipping address.</li>
                            <li><strong>Payment Information:</strong> Processed securely by our payment partners; we do not store card details.</li>
                            <li><strong>Usage Data:</strong> Pages visited, device type, and interaction with our platform.</li>
                        </ul>
                    </div>

                    {/* Section 2 */}
                    <div className="border-l-4 border-secondary pl-6">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <Eye className="h-6 w-6 text-gray-400" /> How We Use Your Data
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-3">We use your information to:</p>
                        <ul className="space-y-3 text-gray-600 dark:text-gray-400 list-disc list-inside">
                            <li>Process and fulfill your orders.</li>
                            <li>Send order updates and shipment notifications.</li>
                            <li>Improve our website functionality and user experience.</li>
                            <li>Prevent fraud and ensure platform security.</li>
                        </ul>
                    </div>

                    {/* Section 3 */}
                    <div className="border-l-4 border-green-500 pl-6">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <Lock className="h-6 w-6 text-gray-400" /> Data Security
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400">
                            We implement industry-standard security measures, including SSL encryption, to protect your data during transmission and storage. Access to personal information is restricted to authorized personnel only.
                        </p>
                    </div>

                    {/* Contact */}
                    <div className="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-2xl mt-12 text-center">
                        <p className="text-gray-900 dark:text-white font-bold mb-2">Have questions about your privacy?</p>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">Contact our Data Protection Officer at <a href="mailto:privacy@locallift.com" className="text-primary hover:underline">privacy@locallift.com</a></p>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
