import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [addresses, setAddresses] = useState([]);

    useEffect(() => {
        const loadUser = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    // Verify token and get user data
                    const res = await api.get('/auth');
                    setUser(res.data);

                    // Set real addresses from user data if available, otherwise fetch
                    if (res.data.addresses) {
                        setAddresses(res.data.addresses);
                    }
                } catch (err) {
                    console.error('Auth check failed:', err);
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    setUser(null);
                }
            }
            setLoading(false);
        };

        loadUser();
    }, []);

    const login = (token, userData) => {
        localStorage.setItem('token', token);
        setUser(userData);
        if (userData.addresses) {
            setAddresses(userData.addresses);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        setAddresses([]);
    };

    const addAddress = async (address) => {
        try {
            const res = await api.post('/auth/address', address);
            setAddresses(res.data);
            return true;
        } catch (err) {
            console.error("Add Address Failed:", err.response?.data?.message || err.message);
            alert(`Error: ${err.response?.status === 404 ? 'API Route not found (Restart Server)' : (err.response?.data?.message || 'Failed to add address')}`);
            return false;
        }
    };

    const removeAddress = async (id) => {
        try {
            const res = await api.delete(`/auth/address/${id}`);
            setAddresses(res.data);
            return true;
        } catch (err) {
            console.error(err);
            return false;
        }
    };

    const updateUser = (updatedData) => {
        setUser(prev => ({ ...prev, ...updatedData }));
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, updateUser, loading, addresses, addAddress, removeAddress }}>
            {children}
        </AuthContext.Provider>
    );
};
