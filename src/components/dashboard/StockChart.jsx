import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { motion } from 'framer-motion';

const StockChart = ({ data }) => {
    // data: { inStock: number, outOfStock: number }
    const chartData = data ? [
        { name: 'In Stock', value: data.inStock, color: '#22c55e' }, // Green
        { name: 'Out of Stock', value: data.outOfStock, color: '#ef4444' }, // Red
    ] : [
        { name: 'In Stock', value: 0, color: '#22c55e' },
        { name: 'Out of Stock', value: 0, color: '#ef4444' },
    ];

    const total = (data?.inStock || 0) + (data?.outOfStock || 0);
    const inStockPercentage = total > 0 ? Math.round((data.inStock / total) * 100) : 0;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow duration-300 flex flex-col items-center justify-center"
        >
            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-6 uppercase tracking-wider text-sm w-full text-center">Stock Status</h3>
            <div className="h-[200px] w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={chartData}
                            startAngle={180}
                            endAngle={0}
                            cx="50%"
                            cy="100%"
                            innerRadius={80}
                            outerRadius={100}
                            paddingAngle={2}
                            dataKey="value"
                            stroke="none"
                        >
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip />
                    </PieChart>
                </ResponsiveContainer>
                {/* Center Label for Gauge effect */}
                <div className="absolute top-[80%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                    <p className="text-2xl font-bold text-gray-800 dark:text-white">{inStockPercentage}%</p>
                    <p className="text-xs text-gray-500">Available</p>
                </div>
            </div>
            <div className="flex gap-4 text-xs font-bold text-gray-500 mt-4">
                <div className="flex items-center gap-1"><span className="w-2 h-2 bg-green-500 rounded-full"></span> In Stock</div>
                <div className="flex items-center gap-1"><span className="w-2 h-2 bg-red-500 rounded-full"></span> Out of Stock</div>
            </div>
        </motion.div>
    );
};

export default StockChart;
