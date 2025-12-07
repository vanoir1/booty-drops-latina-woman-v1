const SHOPIFY_STORE = 'kx107r-kj.myshopify.com';
const STOREFRONT_TOKEN = '78466b4a0bfa8bb53f7449e1743bb866';
const PHOENIX_CHECKOUT_URL = 'https://secureorder.getvanoir.com/';

export const SHOPIFY_VARIANT_IDS = {
  starter: 'gid://shopify/ProductVariant/51816862417162',
  builder: 'gid://shopify/ProductVariant/51816862449930',
  hourglass: 'gid://shopify/ProductVariant/51816862482698',
} as const;

export type PlanId = keyof typeof SHOPIFY_VARIANT_IDS;

interface CartCreateResponse {
  data: {
    cartCreate: {
      cart: {
        id: string;
        checkoutUrl: string;
      } | null;
      userErrors: Array<{
        field: string[];
        message: string;
      }>;
    };
  };
  errors?: Array<{ message: string }>;
}

export async function createShopifyCart(
  variantId: string,
  quantity: number = 1
): Promise<{ cartId: string; checkoutUrl: string }> {
  const apiUrl = 'https://' + SHOPIFY_STORE + '/api/2024-01/graphql.json';
  const response = await fetch(
    apiUrl,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': STOREFRONT_TOKEN,
      },
      body: JSON.stringify({
        query: `
          mutation cartCreate($input: CartInput!) {
            cartCreate(input: $input) {
              cart {
                id
                checkoutUrl
              }
              userErrors {
                field
                message
              }
            }
          }
        `,
        variables: {
          input: {
            lines: [
              {
                merchandiseId: variantId,
                quantity,
              },
            ],
          },
        },
      }),
    }
  );

  if (!response.ok) {
    throw new Error('Shopify API error: ' + response.status);
  }

  const result: CartCreateResponse = await response.json();

  if (result.errors && result.errors.length > 0) {
    throw new Error('GraphQL error: ' + result.errors[0].message);
  }

  const userErrors = result.data.cartCreate.userErrors;
  if (userErrors && userErrors.length > 0) {
    throw new Error('Cart error: ' + userErrors[0].message);
  }

  const cart = result.data.cartCreate.cart;
  if (!cart) {
    throw new Error('Failed to create cart');
  }

  return {
    cartId: cart.id,
    checkoutUrl: cart.checkoutUrl,
  };
}

export function extractCartToken(cartId: string): string {
  const parts = cartId.split('/');
  const token = parts[parts.length - 1];
  return token || '';
}

export function getPhoenixCheckoutUrl(
  cartToken: string,
  options?: {
    trafficSource?: string;
    currency?: string;
  }
): string {
  const url = new URL(PHOENIX_CHECKOUT_URL);
  url.searchParams.set('store', 'kx107r-kj');
  url.searchParams.set('cart', cartToken);

  if (options?.trafficSource) {
    url.searchParams.set('trafficSource', options.trafficSource);
  }

  if (options?.currency) {
    url.searchParams.set('target_currency', options.currency);
  }

  return url.toString();
}

export async function createCartAndGetPhoenixUrl(
  planId: PlanId,
  quantity: number = 1,
  trafficSource?: string
): Promise<string> {
  const variantId = SHOPIFY_VARIANT_IDS[planId];

  if (!variantId) {
    throw new Error('Unknown plan ID: ' + planId);
  }

  const { cartId } = await createShopifyCart(variantId, quantity);
  const cartToken = extractCartToken(cartId);

  return getPhoenixCheckoutUrl(cartToken, { trafficSource });
}
