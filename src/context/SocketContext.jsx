import { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext();

export const useSocket = () => {
    return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const { user } = useAuth();

    useEffect(() => {
        if (user) {
            // Initialize socket connection
            // const newSocket = io('http://localhost:5000'); // Hardcoded for now, or use environment var
            const newSocket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000');

            newSocket.emit('join_user', user._id || user.id);

            setSocket(newSocket);

            return () => {
                newSocket.disconnect();
            };
        } else {
            // Clean up if user logs out
            if (socket) {
                socket.disconnect();
                setSocket(null);
            }
        }
    }, [user]);

    return (
        <SocketContext.Provider value={{ socket }}>
            {children}
        </SocketContext.Provider>
    );
};
