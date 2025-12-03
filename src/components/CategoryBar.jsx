import { Link } from 'react-router-dom';
import { Smartphone, Shirt, Laptop, Armchair, Tv, Plane, Gift, ShoppingBasket, Zap } from 'lucide-react';

const categories = [
    { name: 'Top Offers', icon: Zap, path: '/shop?category=offers' },
    { name: 'Mobiles', icon: Smartphone, path: '/shop?category=mobiles' },
    { name: 'Fashion', icon: Shirt, path: '/shop?category=fashion' },
    { name: 'Electronics', icon: Laptop, path: '/shop?category=electronics' },
    { name: 'Home', icon: Armchair, path: '/shop?category=home' },
    { name: 'Appliances', icon: Tv, path: '/shop?category=appliances' },
    { name: 'Travel', icon: Plane, path: '/shop?category=travel' },
    { name: 'Beauty', icon: Gift, path: '/shop?category=beauty' },
    { name: 'Grocery', icon: ShoppingBasket, path: '/shop?category=grocery' },
];

const CategoryBar = () => {
    return (
        <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-100 dark:border-gray-700 py-4 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between overflow-x-auto no-scrollbar gap-8 md:gap-0">
                    {categories.map((cat) => (
                        <Link
                            key={cat.name}
                            to={cat.path}
                            className="flex flex-col items-center min-w-[64px] group"
                        >
                            <div className="w-16 h-16 rounded-[1.5rem] bg-surface-alt dark:bg-gray-700 flex items-center justify-center mb-2 group-hover:bg-primary dark:group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-sm">
                                <cat.icon className="h-7 w-7 text-dark dark:text-white group-hover:text-white transition-colors" />
                            </div>
                            <span className="text-xs font-bold text-dark dark:text-gray-300 group-hover:text-primary dark:group-hover:text-primary transition-colors whitespace-nowrap">
                                {cat.name}
                            </span>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CategoryBar;
