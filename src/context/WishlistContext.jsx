import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from './AuthContext'; // Assuming AuthContext exposes user/token state

const WishlistContext = createContext();

export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
    const { user } = useAuth(); // getting auth state
    const [wishlist, setWishlist] = useState([]);

    // Load initial wishlist
    useEffect(() => {
        const loadWishlist = async () => {
            if (user) {
                // If logged in, fetch from API
                try {
                    const res = await api.get('/wishlist');
                    setWishlist(res.data);
                } catch (err) {
                    console.error("Failed to fetch wishlist", err);
                }
            } else {
                // If guest, use localStorage
                const savedWishlist = localStorage.getItem('wishlist');
                if (savedWishlist) {
                    setWishlist(JSON.parse(savedWishlist));
                }
            }
        };

        loadWishlist();
    }, [user]);

    // Save to localStorage if guest (Effect for persistence across refreshes for guest)
    useEffect(() => {
        if (!user) {
            localStorage.setItem('wishlist', JSON.stringify(wishlist));
        }
    }, [wishlist, user]);


    const addToWishlist = async (product) => {
        // Optimistic update
        const isAlreadyIn = wishlist.find(item => item._id === product._id);
        if (isAlreadyIn) return;

        const newWishlist = [...wishlist, product];
        setWishlist(newWishlist);

        if (user) {
            try {
                await api.post(`/wishlist/add/${product._id}`);
                // Optional: setWishlist(res.data) to ensure consistency, 
                // but optimistic update is faster.
            } catch (err) {
                console.error("Failed to add to server wishlist", err);
                // Revert on failure
                setWishlist(wishlist);
            }
        }
    };

    const removeFromWishlist = async (productId) => {
        // Optimistic update
        const newWishlist = wishlist.filter(item => item._id !== productId);
        setWishlist(newWishlist);

        if (user) {
            try {
                await api.delete(`/wishlist/remove/${productId}`);
            } catch (err) {
                console.error("Failed to remove from server wishlist", err);
                // Revert? Complex without previous state, usually safe to ignore or refetch
            }
        }
    };

    const isInWishlist = (productId) => {
        return wishlist.some(item => item._id === productId);
    };

    const toggleWishlist = (product) => {
        if (isInWishlist(product._id)) {
            removeFromWishlist(product._id);
        } else {
            addToWishlist(product);
        }
    };

    return (
        <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, isInWishlist, toggleWishlist }}>
            {children}
        </WishlistContext.Provider>
    );
};
