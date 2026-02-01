
import { Button } from './Button';

interface LandingPageProps {
    onLoginClick: () => void;
    isLoading?: boolean;
}

export const LandingPage = ({ onLoginClick, isLoading = false }: LandingPageProps) => {
    return (
        <div className="min-h-screen bg-mosport-black flex flex-col relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-pink-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center justify-center flex-1 px-4 text-center">
                <div className="mb-8 animate-fadeIn">
                    <div className="inline-flex items-center gap-3 mb-6">
                        <span className="text-6xl font-black italic tracking-tighter text-mosport-fan">MS</span>
                        <span className="text-4xl font-bold text-white tracking-widest">MOSPORT</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                        Find Your Game, <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-pink-500">
                            Anywhere.
                        </span>
                    </h1>
                    <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
                        The ultimate platform for sports fans to find the perfect venue in Vietnam.
                        Connect, cheer, and never miss a moment.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Button
                            variant="primary"
                            className="px-12 py-4 text-lg bg-gradient-to-r from-blue-600 to-pink-600 hover:from-blue-700 hover:to-pink-700 border-none shadow-2xl shadow-blue-900/40 disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={onLoginClick}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Loading...' : 'Start Your Journey'}
                        </Button>
                        <Button
                            variant="ghost"
                            className="px-8 py-4 text-lg text-gray-400 hover:text-white"
                            onClick={onLoginClick}
                            disabled={isLoading}
                        >
                            Skip (Browse as Guest)
                        </Button>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="relative z-10 py-6 text-center text-gray-600 text-sm font-mono uppercase tracking-widest">
                © 2024 Mosport Engineering. All Rights Reserved.
            </div>
        </div>
    );
};
