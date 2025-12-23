
import React, { useState } from 'react';
import { Plus, Minus, HelpCircle } from 'lucide-react';

const FAQ = () => {
    const faqs = [
        {
            question: "How do I track my order?",
            answer: "Once your order is shipped, you will receive a confirmation email with a tracking number. You can also view the status in your Order History under 'My Profile'."
        },
        {
            question: "What payment methods do you accept?",
            answer: "We accept all major credit/debit cards (Visa, Mastercard, RuPay), UPI, Net Banking, and Wallet payments."
        },
        {
            question: "How can I return an item?",
            answer: "You can request a return within 7 days of delivery through your 'Orders' page. The item must be unused and in its original packaging."
        },
        {
            question: "Do you offer international shipping?",
            answer: "Currently, we only ship within India. We are working on expanding to international locations soon!"
        },
        {
            question: "How do I become a seller?",
            answer: "Click on 'Become a Seller' in the footer or signup page, register your business details, and start listing your products instantly."
        }
    ];

    const [openIndex, setOpenIndex] = useState(null);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-4">
                        <HelpCircle className="h-8 w-8 text-primary" />
                    </div>
                    <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl">Frequently Asked Questions</h1>
                    <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">Everything you need to know about LocalLift.</p>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div key={index} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-all duration-200">
                            <button
                                className="w-full px-6 py-4 text-left flex justify-between items-center focus:outline-none"
                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                            >
                                <span className="font-bold text-lg text-gray-800 dark:text-gray-200">{faq.question}</span>
                                {openIndex === index ? (
                                    <Minus className="h-5 w-5 text-primary" />
                                ) : (
                                    <Plus className="h-5 w-5 text-gray-400" />
                                )}
                            </button>
                            <div
                                className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${openIndex === index ? 'max-h-48 pb-6 opacity-100' : 'max-h-0 opacity-0'
                                    }`}
                            >
                                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{faq.answer}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FAQ;
