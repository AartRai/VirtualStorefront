
import React from 'react';
import { Truck, MapPin, Clock, Globe } from 'lucide-react';

const ShippingPolicy = () => {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-16 px-4 transition-colors duration-300">
            <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-[2rem] shadow-xl overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-12 text-center text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                    <Truck className="h-16 w-16 mx-auto mb-6 text-blue-200" />
                    <h1 className="text-4xl font-extrabold mb-2">Shipping Policy</h1>
                    <p className="text-blue-100 text-lg">Fast, reliable, and transparent delivery.</p>
                </div>

                <div className="p-8 md:p-12 space-y-12">
                    {/* Section 1 */}
                    <div className="flex gap-6">
                        <div className="flex-shrink-0">
                            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400">
                                <Clock className="h-6 w-6" />
                            </div>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Processing Time</h2>
                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                All orders are processed within <strong>1-2 business days</strong>. Orders are not shipped or delivered on weekends or holidays. If we are experiencing a high volume of orders, shipments may be delayed by a few days.
                            </p>
                        </div>
                    </div>

                    {/* Section 2 */}
                    <div className="flex gap-6">
                        <div className="flex-shrink-0">
                            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-green-600 dark:text-green-400">
                                <Truck className="h-6 w-6" />
                            </div>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Shipping Rates & Delivery Estimates</h2>
                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                                Shipping charges for your order will be calculated and displayed at checkout.
                            </p>
                            <div className="overflow-x-auto">
                                <table className="min-w-full text-sm text-left text-gray-600 dark:text-gray-400">
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-200">
                                        <tr>
                                            <th className="px-6 py-3">Shipping Method</th>
                                            <th className="px-6 py-3">Estimated Delivery</th>
                                            <th className="px-6 py-3">Cost</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr className="bg-white dark:bg-gray-800 border-b dark:border-gray-700">
                                            <td className="px-6 py-4 font-medium">Standard Shipping</td>
                                            <td className="px-6 py-4">3-5 business days</td>
                                            <td className="px-6 py-4">Free (Orders over ₹500)</td>
                                        </tr>
                                        <tr className="bg-white dark:bg-gray-800 border-b dark:border-gray-700">
                                            <td className="px-6 py-4 font-medium">Express Shipping</td>
                                            <td className="px-6 py-4">1-2 business days</td>
                                            <td className="px-6 py-4">₹150</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Section 3 */}
                    <div className="flex gap-6">
                        <div className="flex-shrink-0">
                            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center text-purple-600 dark:text-purple-400">
                                <MapPin className="h-6 w-6" />
                            </div>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Shipment Confirmation & Order Tracking</h2>
                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                You will receive a Shipment Confirmation email once your order has shipped containing your tracking number(s). The tracking number will be active within 24 hours.
                            </p>
                        </div>
                    </div>
                    {/* Section 4 */}
                    <div className="flex gap-6">
                        <div className="flex-shrink-0">
                            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center text-orange-600 dark:text-orange-400">
                                <Globe className="h-6 w-6" />
                            </div>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">International Shipping</h2>
                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                We currently do not ship outside of India. Stay tuned for updates!
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShippingPolicy;
