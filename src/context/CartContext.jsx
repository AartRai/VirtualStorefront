import { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [coupon, setCoupon] = useState(null);
    const [discount, setDiscount] = useState(0);

    const addToCart = (product) => {
        setCartItems((prevItems) => {
            const existingItem = prevItems.find((item) => item.id === product.id);
            if (existingItem) {
                return prevItems.map((item) =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prevItems, { ...product, quantity: 1 }];
        });
    };

    const removeFromCart = (productId) => {
        setCartItems((prevItems) => prevItems.filter((item) => item.id !== productId));
    };

    const updateQuantity = (productId, quantity) => {
        if (quantity < 1) return;
        setCartItems((prevItems) =>
            prevItems.map((item) =>
                item.id === productId ? { ...item, quantity } : item
            )
        );
    };

    const clearCart = () => {
        setCartItems([]);
        setCoupon(null);
        setDiscount(0);
    };

    const applyCoupon = (code) => {
        if (code === 'WELCOME20') {
            setCoupon('WELCOME20');
            setDiscount(0.20); // 20%
            return { success: true, message: 'Coupon applied! 20% off.' };
        } else if (code === 'SAVE10') {
            setCoupon('SAVE10');
            setDiscount(0.10); // 10%
            return { success: true, message: 'Coupon applied! 10% off.' };
        } else {
            setCoupon(null);
            setDiscount(0);
            return { success: false, message: 'Invalid coupon code.' };
        }
    };

    const removeCoupon = () => {
        setCoupon(null);
        setDiscount(0);
    };

    const subtotal = cartItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
    );

    const discountAmount = subtotal * discount;
    const cartTotal = subtotal - discountAmount;
    const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);

    return (
        <CartContext.Provider
            value={{
                cartItems,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                subtotal,
                discount,
                discountAmount,
                cartTotal,
                cartCount,
                applyCoupon,
                removeCoupon,
                coupon
            }}
        >
            {children}
        </CartContext.Provider>
    );
};
