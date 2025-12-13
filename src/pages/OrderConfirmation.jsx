import { useLocation, Link } from 'react-router-dom';
import { CheckCircle, Package, Truck, Home, Mail } from 'lucide-react';

const OrderConfirmation = () => {
    const location = useLocation();
    const { orderId, total, address } = location.state || { orderId: '000000', total: 0, address: {} };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 transition-colors duration-300">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] shadow-xl p-8 md:p-12 text-center">
                    <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
                    </div>

                    <h1 className="text-3xl font-bold text-dark dark:text-white mb-2">Order Placed Successfully!</h1>
                    <p className="text-gray-500 dark:text-gray-400 mb-8">Thank you for your purchase. Your order ID is <span className="font-bold text-dark dark:text-white">#{orderId}</span></p>

                    {/* Order Tracking Timeline */}
                    <div className="relative mb-12">
                        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-gray-200 dark:bg-gray-700 -z-10"></div>
                        <div className="flex justify-between">
                            {[
                                { icon: CheckCircle, label: 'Placed', active: true },
                                { icon: Package, label: 'Packed', active: false },
                                { icon: Truck, label: 'Shipped', active: false },
                                { icon: Home, label: 'Delivered', active: false },
                            ].map((step, index) => (
                                <div key={index} className="flex flex-col items-center bg-white dark:bg-gray-800 px-2">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 border-2 ${step.active ? 'bg-primary border-primary text-white' : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-400'}`}>
                                        <step.icon className="h-5 w-5" />
                                    </div>
                                    <span className={`text-xs font-bold ${step.active ? 'text-primary' : 'text-gray-400'}`}>{step.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-surface-alt dark:bg-gray-700 rounded-2xl p-6 text-left mb-8">
                        <h3 className="font-bold text-dark dark:text-white mb-4">Order Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold mb-1">Shipping Address</p>
                                <p className="text-sm font-bold text-dark dark:text-white">{address?.name}</p>
                                <p className="text-sm text-dark dark:text-white">{address?.street}</p>
                                <p className="text-sm text-dark dark:text-white">{address?.city}, {address?.state} {address?.zip}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold mb-1">Order Summary</p>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-gray-600 dark:text-gray-300">Total Amount</span>
                                    <span className="font-bold text-dark dark:text-white">₹{total.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600 dark:text-gray-300">Payment Method</span>
                                    <span className="font-bold text-dark dark:text-white">Credit Card</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-center space-x-2 text-sm text-gray-500 dark:text-gray-400 mb-8">
                        <Mail className="h-4 w-4" />
                        <span>Confirmation email sent to <strong>user@example.com</strong></span>
                    </div>

                    <div className="flex justify-center space-x-4">
                        <Link to="/shop" className="px-8 py-3 bg-dark dark:bg-primary text-white font-bold rounded-full hover:bg-gray-800 dark:hover:bg-orange-600 transition shadow-lg">
                            Continue Shopping
                        </Link>
                        <Link to="/dashboard" className="px-8 py-3 bg-white dark:bg-gray-700 text-dark dark:text-white border-2 border-gray-200 dark:border-gray-600 font-bold rounded-full hover:bg-gray-50 dark:hover:bg-gray-600 transition">
                            View Order
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderConfirmation;
