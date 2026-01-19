export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                mosport: {
                    black: '#000000',
                    dark: '#0A0A0A',
                    card: '#121212',
                    fan: '#2E5296',
                    venue: '#D62470',
                    staff: '#FFFFFF',
                    success: '#10B981',
                    warning: '#F59E0B',
                }
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
            animation: {
                fadeIn: 'fadeIn 0.5s ease-out',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0', transform: 'translateY(10px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                }
            }
        },
    },
    plugins: [],
}
