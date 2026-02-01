import { ButtonHTMLAttributes } from 'react';

interface SwitchProps {
    checked: boolean;
    onCheckedChange: (checked: boolean) => void;
    className?: string;
    disabled?: boolean;
}

export const Switch = ({ checked, onCheckedChange, className = '', disabled = false }: SwitchProps) => {
    return (
        <button
            role="switch"
            aria-checked={checked}
            onClick={() => !disabled && onCheckedChange(!checked)}
            disabled={disabled}
            className={`
                relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                ${checked ? 'bg-blue-600' : 'bg-gray-700'}
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                ${className}
            `}
        >
            <span
                className={`
                    inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                    ${checked ? 'translate-x-6' : 'translate-x-1'}
                `}
            />
        </button>
    );
};
