import { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../api/axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [addresses, setAddresses] = useState([]);

    useEffect(() => {
        const loadUser = async () => {
            const token = sessionStorage.getItem('token');
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
                    sessionStorage.removeItem('token');
                    sessionStorage.removeItem('user');
                    setUser(null);
                }
            }
            setLoading(false);
        };

        loadUser();
    }, []);

    const login = (token, userData) => {
        sessionStorage.setItem('token', token);
        setUser(userData);
        if (userData.addresses) {
            setAddresses(userData.addresses);
        }
    };

    const logout = () => {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
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
            toast.error(`Error: ${err.response?.status === 404 ? 'API Route not found (Restart Server)' : (err.response?.data?.message || 'Failed to add address')}`);
            return false;
        }
    };

    const removeAddress = async (id) => {
        try {
            const res = await api.delete(`/auth/address/${id}`);
            setAddresses(res.data);
            return true;
        } catch (err) {
            console.error("Remove Address Error:", err.response?.data || err.message);
            return false;
        }
    };

    const editAddress = async (id, updatedAddress) => {
        try {
            const res = await api.put(`/auth/address/${id}`, updatedAddress);
            setAddresses(res.data);
            return true;
        } catch (err) {
            console.error("Edit Address Failed:", err);
            return false;
        }
    };

    const updateUser = (updatedData) => {
        setUser(prev => ({ ...prev, ...updatedData }));
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, updateUser, loading, addresses, addAddress, removeAddress, editAddress }}>
            {children}
        </AuthContext.Provider>
    );
};
