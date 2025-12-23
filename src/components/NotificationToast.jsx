import { useState, useEffect } from 'react';
import { useSocket } from '../context/SocketContext';
import { X, Bell } from 'lucide-react';

const NotificationToast = () => {
    const { socket } = useSocket();
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        if (!socket) return;

        socket.on('orderUpdated', (order) => {
            const newNotification = {
                id: Date.now(),
                message: `Order #${order._id.slice(-6)} update: ${order.status}`,
                type: 'info'
            };

            setNotifications(prev => [...prev, newNotification]);

            // Auto dismiss
            setTimeout(() => {
                setNotifications(prev => prev.filter(n => n.id !== newNotification.id));
            }, 5000);
        });

        return () => {
            socket.off('orderUpdated');
        };
    }, [socket]);

    if (notifications.length === 0) return null;

    return (
        <div className="fixed top-24 right-4 z-50 flex flex-col gap-2">
            {notifications.map(n => (
                <div key={n.id} className="bg-white dark:bg-gray-800 border-l-4 border-primary shadow-lg p-4 rounded-md flex items-start gap-3 w-80 animate-slide-in">
                    <div className="bg-primary/10 p-2 rounded-full text-primary">
                        <Bell size={18} />
                    </div>
                    <div className="flex-1">
                        <h4 className="font-bold text-sm text-gray-900 dark:text-white">Order Update</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{n.message}</p>
                    </div>
                    <button
                        onClick={() => setNotifications(prev => prev.filter(item => item.id !== n.id))}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        <X size={16} />
                    </button>
                </div>
            ))}
        </div>
    );
};

export default NotificationToast;
