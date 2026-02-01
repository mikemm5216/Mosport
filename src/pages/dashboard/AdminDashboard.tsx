import React from 'react';
import { DashboardLayout } from '../../components/dashboard/DashboardLayout';
import { StatCard } from '../../components/dashboard/StatCard';
import { UserRole } from '../../types';
import { Users, Activity, TrendingUp, Target, BarChart3, Radio } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
    return (
        <DashboardLayout role={UserRole.ADMIN}>
            <div className="space-y-8">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-white">Platform Overview 👑</h1>
                    <p className="mt-1 text-gray-400">Monitor platform health and key metrics</p>
                </div>

                {/* KPI Grid */}
                <div>
                    <h2 className="text-xl font-bold text-white mb-4">Key Performance Indicators</h2>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        <StatCard
                            title="Daily Active Users"
                            value="12,458"
                            change={8.3}
                            icon={<Users className="h-6 w-6" />}
                            color="blue"
                            subtitle="Last 24 hours"
                        />
                        <StatCard
                            title="Active Venues"
                            value="347"
                            icon={<Radio className="h-6 w-6" />}
                            color="green"
                            subtitle="520 total (66.7%)"
                        />
                        <StatCard
                            title="Conversion Rate"
                            value="34.2%"
                            change={2.1}
                            icon={<Target className="h-6 w-6" />}
                            color="purple"
                        />
                        <StatCard
                            title="Total Revenue"
                            value="$45,230"
                            change={12}
                            icon={<TrendingUp className="h-6 w-6" />}
                            color="yellow"
                            subtitle="This month"
                        />
                    </div>
                </div>

                {/* Event Analytics */}
                <div>
                    <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <Activity className="h-5 w-5 text-blue-400" />
                        Top Favorited Matches 🔥
                    </h2>
                    <div className="bg-gray-900/50 rounded-xl border border-gray-800 overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-gray-800/50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Event</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Favorites</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Venues</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800">
                                <tr className="hover:bg-gray-800/30 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-2">
                                            <span className="text-2xl">⚽</span>
                                            <div>
                                                <p className="text-sm font-medium text-white">英超 曼聯 vs 利物浦</p>
                                                <p className="text-xs text-gray-500">Premier League</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-lg font-semibold text-green-400">12,300</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-sm text-gray-400">587 場地</span>
                                    </td>
                                </tr>
                                <tr className="hover:bg-gray-800/30 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-2">
                                            <span className="text-2xl">🏎️</span>
                                            <div>
                                                <p className="text-sm font-medium text-white">F1 越南大獎賽</p>
                                                <p className="text-xs text-gray-500">Formula 1</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-lg font-semibold text-green-400">5,420</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-sm text-gray-400">342 場地</span>
                                    </td>
                                </tr>
                                <tr className="hover:bg-gray-800/30 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-2">
                                            <span className="text-2xl">🏀</span>
                                            <div>
                                                <p className="text-sm font-medium text-white">NBA 湖人 vs 勇士</p>
                                                <p className="text-xs text-gray-500">NBA</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-lg font-semibold text-green-400">3,890</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-sm text-gray-400">234 場地</span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Venue Leaderboard */}
                <div>
                    <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <BarChart3 className="h-5 w-5 text-yellow-400" />
                        Top Performing Venues 🏆
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-6">
                            <h3 className="text-lg font-semibold text-white mb-4">人氣王 (Most Popular)</h3>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-white">🍻 Puku Bar, Hanoi</p>
                                        <p className="text-xs text-gray-500">⭐ 4.8/5.0</p>
                                    </div>
                                    <span className="text-sm font-semibold text-yellow-400">1,234 收藏</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-white">🍺 Sports Hub, HCMC</p>
                                        <p className="text-xs text-gray-500">⭐ 4.6/5.0</p>
                                    </div>
                                    <span className="text-sm font-semibold text-yellow-400">987 收藏</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-6">
                            <h3 className="text-lg font-semibold text-white mb-4">流量王 (Most Check-ins)</h3>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-white">🏟️ Arena Lounge, Da Nang</p>
                                        <p className="text-xs text-gray-500">+15% growth</p>
                                    </div>
                                    <span className="text-sm font-semibold text-green-400">456 簽到</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-white">🍻 Puku Bar, Hanoi</p>
                                        <p className="text-xs text-gray-500">+8% growth</p>
                                    </div>
                                    <span className="text-sm font-semibold text-green-400">389 簽到</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* System Health */}
                <div>
                    <h2 className="text-xl font-bold text-white mb-4">System Health 🔧</h2>
                    <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <h3 className="text-sm font-medium text-gray-400 mb-3">API Health</h3>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-300">Google OAuth</span>
                                        <span className="text-sm font-semibold text-green-400">✅ 99.2%</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-300">Facebook Login</span>
                                        <span className="text-sm font-semibold text-yellow-400">⚠️ 95.8%</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-300">Zalo Login</span>
                                        <span className="text-sm font-semibold text-green-400">✅ 98.5%</span>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-sm font-medium text-gray-400 mb-3">Broadcaster Status</h3>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-300">🟢 Online</span>
                                        <span className="text-sm font-semibold text-green-400">312 (90%)</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-300">🔴 Offline</span>
                                        <span className="text-sm font-semibold text-red-400">28 (8%)</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-300">🟡 Degraded</span>
                                        <span className="text-sm font-semibold text-yellow-400">7 (2%)</span>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-sm font-medium text-gray-400 mb-3">Server Metrics</h3>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-300">Uptime</span>
                                        <span className="text-sm font-semibold text-green-400">99.8%</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-300">Avg Response</span>
                                        <span className="text-sm font-semibold text-blue-400">45ms</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-300">Error Rate</span>
                                        <span className="text-sm font-semibold text-green-400">0.2%</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};
