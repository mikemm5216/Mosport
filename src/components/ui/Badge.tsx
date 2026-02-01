import React from 'react';

interface BadgeProps {
    children: React.ReactNode;
    variant?: 'default' | 'success' | 'warning' | 'danger' | 'outline';
    className?: string;
}

export const Badge = ({ children, variant = 'default', className = '' }: BadgeProps) => {
    let variantStyles = '';

    switch (variant) {
        case 'success':
            variantStyles = 'bg-green-500/10 text-green-400 border-green-500/30';
            break;
        case 'warning':
            variantStyles = 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30';
            break;
        case 'danger':
            variantStyles = 'bg-red-500/10 text-red-400 border-red-500/30';
            break;
        case 'outline':
            variantStyles = 'bg-transparent text-gray-400 border-gray-600';
            break;
        default:
            variantStyles = 'bg-mosport-venue/10 text-mosport-venue border-mosport-venue/20';
    }

    return (
        <span className={`inline-flex items-center text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${variantStyles} ${className}`}>
            {children}
        </span>
    );
};
