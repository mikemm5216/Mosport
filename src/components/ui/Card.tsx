import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
}

export const Card = ({ children, className = '' }: CardProps) => {
    return (
        <div className={`bg-gray-900 border border-gray-800 rounded-xl shadow-lg ${className}`}>
            {children}
        </div>
    );
};

interface CardHeaderProps {
    children: React.ReactNode;
    className?: string;
}

export const CardHeader = ({ children, className = '' }: CardHeaderProps) => {
    return (
        <div className={`p-5 border-b border-gray-800 ${className}`}>
            {children}
        </div>
    );
};

export const CardTitle = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => {
    return (
        <h3 className={`text-lg font-bold text-white tracking-tight ${className}`}>
            {children}
        </h3>
    );
};

export const CardContent = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => {
    return (
        <div className={`p-5 ${className}`}>
            {children}
        </div>
    );
};
