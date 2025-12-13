import { useState } from 'react';
import { X, CheckCircle, AlertCircle, CreditCard, Wallet, Smartphone, Loader, QrCode } from 'lucide-react';

const MockPaymentModal = ({ amount, onClose, onSuccess, onFailure }) => {
    const [step, setStep] = useState('select'); // select, scan, processing, result
    const [method, setMethod] = useState('');
    const [status, setStatus] = useState(''); // success, failure

    const handlePayment = (selectedMethod) => {
        setMethod(selectedMethod);
        if (selectedMethod === 'UPI') {
            setStep('scan');
        } else {
            setStep('processing');
            // Simulate network delay
            setTimeout(() => {
                setStep('confirm');
            }, 1500);
        }
    };

    const handleScanComplete = () => {
        setStep('processing');
        setTimeout(() => {
            setStep('confirm');
        }, 1500);
    };

    const confirmPayment = (result) => {
        setStatus(result);
        setStep('result');

        setTimeout(() => {
            if (result === 'success') {
                onSuccess({
                    id: 'pay_' + Math.random().toString(36).substr(2, 9),
                    status: 'captured',
                    method: method
                });
            } else {
                onFailure('Payment Failed by User');
            }
        }, 1500);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white dark:bg-gray-800 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-700">

                {/* Header */}
                <div className="bg-gray-50 dark:bg-gray-900 p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center text-white font-bold text-xs">
                            DEMO
                        </div>
                        <h3 className="font-bold text-gray-900 dark:text-white">Secure Payment</h3>
                    </div>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6">
                    <div className="mb-6 text-center">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Total Amount</p>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white">₹{amount.toLocaleString()}</p>
                    </div>

                    {step === 'select' && (
                        <div className="space-y-3">
                            <p className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Select Payment Method</p>

                            <button
                                onClick={() => handlePayment('Card')}
                                className="w-full flex items-center p-4 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition group"
                            >
                                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-lg mr-4 group-hover:scale-110 transition-transform">
                                    <CreditCard className="w-5 h-5" />
                                </div>
                                <div className="text-left">
                                    <p className="font-bold text-gray-900 dark:text-white">Credit / Debit Card</p>
                                    <p className="text-xs text-gray-500">Visa, Mastercard, RuPay</p>
                                </div>
                            </button>

                            <button
                                onClick={() => handlePayment('UPI')}
                                className="w-full flex items-center p-4 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition group"
                            >
                                <div className="p-2 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-lg mr-4 group-hover:scale-110 transition-transform">
                                    <Smartphone className="w-5 h-5" />
                                </div>
                                <div className="text-left">
                                    <p className="font-bold text-gray-900 dark:text-white">UPI / QR</p>
                                    <p className="text-xs text-gray-500">Google Pay, PhonePe, Paytm</p>
                                </div>
                            </button>

                            <button
                                onClick={() => handlePayment('Wallet')}
                                className="w-full flex items-center p-4 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition group"
                            >
                                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded-lg mr-4 group-hover:scale-110 transition-transform">
                                    <Wallet className="w-5 h-5" />
                                </div>
                                <div className="text-left">
                                    <p className="font-bold text-gray-900 dark:text-white">Wallets</p>
                                    <p className="text-xs text-gray-500">Paytm, Amazon Pay</p>
                                </div>
                            </button>
                        </div>
                    )}

                    {step === 'scan' && (
                        <div className="flex flex-col items-center justify-center space-y-6">
                            <div className="p-4 bg-white rounded-2xl shadow-inner border border-gray-200">
                                <QrCode className="w-48 h-48 text-gray-800" />
                            </div>
                            <div className="text-center">
                                <p className="font-bold text-lg text-gray-900 dark:text-white mb-1">Scan to Pay</p>
                                <p className="text-sm text-gray-500">Use any UPI app to pay ₹{amount.toLocaleString()}</p>
                            </div>
                            <button
                                onClick={handleScanComplete}
                                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition"
                            >
                                Paid on Mobile
                            </button>
                        </div>
                    )}

                    {step === 'processing' && (
                        <div className="py-8 flex flex-col items-center justify-center text-center">
                            <Loader className="w-12 h-12 text-blue-600 animate-spin mb-4" />
                            <p className="font-bold text-gray-900 dark:text-white">Processing Payment...</p>
                            <p className="text-sm text-gray-500">Please do not close this window</p>
                        </div>
                    )}

                    {step === 'confirm' && (
                        <div className="py-4 space-y-4">
                            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-700 text-sm text-yellow-800 dark:text-yellow-200 mb-4">
                                <p><strong>Simulation Mode:</strong> Select the outcome of this transaction.</p>
                            </div>
                            <button
                                onClick={() => confirmPayment('success')}
                                className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition shadow-lg shadow-green-200 dark:shadow-none"
                            >
                                Simulate Success
                            </button>
                            <button
                                onClick={() => confirmPayment('failure')}
                                className="w-full py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition"
                            >
                                Simulate Failure
                            </button>
                        </div>
                    )}

                    {step === 'result' && (
                        <div className="py-8 flex flex-col items-center justify-center text-center">
                            {status === 'success' ? (
                                <>
                                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 text-green-600 animate-bounce">
                                        <CheckCircle className="w-10 h-10" />
                                    </div>
                                    <p className="text-xl font-bold text-green-600">Payment Successful!</p>
                                    <p className="text-sm text-gray-500">Redirecting...</p>
                                </>
                            ) : (
                                <>
                                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4 text-red-600">
                                        <AlertCircle className="w-10 h-10" />
                                    </div>
                                    <p className="text-xl font-bold text-red-600">Payment Failed</p>
                                    <p className="text-sm text-gray-500">Redirecting...</p>
                                </>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="bg-gray-50 dark:bg-gray-900 p-3 text-center border-t border-gray-100 dark:border-gray-700">
                    <p className="text-xs text-gray-400">Secured by MockPay &copy; 2025</p>
                </div>
            </div>
        </div>
    );
};

export default MockPaymentModal;
