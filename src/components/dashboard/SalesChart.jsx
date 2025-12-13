import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { motion } from 'framer-motion';

const SalesChart = ({ data }) => {
    // Fallback if no data provided
    const chartData = data && data.length > 0 ? data.map(item => ({
        name: new Date(0, item._id - 1).toLocaleString('default', { month: 'short' }), // Convert month number to name
        sales: item.sales
    })) : [];

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow duration-300"
        >
            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-6">Total Sales Overview (Last 12 Months)</h3>
            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value}`} />
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" className="dark:stroke-gray-700" />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#fff', borderRadius: '10px', padding: '10px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                            itemStyle={{ fontSize: '12px' }}
                            formatter={(value) => [`₹${value}`, 'Sales']}
                        />
                        <Legend iconType="circle" />
                        <Area type="monotone" dataKey="sales" stroke="#8884d8" fillOpacity={1} fill="url(#colorSales)" name="Sales" />
                    </AreaChart>
                </ResponsiveContainer>
                {chartData.length === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm">
                        No sales data available
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default SalesChart;
