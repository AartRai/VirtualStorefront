import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { MapPin, CreditCard, Truck, Wallet, Check, Plus, Trash2, Tag, Smartphone } from 'lucide-react';
import MockPaymentModal from '../components/MockPaymentModal';

const Checkout = () => {
    const { cartItems, cartTotal, subtotal, discountAmount, discount, applyCoupon, removeCoupon, coupon, clearCart } = useCart();
    const { user, addresses, addAddress, removeAddress } = useAuth();
    const navigate = useNavigate();

    const [step, setStep] = useState(1); // 1: Address, 2: Payment
    const [selectedAddress, setSelectedAddress] = useState(addresses.length > 0 ? (addresses[0]._id || addresses[0].id) : null);
    const [paymentMethod, setPaymentMethod] = useState('card');
    const [couponInput, setCouponInput] = useState('');
    const [couponMessage, setCouponMessage] = useState('');
    const [isAddingAddress, setIsAddingAddress] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [newAddress, setNewAddress] = useState({ name: '', street: '', city: '', state: '', zip: '' });

    // Redirect if cart is empty
    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 text-dark dark:text-white">
                <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
                <button onClick={() => navigate('/shop')} className="px-6 py-3 bg-primary text-white rounded-full font-bold">
                    Start Shopping
                </button>
            </div>
        );
    }

    const handleApplyCoupon = () => {
        const result = applyCoupon(couponInput);
        setCouponMessage(result.message);
        if (result.success) setCouponInput('');
    };

    const handleAddAddress = (e) => {
        e.preventDefault();
        addAddress({ ...newAddress, name: 'New Address' }); // Simplified
        setIsAddingAddress(false);
        setNewAddress({ name: '', street: '', city: '', state: '', zip: '' });
    };

    const handlePlaceOrder = async (paymentDetails = null) => {
        try {
            // Prepare payload
            const items = cartItems.map(item => ({
                product: item._id,
                quantity: item.quantity
            }));

            const payload = {
                items,
                paymentInfo: paymentDetails || {
                    status: 'Pending',
                    method: paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online'
                }
            };

            // Attempt to submit to backend
            const res = await import('../api/axios').then(m => m.default.post('/orders', payload));

            clearCart();
            navigate('/order-confirmation', {
                state: {
                    orderId: res.data._id,
                    total: cartTotal,
                    address: addresses.find(a => (a._id || a.id) === selectedAddress) || newAddress
                }
            });

        } catch (err) {
            console.error("Order Failed:", err);
            alert('Order Failed: ' + (err.response?.data?.message || err.message));
        }
    };

    const handlePaymentSuccess = (details) => {
        setShowPaymentModal(false);
        handlePlaceOrder(details);
    };

    const handleProceed = () => {
        if (paymentMethod === 'online') {
            setShowPaymentModal(true);
        } else {
            handlePlaceOrder(); // COD
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-dark dark:text-white mb-8">Checkout</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Steps */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Step 1: Shipping Address */}
                        <div className={`bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm transition-all ${step === 1 ? 'ring-2 ring-primary' : ''}`}>
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-bold text-dark dark:text-white flex items-center">
                                    <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center mr-3 text-sm">1</div>
                                    Shipping Address
                                </h2>
                                {step > 1 && <button onClick={() => setStep(1)} className="text-primary text-sm font-bold">Edit</button>}
                            </div>

                            {step === 1 && (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {addresses.map((addr) => (
                                            <div
                                                key={addr._id || addr.id}
                                                onClick={() => setSelectedAddress(addr._id || addr.id)}
                                                className={`border-2 rounded-2xl p-4 cursor-pointer transition relative ${selectedAddress === (addr._id || addr.id) ? 'border-primary bg-orange-50 dark:bg-gray-700' : 'border-gray-200 dark:border-gray-700 hover:border-primary/50'}`}
                                            >
                                                {selectedAddress === (addr._id || addr.id) && <div className="absolute top-4 right-4 text-primary"><Check className="h-5 w-5" /></div>}
                                                <div className="font-bold text-dark dark:text-white mb-1">{addr.name}</div>
                                                <div className="text-sm text-gray-500 dark:text-gray-400">{addr.street}</div>
                                                <div className="text-sm text-gray-500 dark:text-gray-400">{addr.city}, {addr.state} {addr.zip}</div>
                                                <button onClick={(e) => { e.stopPropagation(); removeAddress(addr._id || addr.id); }} className="mt-3 text-xs text-red-500 hover:underline flex items-center"><Trash2 className="h-3 w-3 mr-1" /> Remove</button>
                                            </div>
                                        ))}

                                        <button
                                            onClick={() => setIsAddingAddress(true)}
                                            className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl p-4 flex flex-col items-center justify-center text-gray-500 hover:text-primary hover:border-primary transition min-h-[140px]"
                                        >
                                            <Plus className="h-8 w-8 mb-2" />
                                            <span className="font-bold">Add New Address</span>
                                        </button>
                                    </div>

                                    {isAddingAddress && (
                                        <div className="mt-6 bg-gray-50 dark:bg-gray-700 p-6 rounded-2xl animate-fade-in">
                                            <h3 className="font-bold text-dark dark:text-white mb-4">New Address Details</h3>
                                            <form onSubmit={handleAddAddress} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <input required placeholder="Street Address" className="p-3 rounded-xl border-none focus:ring-2 focus:ring-primary bg-white dark:bg-gray-800 dark:text-white" value={newAddress.street} onChange={e => setNewAddress({ ...newAddress, street: e.target.value })} />
                                                <input required placeholder="City" className="p-3 rounded-xl border-none focus:ring-2 focus:ring-primary bg-white dark:bg-gray-800 dark:text-white" value={newAddress.city} onChange={e => setNewAddress({ ...newAddress, city: e.target.value })} />
                                                <input required placeholder="State" className="p-3 rounded-xl border-none focus:ring-2 focus:ring-primary bg-white dark:bg-gray-800 dark:text-white" value={newAddress.state} onChange={e => setNewAddress({ ...newAddress, state: e.target.value })} />
                                                <input required placeholder="ZIP Code" className="p-3 rounded-xl border-none focus:ring-2 focus:ring-primary bg-white dark:bg-gray-800 dark:text-white" value={newAddress.zip} onChange={e => setNewAddress({ ...newAddress, zip: e.target.value })} />
                                                <div className="md:col-span-2 flex justify-end space-x-3 mt-2">
                                                    <button type="button" onClick={() => setIsAddingAddress(false)} className="px-4 py-2 text-gray-500 font-bold hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg">Cancel</button>
                                                    <button type="submit" className="px-6 py-2 bg-primary text-white font-bold rounded-lg hover:bg-secondary">Save Address</button>
                                                </div>
                                            </form>
                                        </div>
                                    )}

                                    <div className="pt-4">
                                        <button
                                            onClick={() => selectedAddress && setStep(2)}
                                            disabled={!selectedAddress}
                                            className="w-full md:w-auto px-8 py-3 bg-dark dark:bg-primary text-white font-bold rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-800 dark:hover:bg-orange-600 transition"
                                        >
                                            Continue to Payment
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Step 2: Payment Method */}
                        <div className={`bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm transition-all ${step === 2 ? 'ring-2 ring-primary' : 'opacity-60'}`}>
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-bold text-dark dark:text-white flex items-center">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm ${step === 2 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'}`}>2</div>
                                    Payment Method
                                </h2>
                            </div>

                            {step === 2 && (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {[
                                            { id: 'online', name: 'Online Payment (UPI/Card/Netbanking)', icon: CreditCard },
                                            { id: 'cod', name: 'Cash on Delivery', icon: Truck },
                                        ].map((method) => (
                                            <div
                                                key={method.id}
                                                onClick={() => setPaymentMethod(method.id)}
                                                className={`flex items-center p-4 border-2 rounded-2xl cursor-pointer transition ${paymentMethod === method.id ? 'border-primary bg-orange-50 dark:bg-gray-700' : 'border-gray-200 dark:border-gray-700 hover:border-primary/50'}`}
                                            >
                                                <div className={`p-2 rounded-full mr-3 ${paymentMethod === method.id ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-600 text-gray-500'}`}>
                                                    <method.icon className="h-5 w-5" />
                                                </div>
                                                <span className="font-bold text-dark dark:text-white">{method.name}</span>
                                                {paymentMethod === method.id && <Check className="ml-auto text-primary h-5 w-5" />}
                                            </div>
                                        ))}
                                    </div>



                                    <div className="pt-4 flex space-x-4">
                                        <button onClick={() => setStep(1)} className="px-6 py-3 text-gray-500 font-bold hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">Back</button>
                                        <button
                                            onClick={handleProceed}
                                            className="flex-1 px-8 py-3 bg-dark dark:bg-primary text-white font-bold rounded-full hover:bg-gray-800 dark:hover:bg-orange-600 transition shadow-lg transform active:scale-95"
                                        >
                                            Place Order (₹{cartTotal.toLocaleString()})
                                        </button>
                                    </div>

                                    {/* Mock Payment Modal */}
                                    {showPaymentModal && (
                                        <MockPaymentModal
                                            amount={cartTotal}
                                            onClose={() => setShowPaymentModal(false)}
                                            onSuccess={handlePaymentSuccess}
                                            onFailure={(msg) => {
                                                setShowPaymentModal(false);
                                                alert(msg);
                                            }}
                                        />
                                    )}
                                </div>
                            )}
                        </div>
                    </div>


                    {/* Right Column: Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm relative lg:sticky top-0 lg:top-24">
                            <h2 className="text-xl font-bold text-dark dark:text-white mb-6">Order Summary</h2>

                            <div className="space-y-4 mb-6 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                                {cartItems.map((item) => (
                                    <div key={item.id} className="flex items-center space-x-4">
                                        <div className="w-16 h-16 bg-surface-alt dark:bg-gray-700 rounded-xl p-2 flex-shrink-0">
                                            <img src={item.image} alt="" className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-bold text-dark dark:text-white truncate text-sm">{item.name}</h4>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">Qty: {item.quantity}</p>
                                        </div>
                                        <div className="font-bold text-dark dark:text-white text-sm">
                                            ₹{(item.price * item.quantity).toLocaleString()}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-gray-100 dark:border-gray-700 pt-4 space-y-2 mb-6">
                                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                    <span>Subtotal</span>
                                    <span>₹{subtotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                    <span>Shipping</span>
                                    <span className="text-green-500 font-bold">Free</span>
                                </div>
                                {discount > 0 && (
                                    <div className="flex justify-between text-primary font-bold">
                                        <span>Discount ({discount * 100}%)</span>
                                        <span>-₹{discountAmount.toLocaleString()}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-xl font-bold text-dark dark:text-white pt-2 border-t border-gray-100 dark:border-gray-700 mt-2">
                                    <span>Total</span>
                                    <span>₹{cartTotal.toLocaleString()}</span>
                                </div>
                            </div>

                            {/* Coupon Section */}
                            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-2xl">
                                <h3 className="font-bold text-sm text-dark dark:text-white mb-2 flex items-center">
                                    <Tag className="h-4 w-4 mr-2" /> Apply Coupon
                                </h3>
                                {coupon ? (
                                    <div className="flex justify-between items-center bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-3 py-2 rounded-xl text-sm font-bold">
                                        <span>{coupon} applied</span>
                                        <button onClick={removeCoupon} className="text-xs hover:underline">Remove</button>
                                    </div>
                                ) : (
                                    <div className="flex space-x-2">
                                        <input
                                            value={couponInput}
                                            onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                                            placeholder="Code"
                                            className="flex-1 p-2 rounded-xl border-none focus:ring-2 focus:ring-primary text-sm bg-white dark:bg-gray-800 dark:text-white"
                                        />
                                        <button onClick={handleApplyCoupon} className="px-4 py-2 bg-dark dark:bg-white dark:text-dark text-white text-sm font-bold rounded-xl hover:opacity-90">
                                            Apply
                                        </button>
                                    </div>
                                )}
                                {couponMessage && <p className={`text-xs mt-2 ${couponMessage.includes('applied') ? 'text-green-500' : 'text-red-500'}`}>{couponMessage}</p>}
                                <p className="text-xs text-gray-400 mt-2">Try: WELCOME20 or SAVE10</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
