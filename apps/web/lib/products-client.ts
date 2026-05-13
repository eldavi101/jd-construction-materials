import { API_BASE_URL } from "./api-config";
import { getStoredSession, refreshSession } from "./auth-client";

export type Product = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  sku: string;
  brand: string | null;
  price: string;
  currency: string;
  active: boolean;
  categoryId: string;
  category: {
    id: string;
    slug: string;
    name: string;
    description: string | null;
  };
  inventoryItem: {
    id: string;
    productId: string;
    quantityOnHand: number;
    quantityReserved: number;
    reorderLevel: number;
    warehouseCode: string | null;
    updatedAt: string;
    createdAt: string;
  } | null;
  createdAt: string;
  updatedAt: string;
};

export async function fetchProducts(): Promise<Product[]> {
  const response = await fetch(`${API_BASE_URL}/products`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch products: ${response.statusText}`);
  }

  return response.json();
}

export async function fetchProductById(id: string): Promise<Product> {
  const response = await fetch(`${API_BASE_URL}/products/${id}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch product: ${response.statusText}`);
  }

  return response.json();
}

export async function createProduct(data: {
  name: string;
  description?: string;
  sku: string;
  brand?: string;
  price: number;
  categoryId: string;
}): Promise<Product> {
  let session = getStoredSession();
  if (!session) {
    throw new Error("Session expired. Please login again.");
  }
  let token = session.accessToken;

  let response = await fetch(`${API_BASE_URL}/products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (response.status === 401) {
    const refreshedSession = await refreshSession(session.refreshToken);
    if (!refreshedSession) {
      throw new Error("Session expired. Please login again.");
    }
    token = refreshedSession.accessToken;

    response = await fetch(`${API_BASE_URL}/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
  }

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(
      errorBody.message || `Failed to create product: ${response.statusText}`
    );
  }

  return response.json();
}

export async function updateProduct(
  id: string,
  data: {
    name?: string;
    description?: string;
    sku?: string;
    brand?: string;
    price?: number;
    categoryId?: string;
  }
): Promise<Product> {
  let session = getStoredSession();
  if (!session) {
    throw new Error("Session expired. Please login again.");
  }
  let token = session.accessToken;

  let response = await fetch(`${API_BASE_URL}/products/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (response.status === 401) {
    const refreshedSession = await refreshSession(session.refreshToken);
    if (!refreshedSession) {
      throw new Error("Session expired. Please login again.");
    }
    token = refreshedSession.accessToken;

    response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
  }

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(
      errorBody.message || `Failed to update product: ${response.statusText}`
    );
  }

  return response.json();
}

export async function updateProductStatus(
  id: string,
  active: boolean
): Promise<Product> {
  let session = getStoredSession();
  if (!session) {
    throw new Error("Session expired. Please login again.");
  }
  let token = session.accessToken;

  let response = await fetch(`${API_BASE_URL}/products/${id}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ active }),
  });

  if (response.status === 401) {
    const refreshedSession = await refreshSession(session.refreshToken);
    if (!refreshedSession) {
      throw new Error("Session expired. Please login again.");
    }
    token = refreshedSession.accessToken;

    response = await fetch(`${API_BASE_URL}/products/${id}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ active }),
    });
  }

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(
      errorBody.message ||
        `Failed to update product status: ${response.statusText}`
    );
  }

  return response.json();
}

export async function adjustInventory(
  productId: string,
  quantityAdjustment: number,
  warehouseCode?: string
): Promise<{
  id: string;
  productId: string;
  quantityOnHand: number;
  quantityReserved: number;
  reorderLevel: number;
  warehouseCode: string | null;
  updatedAt: string;
  createdAt: string;
}> {
  let session = getStoredSession();
  if (!session) {
    throw new Error("Session expired. Please login again.");
  }
  let token = session.accessToken;

  let response = await fetch(`${API_BASE_URL}/products/${productId}/inventory`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ quantityAdjustment, warehouseCode }),
  });

  if (response.status === 401) {
    const refreshedSession = await refreshSession(session.refreshToken);
    if (!refreshedSession) {
      throw new Error("Session expired. Please login again.");
    }
    token = refreshedSession.accessToken;

    response = await fetch(`${API_BASE_URL}/products/${productId}/inventory`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ quantityAdjustment, warehouseCode }),
    });
  }

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(
      errorBody.message ||
        `Failed to adjust inventory: ${response.statusText}`
    );
  }

  return response.json();
}
