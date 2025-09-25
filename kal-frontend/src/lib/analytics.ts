// Analytics service for tracking user interactions
class AnalyticsService {
  private isEnabled: boolean = false;

  constructor() {
    // Enable analytics in production
    this.isEnabled = process.env.NODE_ENV === 'production';
  }

  // Track page views
  trackPageView(page: string): void {
    if (!this.isEnabled) return;
    
    // Google Analytics 4
    if (typeof gtag !== 'undefined') {
      gtag('config', 'GA_MEASUREMENT_ID', {
        page_title: page,
        page_location: window.location.href,
      });
    }

    // Facebook Pixel
    if (typeof fbq !== 'undefined') {
      fbq('track', 'PageView');
    }

    console.log('Page view tracked:', page);
  }

  // Track product views
  trackProductView(product: any): void {
    if (!this.isEnabled) return;

    if (typeof gtag !== 'undefined') {
      gtag('event', 'view_item', {
        currency: 'USD',
        value: product.current_price,
        items: [{
          item_id: product.id,
          item_name: product.name,
          category: product.category,
          price: product.current_price,
        }],
      });
    }

    if (typeof fbq !== 'undefined') {
      fbq('track', 'ViewContent', {
        content_type: 'product',
        content_ids: [product.id],
        value: product.current_price,
        currency: 'USD',
      });
    }

    console.log('Product view tracked:', product.name);
  }

  // Track add to cart
  trackAddToCart(product: any, quantity: number = 1): void {
    if (!this.isEnabled) return;

    if (typeof gtag !== 'undefined') {
      gtag('event', 'add_to_cart', {
        currency: 'USD',
        value: product.current_price * quantity,
        items: [{
          item_id: product.id,
          item_name: product.name,
          category: product.category,
          price: product.current_price,
          quantity: quantity,
        }],
      });
    }

    if (typeof fbq !== 'undefined') {
      fbq('track', 'AddToCart', {
        content_type: 'product',
        content_ids: [product.id],
        value: product.current_price * quantity,
        currency: 'USD',
      });
    }

    console.log('Add to cart tracked:', product.name, quantity);
  }

  // Track purchase
  trackPurchase(order: any): void {
    if (!this.isEnabled) return;

    const items = order.items.map((item: any) => ({
      item_id: item.product_id,
      item_name: item.product?.name,
      category: item.product?.category,
      price: item.price,
      quantity: item.quantity,
    }));

    if (typeof gtag !== 'undefined') {
      gtag('event', 'purchase', {
        transaction_id: order.order_number,
        currency: 'USD',
        value: order.total_amount,
        items: items,
      });
    }

    if (typeof fbq !== 'undefined') {
      fbq('track', 'Purchase', {
        value: order.total_amount,
        currency: 'USD',
        content_ids: order.items.map((item: any) => item.product_id),
      });
    }

    console.log('Purchase tracked:', order.order_number, order.total_amount);
  }

  // Track search
  trackSearch(query: string, resultsCount: number): void {
    if (!this.isEnabled) return;

    if (typeof gtag !== 'undefined') {
      gtag('event', 'search', {
        search_term: query,
        results_count: resultsCount,
      });
    }

    console.log('Search tracked:', query, resultsCount);
  }

  // Track user registration
  trackSignUp(method: string = 'email'): void {
    if (!this.isEnabled) return;

    if (typeof gtag !== 'undefined') {
      gtag('event', 'sign_up', {
        method: method,
      });
    }

    if (typeof fbq !== 'undefined') {
      fbq('track', 'CompleteRegistration');
    }

    console.log('Sign up tracked:', method);
  }

  // Track user login
  trackLogin(method: string = 'email'): void {
    if (!this.isEnabled) return;

    if (typeof gtag !== 'undefined') {
      gtag('event', 'login', {
        method: method,
      });
    }

    console.log('Login tracked:', method);
  }

  // Track custom events
  trackEvent(eventName: string, parameters: Record<string, any> = {}): void {
    if (!this.isEnabled) return;

    if (typeof gtag !== 'undefined') {
      gtag('event', eventName, parameters);
    }

    console.log('Custom event tracked:', eventName, parameters);
  }

  // Set user properties
  setUserProperties(properties: Record<string, any>): void {
    if (!this.isEnabled) return;

    if (typeof gtag !== 'undefined') {
      gtag('config', 'GA_MEASUREMENT_ID', {
        user_properties: properties,
      });
    }

    console.log('User properties set:', properties);
  }
}

export const analyticsService = new AnalyticsService();
export default analyticsService;
