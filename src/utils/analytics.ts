declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    ttq?: { track: (...args: unknown[]) => void; page: () => void };
    gtag?: (...args: unknown[]) => void;
    nbpix?: (...args: unknown[]) => void;
  }
}

interface ProductInfo {
  id: string;
  name: string;
  price: number;
  variant?: string;
  size?: string;
  color?: string;
  bundle?: string;
  quantity?: number;
}

class Analytics {
  private static instance: Analytics;
  private hasTrackedViewContent = false;

  private constructor() {}

  static getInstance(): Analytics {
    if (!Analytics.instance) {
      Analytics.instance = new Analytics();
    }
    return Analytics.instance;
  }

  trackViewContent(product: ProductInfo): void {
    if (this.hasTrackedViewContent) return;
    this.hasTrackedViewContent = true;

    console.log('[Analytics] ViewContent:', product);

    try {
      if (window.fbq) {
        window.fbq('track', 'ViewContent', {
          content_type: 'product',
          content_name: product.name,
          content_ids: [product.id],
          content_category: "Women's Supplements",
          value: product.price,
          currency: 'USD',
        });
      }
    } catch (e) {
      console.warn('Facebook ViewContent failed:', e);
    }

    try {
      if (window.ttq) {
        window.ttq.track('ViewContent', {
          content_type: 'product',
          content_name: product.name,
          content_id: product.id,
          value: product.price,
          currency: 'USD',
        });
      }
    } catch (e) {
      console.warn('TikTok ViewContent failed:', e);
    }

    try {
      if (window.gtag) {
        window.gtag('event', 'view_item', {
          items: [{
            item_id: product.id,
            item_name: product.name,
            price: product.price,
            currency: 'USD',
          }],
        });
      }
    } catch (e) {
      console.warn('GA4 view_item failed:', e);
    }

    try {
      if (window.nbpix) {
        window.nbpix('event', 'view_content', { nb_value: product.price });
      }
    } catch (e) {
      console.warn('NewsBreak view_content failed:', e);
    }
  }

  trackAddToCart(product: ProductInfo): void {
    console.log('[Analytics] AddToCart:', product);

    try {
      if (window.fbq) {
        window.fbq('track', 'AddToCart', {
          content_ids: [product.id],
          content_name: product.name,
          content_type: 'product',
          value: product.price,
          currency: 'USD',
          contents: [{
            id: product.id,
            quantity: product.quantity || 1,
          }],
        });
      }
    } catch (e) {
      console.warn('Facebook AddToCart failed:', e);
    }

    try {
      if (window.ttq) {
        window.ttq.track('AddToCart', {
          content_id: product.id,
          content_name: product.name,
          content_type: 'product',
          value: product.price,
          currency: 'USD',
          quantity: product.quantity || 1,
        });
      }
    } catch (e) {
      console.warn('TikTok AddToCart failed:', e);
    }

    try {
      if (window.gtag) {
        window.gtag('event', 'add_to_cart', {
          currency: 'USD',
          value: product.price,
          items: [{
            item_id: product.id,
            item_name: product.name,
            price: product.price,
            quantity: product.quantity || 1,
          }],
        });
      }
    } catch (e) {
      console.warn('GA4 add_to_cart failed:', e);
    }

    try {
      if (window.nbpix) {
        window.nbpix('event', 'add_to_cart', { nb_value: product.price });
      }
    } catch (e) {
      console.warn('NewsBreak add_to_cart failed:', e);
    }
  }

  trackInitiateCheckout(product: ProductInfo): void {
    console.log('[Analytics] InitiateCheckout:', product);

    // Facebook InitiateCheckout removed - fires on Shopify checkout instead

    try {
      if (window.ttq) {
        window.ttq.track('InitiateCheckout', {
          content_id: product.id,
          content_name: product.name,
          content_type: 'product',
          value: product.price,
          currency: 'USD',
          quantity: product.quantity || 1,
        });
      }
    } catch (e) {
      console.warn('TikTok InitiateCheckout failed:', e);
    }

    try {
      if (window.gtag) {
        window.gtag('event', 'begin_checkout', {
          currency: 'USD',
          value: product.price,
          items: [{
            item_id: product.id,
            item_name: product.name,
            price: product.price,
            quantity: product.quantity || 1,
          }],
        });
      }
    } catch (e) {
      console.warn('GA4 begin_checkout failed:', e);
    }

    try {
      if (window.nbpix) {
        window.nbpix('event', 'initiate_checkout', { nb_value: product.price });
      }
    } catch (e) {
      console.warn('NewsBreak initiate_checkout failed:', e);
    }
  }
}

export const analytics = Analytics.getInstance();
