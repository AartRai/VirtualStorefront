import { motion } from 'framer-motion';

const StatCard = ({ title, value, icon: Icon, color, shadowColor, delay = 0 }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay }}
            className={`${color} text-white rounded-xl p-6 shadow-lg ${shadowColor || 'shadow-gray-200'} hover:scale-105 transition-transform duration-300 relative overflow-hidden`}
        >
            <div className="relative z-10">
                <h3 className="text-sm font-medium opacity-90 mb-2">{title}</h3>
                <h2 className="text-3xl font-bold tracking-tight">{value}</h2>
            </div>

            {Icon && (
                <div className="absolute right-4 bottom-4 opacity-20 transform scale-150 rotate-12">
                    <Icon size={64} />
                </div>
            )}

            {/* Glossy Effect */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl"></div>
        </motion.div>
    );
};

export default StatCard;
