import React from 'react';
import { UserRole } from '../types';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'social';
    roleVariant?: UserRole;
    fullWidth?: boolean;
    children?: React.ReactNode;
    className?: string;
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
    type?: "button" | "submit" | "reset";
    disabled?: boolean;
}

export const Button = ({ children, variant = 'primary', roleVariant, fullWidth = false, className = '', ...props }: ButtonProps) => {
    const baseStyles = "px-4 py-2 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2";
    const widthStyle = fullWidth ? "w-full" : "";
    let variantStyle = "";

    // Role-based colors override default variant
    if (roleVariant) {
        switch (roleVariant) {
            case UserRole.FAN:
                variantStyle = "bg-mosport-fan hover:bg-blue-700 text-white shadow-lg shadow-blue-900/20";
                break;
            case UserRole.VENUE:
                variantStyle = "bg-mosport-venue hover:bg-pink-700 text-white shadow-lg shadow-pink-900/20";
                break;
            case UserRole.STAFF:
                variantStyle = "bg-mosport-staff hover:bg-gray-100 text-black shadow-lg";
                break;
        }
    } else {
        switch (variant) {
            case 'primary': variantStyle = "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-900/20"; break;
            case 'secondary': variantStyle = "bg-pink-600 hover:bg-pink-700 text-white shadow-lg shadow-pink-900/20"; break;
            case 'outline': variantStyle = "border border-gray-600 text-gray-300 hover:border-white hover:text-white"; break;
            case 'ghost': variantStyle = "text-gray-400 hover:text-white"; break;
            case 'social': variantStyle = "bg-gray-800 hover:bg-gray-700 text-white border border-gray-700"; break;
        }
    }

    return (
        <button className={`${baseStyles} ${widthStyle} ${variantStyle} ${className}`} {...props}>
            {children}
        </button>
    );
};
