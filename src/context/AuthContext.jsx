import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const [addresses, setAddresses] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            // In a real app, you would validate the token with the backend here
            // For now, we'll just assume the user is logged in if a token exists
            // You might want to store user info in localStorage as well to display it
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            } else {
                setUser({ name: 'User' }); // Fallback
            }

            // Mock addresses
            setAddresses([
                { id: 1, name: 'Home', street: '123 Main St', city: 'New York', state: 'NY', zip: '10001', default: true },
                { id: 2, name: 'Work', street: '456 Business Rd', city: 'San Francisco', state: 'CA', zip: '94107', default: false },
            ]);
        }
        setLoading(false);
    }, []);

    const login = (token, userData) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        // Mock addresses on login
        setAddresses([
            { id: 1, name: 'Home', street: '123 Main St', city: 'New York', state: 'NY', zip: '10001', default: true },
        ]);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        setAddresses([]);
    };

    const addAddress = (address) => {
        setAddresses(prev => [...prev, { ...address, id: Date.now() }]);
    };

    const removeAddress = (id) => {
        setAddresses(prev => prev.filter(addr => addr.id !== id));
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading, addresses, addAddress, removeAddress }}>
            {children}
        </AuthContext.Provider>
    );
};
