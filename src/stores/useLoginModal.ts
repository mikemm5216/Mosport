import { create } from 'zustand';

interface LoginModalState {
    isOpen: boolean;
    onSuccessCallback: (() => void) | null;
    openLoginModal: (options?: { onSuccess?: () => void }) => void;
    closeLoginModal: () => void;
}

export const useLoginModal = create<LoginModalState>((set) => ({
    isOpen: false,
    onSuccessCallback: null,

    openLoginModal: (options) => {
        set({
            isOpen: true,
            onSuccessCallback: options?.onSuccess || null,
        });
    },

    closeLoginModal: () => {
        set({
            isOpen: false,
            onSuccessCallback: null,
        });
    },
}));
