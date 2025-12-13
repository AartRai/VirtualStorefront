import { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(() => {
        const savedCart = localStorage.getItem('cartItems');
        return savedCart ? JSON.parse(savedCart) : [];
    });
    const [coupon, setCoupon] = useState(null);
    const [discount, setDiscount] = useState(0);

    const addToCart = (product) => {
        setCartItems((prevItems) => {
            const existingItem = prevItems.find((item) => item._id === product._id);
            let newItems;
            if (existingItem) {
                newItems = prevItems.map((item) =>
                    item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
                );
            } else {
                newItems = [...prevItems, { ...product, quantity: 1 }];
            }
            localStorage.setItem('cartItems', JSON.stringify(newItems));
            return newItems;
        });
    };

    const removeFromCart = (productId) => {
        setCartItems((prevItems) => {
            const newItems = prevItems.filter((item) => item._id !== productId);
            localStorage.setItem('cartItems', JSON.stringify(newItems));
            return newItems;
        });
    };

    const updateQuantity = (productId, quantity) => {
        if (quantity < 1) return;
        setCartItems((prevItems) => {
            const newItems = prevItems.map((item) =>
                item._id === productId ? { ...item, quantity } : item
            );
            localStorage.setItem('cartItems', JSON.stringify(newItems));
            return newItems;
        });
    };

    const clearCart = () => {
        setCartItems([]);
        localStorage.removeItem('cartItems');
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
