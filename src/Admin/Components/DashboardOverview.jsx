import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { TrendingUp, ShoppingBag, Loader2, Package, CheckCircle, XCircle, DollarSign, BarChart3, ArrowUpRight, Clock } from 'lucide-react';
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
    PieChart, Pie, Cell, LineChart, Line, AreaChart, Area, Legend 
} from 'recharts';

const COLORS = ['#f59e0b', '#3b82f6', '#10b981', '#ef4444'];
const STATUS_COLORS = { pending: '#f59e0b', dispatched: '#3b82f6', cleared: '#10b981', cancelled: '#ef4444' };

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white border border-gray-200 rounded-xl p-3 shadow-lg">
                <p className="text-sm font-bold text-gray-900 mb-1">{label}</p>
                {payload.map((entry, idx) => (
                    <p key={idx} className="text-xs text-gray-600">
                        <span className="inline-block w-2 h-2 rounded-full mr-1.5" style={{ backgroundColor: entry.color }}></span>
                        {entry.name}: <span className="font-bold text-gray-900">
                            {entry.name.toLowerCase().includes('revenue') ? `Rs ${entry.value.toLocaleString()}` : entry.value}
                        </span>
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

const DashboardOverview = ({ user }) => {
    const { token } = useSelector(state => state.auth);
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${token}` } };
                const res = await axios.get('http://localhost:5000/api/orders/analytics', config);
                setAnalytics(res.data);
            } catch (error) {
                console.error("Error fetching analytics", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAnalytics();
    }, [token]);

    if (loading) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin text-gray-800 mx-auto mb-4" />
                    <p className="text-gray-500 font-medium">Loading analytics...</p>
                </div>
            </div>
        );
    }

    const pieData = [
        { name: 'Pending', value: analytics?.pendingOrders || 0 },
        { name: 'Dispatched', value: analytics?.dispatchedOrders || 0 },
        { name: 'Cleared', value: analytics?.clearedOrders || 0 },
        { name: 'Cancelled', value: analytics?.cancelledOrders || 0 }
    ].filter(data => data.value > 0);

    const monthlyData = analytics?.monthlyRevenue || [];
    const dailyData = analytics?.dailyOrders || [];

    const statCards = [
        {
            title: 'Total Revenue',
            value: `Rs ${(analytics?.totalRevenue || 0).toLocaleString()}`,
            icon: DollarSign,
            color: 'emerald',
            bgClass: 'bg-emerald-50 border-emerald-200',
            iconClass: 'text-emerald-500',
            valueClass: 'text-emerald-700'
        },
        {
            title: 'Total Orders',
            value: analytics?.totalOrders || 0,
            icon: ShoppingBag,
            color: 'blue',
            bgClass: 'bg-gray-50 border-gray-200',
            iconClass: 'text-gray-800',
            valueClass: 'text-black'
        },
        {
            title: 'Cleared Orders',
            value: analytics?.clearedOrders || 0,
            icon: CheckCircle,
            color: 'emerald',
            bgClass: 'bg-emerald-50 border-emerald-200',
            iconClass: 'text-emerald-500',
            valueClass: 'text-emerald-700'
        },
        {
            title: 'Pending Orders',
            value: analytics?.pendingOrders || 0,
            icon: Clock,
            color: 'amber',
            bgClass: 'bg-amber-50 border-amber-200',
            iconClass: 'text-amber-500',
            valueClass: 'text-amber-700'
        }
    ];

    return (
        <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                {statCards.map((card, idx) => {
                    const Icon = card.icon;
                    return (
                        <div key={idx} className={`${card.bgClass} border rounded-2xl p-5 relative overflow-hidden`}>
                            <div className="absolute top-3 right-3 opacity-10">
                                <Icon className={`w-16 h-16 ${card.iconClass}`} />
                            </div>
                            <div className="relative z-10">
                                <div className={`w-10 h-10 ${card.bgClass} rounded-xl flex items-center justify-center mb-3`}>
                                    <Icon className={`w-5 h-5 ${card.iconClass}`} />
                                </div>
                                <p className="text-gray-600 font-medium text-sm mb-1">{card.title}</p>
                                <h3 className={`text-2xl font-black ${card.valueClass}`}>{card.value}</h3>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Charts Row 1: Revenue Line Chart + Daily Bar */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Monthly Revenue Area Chart */}
                <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">Monthly Revenue</h3>
                            <p className="text-xs text-gray-500 mt-0.5">Last 6 months breakdown</p>
                        </div>
                        <div className="p-2 bg-gray-50 rounded-lg">
                            <TrendingUp className="w-5 h-5 text-gray-800" />
                        </div>
                    </div>
                    <div className="h-[280px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={monthlyData}>
                                <defs>
                                    <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15}/>
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} />
                                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} tickFormatter={(v) => `${(v/1000).toFixed(0)}k`} />
                                <Tooltip content={<CustomTooltip />} />
                                <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#3b82f6" fill="url(#revenueGradient)" strokeWidth={2.5} dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Daily Orders Bar Chart */}
                <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">Daily Orders</h3>
                            <p className="text-xs text-gray-500 mt-0.5">Last 7 days activity</p>
                        </div>
                        <div className="p-2 bg-emerald-50 rounded-lg">
                            <BarChart3 className="w-5 h-5 text-emerald-500" />
                        </div>
                    </div>
                    <div className="h-[280px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={dailyData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} />
                                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} allowDecimals={false} />
                                <Tooltip content={<CustomTooltip />} />
                                <Bar dataKey="orders" name="Orders" fill="#10b981" radius={[6, 6, 0, 0]} barSize={32} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Charts Row 2: Status Pie + Monthly Orders Line */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Order Status Distribution */}
                <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">Order Status</h3>
                            <p className="text-xs text-gray-500 mt-0.5">Distribution breakdown</p>
                        </div>
                    </div>
                    <div className="h-[280px] w-full flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={75}
                                    outerRadius={105}
                                    paddingAngle={5}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="flex justify-center gap-6 mt-2">
                        {pieData.map((entry, index) => (
                            <div key={entry.name} className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }}></span>
                                <span className="text-sm text-gray-600 font-medium">{entry.name}</span>
                                <span className="text-sm font-bold text-gray-900">{entry.value}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Monthly Orders + Revenue Mixed Line Chart */}
                <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">Monthly Overview</h3>
                            <p className="text-xs text-gray-500 mt-0.5">Orders count per month</p>
                        </div>
                    </div>
                    <div className="h-[280px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={monthlyData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} />
                                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} allowDecimals={false} />
                                <Tooltip content={<CustomTooltip />} />
                                <Line type="monotone" dataKey="orders" name="Orders" stroke="#8b5cf6" strokeWidth={2.5} dot={{ r: 4, fill: '#8b5cf6', strokeWidth: 2, stroke: '#fff' }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Recent Orders */}
            {analytics?.recentOrders?.length > 0 && (
                <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-gray-900">Recent Orders</h3>
                        <span className="text-xs text-gray-400 font-medium">Last 5 orders</span>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="text-gray-500 border-b border-gray-100">
                                <tr>
                                    <th className="text-left py-3 font-semibold">Order ID</th>
                                    <th className="text-left py-3 font-semibold">Date</th>
                                    <th className="text-left py-3 font-semibold">Amount</th>
                                    <th className="text-left py-3 font-semibold">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {analytics.recentOrders.map((order) => (
                                    <tr key={order._id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                        <td className="py-3 font-mono text-gray-900 font-medium">
                                            #{order._id.substring(order._id.length - 6).toUpperCase()}
                                        </td>
                                        <td className="py-3 text-gray-600">
                                            {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                        </td>
                                        <td className="py-3 font-semibold text-gray-900">
                                            Rs {order.totalPrice?.toLocaleString()}
                                        </td>
                                        <td className="py-3">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold capitalize ${
                                                order.status === 'cleared' ? 'bg-emerald-100 text-emerald-800' :
                                                order.status === 'dispatched' ? 'bg-gray-100 text-black' :
                                                order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                                'bg-amber-100 text-amber-800'
                                            }`}>
                                                {order.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DashboardOverview;
