import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Cart = () => {
    const { cartItems, removeFromCart, updateQuantity, cartTotal, subtotal, discount, discountAmount } = useCart();

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
                <h2 className="text-3xl font-heading font-bold text-gray-900 dark:text-white mb-4">Your Cart is Empty</h2>
                <p className="text-gray-500 dark:text-gray-400 mb-8">Looks like you haven't added anything yet.</p>
                <Link
                    to="/shop"
                    className="bg-primary text-white px-8 py-3 rounded-md font-medium hover:bg-opacity-90 transition"
                >
                    Start Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-12 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-4xl font-bold text-dark dark:text-white mb-12">Shopping Cart</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-6">
                        {cartItems.map((item) => (
                            <div key={item._id} className="bg-white dark:bg-gray-800 p-6 rounded-[2rem] shadow-sm flex items-center hover:shadow-md transition">
                                <div className="w-24 h-24 bg-surface-alt dark:bg-gray-700 rounded-2xl p-2 flex-shrink-0">
                                    <img
                                        src={item.image || (item.images && item.images[0])}
                                        alt={item.name}
                                        className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal"
                                    />
                                </div>
                                <div className="ml-6 flex-1">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-xl font-bold text-dark dark:text-white">{item.name}</h3>
                                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{item.shop}</p>
                                        </div>
                                        <p className="text-xl font-bold text-primary">₹{(item.price * item.quantity).toLocaleString()}</p>
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-full p-1">
                                            <button
                                                onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                                className="w-8 h-8 rounded-full bg-white dark:bg-gray-600 shadow-sm flex items-center justify-center text-dark dark:text-white hover:bg-gray-50 dark:hover:bg-gray-500 transition"
                                            >
                                                <Minus className="h-4 w-4" />
                                            </button>
                                            <span className="px-4 font-bold text-dark dark:text-white">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                                className="w-8 h-8 rounded-full bg-white dark:bg-gray-600 shadow-sm flex items-center justify-center text-dark dark:text-white hover:bg-gray-50 dark:hover:bg-gray-500 transition"
                                            >
                                                <Plus className="h-4 w-4" />
                                            </button>
                                        </div>
                                        <button
                                            onClick={() => removeFromCart(item._id)}
                                            className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 flex items-center text-sm font-bold px-4 py-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 transition"
                                        >
                                            <Trash2 className="h-4 w-4 mr-2" /> Remove
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] shadow-lg relative lg:sticky top-0 lg:top-24">
                            <h2 className="text-2xl font-bold text-dark dark:text-white mb-8">Order Summary</h2>

                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                    <span>Subtotal</span>
                                    <span className="font-bold">₹{subtotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                    <span>Shipping</span>
                                    <span className="text-green-600 dark:text-green-400 font-bold">Free</span>
                                </div>
                                {discount > 0 && (
                                    <div className="flex justify-between text-primary font-bold">
                                        <span>Discount ({discount * 100}%)</span>
                                        <span>-₹{discountAmount.toLocaleString()}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                    <span>Tax</span>
                                    <span className="font-bold">₹0.00</span>
                                </div>
                                <div className="border-t border-gray-100 dark:border-gray-700 pt-6 flex justify-between items-end">
                                    <span className="text-lg font-bold text-dark dark:text-white">Total</span>
                                    <span className="text-3xl font-bold text-primary">₹{cartTotal.toLocaleString()}</span>
                                </div>
                            </div>

                            <Link
                                to="/checkout"
                                className="w-full bg-dark dark:bg-primary text-white py-4 rounded-full font-bold text-lg hover:bg-gray-800 dark:hover:bg-orange-600 transition flex items-center justify-center shadow-lg transform active:scale-95"
                            >
                                Proceed to Checkout <ArrowRight className="ml-2 h-5 w-5" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default Cart;
