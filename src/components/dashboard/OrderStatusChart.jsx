import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { motion } from 'framer-motion';

const OrderStatusChart = ({ data }) => {
    // Colors for different statuses
    const COLORS = {
        'Pending': '#facc15', // Yellow
        'Processing': '#8b5cf6', // Violet
        'Shipped': '#3b82f6', // Blue
        'Delivered': '#4ade80', // Green
        'Cancelled': '#ef4444', // Red
        'Returned': '#a855f7' // Purple
    };

    const chartData = data && data.length > 0 ? data.map(item => ({
        name: item._id,
        value: item.count,
        color: COLORS[item._id] || '#9ca3af' // Default gray
    })) : [];

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow duration-300 flex flex-col items-center justify-center"
        >
            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-6 uppercase tracking-wider text-sm w-full text-center">Order Status</h3>
            <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                            stroke="none"
                        >
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
                        />
                        <Legend
                            align="center"
                            verticalAlign="bottom"
                            iconType="circle"
                            iconSize={8}
                            formatter={(value) => <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 ml-1">{value}</span>}
                        />
                    </PieChart>
                </ResponsiveContainer>
                {chartData.length === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm">
                        No order data
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default OrderStatusChart;
