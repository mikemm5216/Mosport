import React from 'react';
import { DashboardLayout } from '../../components/dashboard/DashboardLayout';
import { StatCard } from '../../components/dashboard/StatCard';
import { UserRole } from '../../types';
import { Users, TrendingUp, Award, Activity } from 'lucide-react';

export const FanDashboard: React.FC = () => {
    return (
        <DashboardLayout role={UserRole.FAN}>
            <div className="space-y-8">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-white">Welcome Back! 🎉</h1>
                    <p className="mt-1 text-gray-400">Discover upcoming matches and your favorite venues</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    <StatCard
                        title="Mosport Points"
                        value="1,250"
                        change={15}
                        icon={<Award className="h-6 w-6" />}
                        color="yellow"
                        subtitle="Bronze Tier"
                    />
                    <StatCard
                        title="Saved Matches"
                        value="8"
                        icon={<Activity className="h-6 w-6" />}
                        color="blue"
                        subtitle="This week"
                    />
                    <StatCard
                        title="Favorite Venues"
                        value="12"
                        icon={<Users className="h-6 w-6" />}
                        color="green"
                    />
                    <StatCard
                        title="Check-ins"
                        value="23"
                        change={5}
                        icon={<TrendingUp className="h-6 w-6" />}
                        color="purple"
                        subtitle="This month"
                    />
                </div>

                {/* My Favorites Section */}
                <div>
                    <h2 className="text-2xl font-bold text-white mb-4">My Favorites ⭐</h2>
                    <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-6">
                        <p className="text-gray-400 text-center py-8">
                            收藏的賽事和場地將顯示在這裡
                        </p>
                    </div>
                </div>

                {/* Nearby Venues Section */}
                <div>
                    <h2 className="text-2xl font-bold text-white mb-4">Nearby Venues 📍</h2>
                    <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-6">
                        <p className="text-gray-400 text-center py-8">
                            附近正在轉播的場地將顯示在這裡
                        </p>
                    </div>
                </div>

                {/* My Wallet Section */}
                <div>
                    <h2 className="text-2xl font-bold text-white mb-4">My Wallet 💰</h2>
                    <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="text-lg font-semibold text-white mb-2">My Vouchers</h3>
                                <p className="text-gray-400 text-sm">No active vouchers</p>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-white mb-2">Recent Transactions</h3>
                                <p className="text-gray-400 text-sm">No recent activity</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};
