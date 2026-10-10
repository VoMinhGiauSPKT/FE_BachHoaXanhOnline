import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import cartService from '../services/cartService';
import useAuthStore from './useAuthStore';
import useToastStore from './useToastStore';
import { STORAGE_KEYS } from '../constants/storageKeys';

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      totalItems: 0,
      totalAmount: 0,
      isOpen: false,
      isLoading: false,

      // Điều khiển Cart Drawer
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      /**
       * Đồng bộ lại số lượng và tổng tiền từ items cục bộ
       */
      recalculateGuestTotals: (items) => {
        const totalItems = items.reduce((sum, item) => sum + (item.quantity || 1), 0);
        const totalAmount = items.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 1)), 0);
        return { items, totalItems, totalAmount };
      },

      /**
       * Tải giỏ hàng (từ server nếu đã đăng nhập CUSTOMER, hoặc giữ dữ liệu khách)
       */
      fetchCart: async () => {
        const { isAuthenticated, userType } = useAuthStore.getState();
        if (isAuthenticated && userType === 'CUSTOMER') {
          set({ isLoading: true });
          try {
            const res = await cartService.getCart();
            if (res.data) {
              set({
                items: res.data.items || [],
                totalItems: res.data.totalItems || 0,
                totalAmount: res.data.totalAmount || 0,
                isLoading: false
              });
              return res.data;
            }
          } catch (err) {
            console.warn('Lỗi khi tải giỏ hàng từ server:', err);
          } finally {
            set({ isLoading: false });
          }
        }
      },

      /**
       * Thêm sản phẩm vào giỏ hàng
       */
      addToCart: async (product, quantity = 1) => {
        const { isAuthenticated, userType } = useAuthStore.getState();
        const toast = useToastStore.getState().addToast;

        if (isAuthenticated && userType === 'CUSTOMER') {
          set({ isLoading: true });
          try {
            await cartService.addItem({ productId: product.productId || product.id, quantity });
            await get().fetchCart();
            toast({
              type: 'success',
              message: `Đã thêm "${product.productName || product.name}" vào giỏ hàng!`
            });
            return true;
          } catch (err) {
            toast({
              type: 'error',
              message: err.message || 'Không thể thêm sản phẩm vào giỏ'
            });
            return false;
          } finally {
            set({ isLoading: false });
          }
        } else {
          // Lưu trạng thái Guest
          const currentItems = [...get().items];
          const prodId = product.productId || product.id;
          const existingIndex = currentItems.findIndex(
            (it) => (it.productId || it.id) === prodId
          );

          if (existingIndex > -1) {
            currentItems[existingIndex].quantity += quantity;
            currentItems[existingIndex].itemTotal =
              currentItems[existingIndex].quantity * (currentItems[existingIndex].price || product.price);
          } else {
            currentItems.push({
              lineItemId: `guest_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
              productId: prodId,
              productName: product.productName || product.name,
              imageUrl: product.imageUrl || product.icon,
              unit: product.unit || 'Phần',
              price: product.price || 0,
              quantity: quantity,
              itemTotal: (product.price || 0) * quantity,
              availableStock: product.stock || 99
            });
          }

          const totals = get().recalculateGuestTotals(currentItems);
          set(totals);
          toast({
            type: 'success',
            message: `Đã thêm "${product.productName || product.name}" vào giỏ hàng!`
          });
          return true;
        }
      },

      /**
       * Cập nhật số lượng mặt hàng
       */
      updateQuantity: async (lineItemId, newQuantity) => {
        if (newQuantity <= 0) {
          return get().removeItem(lineItemId);
        }

        const { isAuthenticated, userType } = useAuthStore.getState();
        if (isAuthenticated && userType === 'CUSTOMER') {
          set({ isLoading: true });
          try {
            await cartService.updateItemQuantity(lineItemId, newQuantity);
            await get().fetchCart();
          } catch (err) {
            useToastStore.getState().addToast({
              type: 'error',
              message: err.message || 'Không thể cập nhật số lượng'
            });
          } finally {
            set({ isLoading: false });
          }
        } else {
          const currentItems = get().items.map((it) => {
            if (it.lineItemId === lineItemId) {
              return {
                ...it,
                quantity: newQuantity,
                itemTotal: it.price * newQuantity
              };
            }
            return it;
          });
          set(get().recalculateGuestTotals(currentItems));
        }
      },

      /**
       * Xóa một mặt hàng khỏi giỏ
       */
      removeItem: async (lineItemId) => {
        const { isAuthenticated, userType } = useAuthStore.getState();
        if (isAuthenticated && userType === 'CUSTOMER') {
          set({ isLoading: true });
          try {
            await cartService.removeItem(lineItemId);
            await get().fetchCart();
            useToastStore.getState().addToast({
              type: 'info',
              message: 'Đã xóa sản phẩm khỏi giỏ hàng'
            });
          } catch (err) {
            useToastStore.getState().addToast({
              type: 'error',
              message: err.message || 'Không thể xóa sản phẩm'
            });
          } finally {
            set({ isLoading: false });
          }
        } else {
          const currentItems = get().items.filter((it) => it.lineItemId !== lineItemId);
          set(get().recalculateGuestTotals(currentItems));
          useToastStore.getState().addToast({
            type: 'info',
            message: 'Đã xóa sản phẩm khỏi giỏ hàng'
          });
        }
      },

      /**
       * Làm sạch toàn bộ giỏ hàng
       */
      clearCart: async () => {
        const { isAuthenticated, userType } = useAuthStore.getState();
        if (isAuthenticated && userType === 'CUSTOMER') {
          try {
            await cartService.clearCart();
          } catch (e) {
            console.warn(e);
          }
        }
        set({ items: [], totalItems: 0, totalAmount: 0 });
        if (typeof window !== 'undefined') {
          localStorage.removeItem('bhx-guest-cart');
        }
      },

      /**
       * Đặt lại giỏ hàng rỗng và xóa cache localStorage (khi đăng xuất hoặc đăng nhập Admin)
       */
      resetCart: () => {
        set({ items: [], totalItems: 0, totalAmount: 0 });
        if (typeof window !== 'undefined') {
          localStorage.removeItem('bhx-guest-cart');
        }
      }
    }),
    {
      name: 'bhx-guest-cart',
      partialize: (state) => ({
        items: state.items,
        totalItems: state.totalItems,
        totalAmount: state.totalAmount
      })
    }
  )
);

export default useCartStore;

// Lắng nghe sự kiện reset giỏ hàng khi đăng xuất hoặc đổi quyền
if (typeof window !== 'undefined') {
  window.addEventListener('auth:cart-reset', () => {
    useCartStore.getState().resetCart();
  });
}
