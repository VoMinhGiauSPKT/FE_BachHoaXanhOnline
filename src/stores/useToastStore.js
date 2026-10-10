import { create } from 'zustand';

export const useToastStore = create((set) => ({
  toasts: [],

  /**
   * Hiển thị thông báo Toast
   * @param {{ type?: 'success'|'error'|'info'|'warning', message: string, duration?: number }} toast
   */
  addToast: ({ type = 'info', message, duration = 3500 }) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9);
    set((state) => ({
      toasts: [...state.toasts, { id, type, message }]
    }));

    if (duration > 0) {
      setTimeout(() => {
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id)
        }));
      }, duration);
    }
  },

  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id)
    }));
  }
}));

export const showToast = (message, type = 'info') => {
  useToastStore.getState().addToast({ message, type });
};

export default useToastStore;
