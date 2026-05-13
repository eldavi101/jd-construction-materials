export type ApiProduct = {
  id: string;
  slug: string;
  name: string;
  price: string;
  currency: string;
  active: boolean;
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

let cachedProducts: ApiProduct[] | null = null;

export async function fetchApiProducts(): Promise<ApiProduct[]> {
  if (cachedProducts) {
    return cachedProducts;
  }

  const response = await fetch(`${API_BASE_URL}/products`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Unable to fetch products: ${response.status}`);
  }

  cachedProducts = (await response.json()) as ApiProduct[];
  return cachedProducts;
}
