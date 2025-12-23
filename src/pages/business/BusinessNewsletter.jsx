import { useState } from 'react';
import { Mail, Send, Users, Activity } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../api/axios';

const BusinessNewsletter = () => {
    const [stats] = useState({
        subscribers: 1240,
        openRate: '24%',
        activeCampaigns: 2
    });

    const [loadng, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        subject: '',
        content: '',
        recipients: 'All Subscribers'
    });
    const [history, setHistory] = useState([
        { id: 1, subject: 'Summer Sale is Here!', date: '2023-06-15', status: 'Sent', opens: 450 },
        { id: 2, subject: 'New Collection Alert', date: '2023-05-20', status: 'Sent', opens: 380 },
    ]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/business/newsletter/send', formData);
            toast.success('Newsletter queued successfully!');
            setHistory([{ id: Date.now(), subject: formData.subject, date: new Date().toISOString().slice(0, 10), status: 'Queued', opens: 0 }, ...history]);
            setFormData({ subject: '', content: '', recipients: 'All Subscribers' });
        } catch (err) {
            console.error(err);
            toast.error('Failed to send newsletter');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                <Mail className="h-6 w-6 text-primary" /> Customer Newsletter
            </h1>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
                            <Users className="h-6 w-6" />
                        </div>
                        <span className="text-sm font-bold text-green-500">+12%</span>
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Total Subscribers</p>
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{stats.subscribers}</h3>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg text-purple-600 dark:text-purple-400">
                            <Activity className="h-6 w-6" />
                        </div>
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Avg. Open Rate</p>
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{stats.openRate}</h3>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Compose Form */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                    <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-6">Compose Email</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Recipients</label>
                            <select
                                value={formData.recipients}
                                onChange={(e) => setFormData({ ...formData, recipients: e.target.value })}
                                className="w-full p-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-primary"
                            >
                                <option>All Subscribers</option>
                                <option>Repeat Customers</option>
                                <option>Inactive (30+ days)</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Subject</label>
                            <input
                                required
                                value={formData.subject}
                                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                type="text"
                                className="w-full p-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-primary"
                                placeholder="e.g. Big Winter Sale!"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Content</label>
                            <textarea
                                required
                                value={formData.content}
                                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                rows="6"
                                className="w-full p-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-primary resize-none"
                                placeholder="Write your message here..."
                            ></textarea>
                        </div>
                        <button disabled={loadng} type="submit" className="w-full py-3 bg-primary text-white font-bold rounded-xl hover:bg-secondary transition flex items-center justify-center gap-2">
                            <Send className="h-4 w-4" /> {loadng ? 'Sending...' : 'Send Campaign'}
                        </button>
                    </form>
                </div>

                {/* History */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                    <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-6">Recent Campaigns</h2>
                    <div className="space-y-4">
                        {history.map(campaign => (
                            <div key={campaign.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
                                <div>
                                    <h4 className="font-bold text-gray-800 dark:text-white text-sm">{campaign.subject}</h4>
                                    <p className="text-xs text-gray-500 mt-1">{campaign.date}</p>
                                </div>
                                <div className="text-right">
                                    <span className={`text-xs px-2 py-1 rounded-full ${campaign.status === 'Sent' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                                        {campaign.status}
                                    </span>
                                    {campaign.opens > 0 && <p className="text-xs text-gray-500 mt-1">{campaign.opens} opens</p>}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BusinessNewsletter;
