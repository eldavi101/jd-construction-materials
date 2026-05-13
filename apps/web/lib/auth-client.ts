export type AuthUser = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  role: 'CUSTOMER' | 'ADMIN';
};

export type AuthSession = {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

const SESSION_KEY = 'jd-auth-session';

export function getStoredSession(): AuthSession | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const raw = window.localStorage.getItem(SESSION_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as AuthSession;
  } catch {
    window.localStorage.removeItem(SESSION_KEY);
    return null;
  }
}

export function storeSession(session: AuthSession) {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearStoredSession() {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.removeItem(SESSION_KEY);
}

async function apiRequest<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers ?? {}),
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Request failed: ${response.status}`);
  }

  return (await response.json()) as T;
}

export async function refreshSession(refreshToken: string): Promise<AuthSession> {
  const session = await apiRequest<AuthSession>('/auth/refresh', {
    method: 'POST',
    body: JSON.stringify({ refreshToken }),
  });

  storeSession(session);
  return session;
}

export async function authorizedApiRequest<T>(
  path: string,
  options?: RequestInit,
): Promise<T> {
  const session = getStoredSession();

  if (!session) {
    throw new Error('Not authenticated');
  }

  const send = async (token: string) => {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        ...(options?.headers ?? {}),
      },
    });

    return response;
  };

  let response = await send(session.accessToken);

  if (response.status === 401) {
    const refreshed = await refreshSession(session.refreshToken);
    response = await send(refreshed.accessToken);
  }

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Request failed: ${response.status}`);
  }

  return (await response.json()) as T;
}

export function register(input: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}) {
  return apiRequest<AuthSession>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export function login(input: { email: string; password: string }) {
  return apiRequest<AuthSession>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export function logout(accessToken: string) {
  return apiRequest<{ success: true }>('/auth/logout', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export function fetchMe(accessToken: string) {
  return apiRequest<AuthUser>('/auth/me', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export async function fetchMeWithAutoRefresh() {
  return authorizedApiRequest<AuthUser>('/auth/me', {
    method: 'GET',
  });
}

export async function createCheckoutSession(input: {
  shippingAmount?: number;
  taxAmount?: number;
  currency?: string;
  items: { productId: string; quantity: number }[];
}) {
  return authorizedApiRequest<{
    orderId: string;
    orderNumber: string;
    stripeSessionId: string;
    checkoutUrl: string | null;
    checkoutStatus: string | null;
  }>('/stripe/checkout-session', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}
