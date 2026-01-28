
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

export const authService = {
    async loginGuest() {
        const response = await fetch(`${API_URL}/login/guest`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Guest login failed');
        }

        return response.json();
    }
};
