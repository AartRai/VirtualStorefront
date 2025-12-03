import { useState } from 'react';
import { CreditCard, Trash2, Plus, ShieldCheck } from 'lucide-react';

const Payments = () => {
    const [cards, setCards] = useState([
        { id: 1, type: 'Visa', last4: '4242', expiry: '12/28', holder: 'John Doe', isDefault: true },
        { id: 2, type: 'Mastercard', last4: '8899', expiry: '09/26', holder: 'John Doe', isDefault: false },
    ]);

    const [isAdding, setIsAdding] = useState(false);
    const [newCard, setNewCard] = useState({ number: '', expiry: '', cvc: '', holder: '' });

    const handleAddCard = (e) => {
        e.preventDefault();
        // Mock validation and addition
        const last4 = newCard.number.slice(-4) || '0000';
        setCards([...cards, {
            id: Date.now(),
            type: 'Visa', // Mock type detection
            last4,
            expiry: newCard.expiry,
            holder: newCard.holder,
            isDefault: false
        }]);
        setIsAdding(false);
        setNewCard({ number: '', expiry: '', cvc: '', holder: '' });
    };

    const removeCard = (id) => {
        if (window.confirm('Remove this card?')) {
            setCards(cards.filter(c => c.id !== id));
        }
    };

    const setDefault = (id) => {
        setCards(cards.map(c => ({ ...c, isDefault: c.id === id })));
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-dark dark:text-white">Payment Methods</h1>
                <button
                    onClick={() => setIsAdding(true)}
                    className="flex items-center px-4 py-2 bg-primary text-white rounded-lg font-bold hover:bg-secondary transition"
                >
                    <Plus className="h-5 w-5 mr-2" /> Add New Card
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {cards.map((card) => (
                    <div key={card.id} className={`relative p-6 rounded-2xl border-2 transition ${card.isDefault ? 'border-primary bg-orange-50 dark:bg-gray-800' : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'}`}>
                        {card.isDefault && (
                            <div className="absolute top-4 right-4 text-primary flex items-center text-xs font-bold bg-white dark:bg-gray-700 px-2 py-1 rounded-full shadow-sm">
                                <ShieldCheck className="h-3 w-3 mr-1" /> Default
                            </div>
                        )}

                        <div className="flex items-center mb-6">
                            <div className="w-12 h-8 bg-gray-200 dark:bg-gray-600 rounded flex items-center justify-center font-bold text-xs text-gray-500 dark:text-gray-300">
                                {card.type}
                            </div>
                            <div className="ml-4">
                                <p className="font-bold text-dark dark:text-white">•••• •••• •••• {card.last4}</p>
                                <p className="text-xs text-gray-500">Expires {card.expiry}</p>
                            </div>
                        </div>

                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                            <div className="text-sm font-medium text-gray-600 dark:text-gray-300">{card.holder}</div>
                            <div className="flex space-x-3">
                                {!card.isDefault && (
                                    <button onClick={() => setDefault(card.id)} className="text-xs font-bold text-primary hover:underline">
                                        Set Default
                                    </button>
                                )}
                                <button onClick={() => removeCard(card.id)} className="text-gray-400 hover:text-red-500 transition">
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {isAdding && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 w-full max-w-md shadow-2xl animate-fade-in">
                        <h2 className="text-xl font-bold text-dark dark:text-white mb-6">Add New Card</h2>
                        <form onSubmit={handleAddCard} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">Card Number</label>
                                <div className="relative">
                                    <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                                    <input
                                        required
                                        maxLength="19"
                                        placeholder="0000 0000 0000 0000"
                                        className="w-full pl-10 p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-dark dark:text-white focus:ring-2 focus:ring-primary outline-none"
                                        value={newCard.number}
                                        onChange={e => setNewCard({ ...newCard, number: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1">Expiry Date</label>
                                    <input
                                        required
                                        placeholder="MM/YY"
                                        className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-dark dark:text-white focus:ring-2 focus:ring-primary outline-none"
                                        value={newCard.expiry}
                                        onChange={e => setNewCard({ ...newCard, expiry: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1">CVC</label>
                                    <input
                                        required
                                        maxLength="3"
                                        placeholder="123"
                                        className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-dark dark:text-white focus:ring-2 focus:ring-primary outline-none"
                                        value={newCard.cvc}
                                        onChange={e => setNewCard({ ...newCard, cvc: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">Cardholder Name</label>
                                <input
                                    required
                                    placeholder="John Doe"
                                    className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-dark dark:text-white focus:ring-2 focus:ring-primary outline-none"
                                    value={newCard.holder}
                                    onChange={e => setNewCard({ ...newCard, holder: e.target.value })}
                                />
                            </div>
                            <div className="flex space-x-3 pt-4">
                                <button type="button" onClick={() => setIsAdding(false)} className="flex-1 py-3 font-bold text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl">Cancel</button>
                                <button type="submit" className="flex-1 py-3 bg-primary text-white font-bold rounded-xl hover:bg-secondary shadow-lg">Save Card</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Payments;
