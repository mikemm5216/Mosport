import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

export interface StatCardProps {
    title: string;
    value: string | number;
    change?: number;
    icon?: React.ReactNode;
    color?: 'blue' | 'green' | 'red' | 'purple' | 'yellow';
    subtitle?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
    title,
    value,
    change,
    icon,
    color = 'blue',
    subtitle
}) => {
    const colorClasses = {
        blue: 'border-blue-500/30 bg-blue-500/5',
        green: 'border-green-500/30 bg-green-500/5',
        red: 'border-red-500/30 bg-red-500/5',
        purple: 'border-purple-500/30 bg-purple-500/5',
        yellow: 'border-yellow-500/30 bg-yellow-500/5'
    };

    const iconColorClasses = {
        blue: 'text-blue-400',
        green: 'text-green-400',
        red: 'text-red-400',
        purple: 'text-purple-400',
        yellow: 'text-yellow-400'
    };

    return (
        <div className={`rounded-xl border ${colorClasses[color]} p-6 backdrop-blur-sm transition-all hover:scale-105`}>
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <p className="text-sm font-medium text-gray-400 uppercase tracking-wide">
                        {title}
                    </p>
                    <div className="mt-2 flex items-baseline gap-2">
                        <h3 className="text-3xl font-bold text-white">
                            {value}
                        </h3>
                        {change !== undefined && (
                            <span className={`flex items-center text-sm font-medium ${change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                {change >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                                {Math.abs(change)}%
                            </span>
                        )}
                    </div>
                    {subtitle && (
                        <p className="mt-1 text-xs text-gray-500">
                            {subtitle}
                        </p>
                    )}
                </div>
                {icon && (
                    <div className={`rounded-lg p-3 ${iconColorClasses[color]}`}>
                        {icon}
                    </div>
                )}
            </div>
        </div>
    );
};
