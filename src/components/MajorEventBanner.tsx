import { useState } from 'react';
import { X, Trophy } from 'lucide-react';
import { Button } from './Button';

interface MajorEventBannerProps {
    eventName: string;
    hypeText: string;
    ctaText: string;
    onCtaClick: () => void;
    icon?: React.ReactNode;
}

export const MajorEventBanner: React.FC<MajorEventBannerProps> = ({
    eventName,
    hypeText,
    ctaText,
    onCtaClick,
    icon
}) => {
    const [isVisible, setIsVisible] = useState(true);

    if (!isVisible) return null;

    return (
        <div className="relative mb-6 overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-[2px]">
            <div className="relative flex flex-col sm:flex-row items-center gap-4 bg-mosport-black rounded-xl p-4 sm:p-6">

                {/* LEFT: Event Icon */}
                <div className="shrink-0 w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full shadow-lg">
                    {icon || <Trophy size={32} className="text-white" />}
                </div>

                {/* CENTER: Event Info */}
                <div className="flex-1 text-center sm:text-left">
                    <h2 className="text-xl sm:text-2xl font-black text-white mb-1 tracking-tight">
                        {eventName}
                    </h2>
                    <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                        {hypeText}
                    </p>
                </div>

                {/* RIGHT: CTA Button */}
                <div className="shrink-0 flex items-center gap-3">
                    <Button
                        onClick={onCtaClick}
                        className="bg-white text-black hover:bg-gray-200 font-bold px-6 py-2 shadow-xl transition-all hover:scale-105"
                    >
                        {ctaText}
                    </Button>

                    {/* Hide Button */}
                    <button
                        onClick={() => setIsVisible(false)}
                        className="p-2 rounded-full hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
                        aria-label="Hide banner"
                    >
                        <X size={20} />
                    </button>
                </div>

            </div>
        </div>
    );
};
