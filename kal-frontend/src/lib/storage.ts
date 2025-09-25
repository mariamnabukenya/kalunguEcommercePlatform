import { STORAGE_KEYS } from './constants';

class StorageService {
  // Generic storage methods
  setItem<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }

  getItem<T>(key: string, defaultValue: T): T {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return defaultValue;
    }
  }

  removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  }

  clear(): void {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }

  // Specific methods for app data
  setAuthToken(token: string): void {
    this.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
  }

  getAuthToken(): string | null {
    return this.getItem(STORAGE_KEYS.AUTH_TOKEN, null);
  }

  removeAuthToken(): void {
    this.removeItem(STORAGE_KEYS.AUTH_TOKEN);
  }

  setUser(user: any): void {
    this.setItem(STORAGE_KEYS.USER, user);
  }

  getUser(): any {
    return this.getItem(STORAGE_KEYS.USER, null);
  }

  removeUser(): void {
    this.removeItem(STORAGE_KEYS.USER);
  }

  setCart(cart: any[]): void {
    this.setItem(STORAGE_KEYS.CART, cart);
  }

  getCart(): any[] {
    return this.getItem(STORAGE_KEYS.CART, []);
  }

  removeCart(): void {
    this.removeItem(STORAGE_KEYS.CART);
  }

  setWishlist(wishlist: any[]): void {
    this.setItem(STORAGE_KEYS.WISHLIST, wishlist);
  }

  getWishlist(): any[] {
    return this.getItem(STORAGE_KEYS.WISHLIST, []);
  }

  removeWishlist(): void {
    this.removeItem(STORAGE_KEYS.WISHLIST);
  }

  setRecentlyViewed(products: any[]): void {
    this.setItem(STORAGE_KEYS.RECENTLY_VIEWED, products);
  }

  getRecentlyViewed(): any[] {
    return this.getItem(STORAGE_KEYS.RECENTLY_VIEWED, []);
  }

  addToRecentlyViewed(product: any): void {
    const recentlyViewed = this.getRecentlyViewed();
    const filtered = recentlyViewed.filter(p => p.id !== product.id);
    const updated = [product, ...filtered].slice(0, 10); // Keep only 10 most recent
    this.setRecentlyViewed(updated);
  }

  setTheme(theme: 'light' | 'dark'): void {
    this.setItem(STORAGE_KEYS.THEME, theme);
  }

  getTheme(): 'light' | 'dark' {
    return this.getItem(STORAGE_KEYS.THEME, 'light');
  }

  // Clear all user data (for logout)
  clearUserData(): void {
    this.removeAuthToken();
    this.removeUser();
    this.removeCart();
    this.removeWishlist();
  }
}

export const storageService = new StorageService();
export default storageService;
