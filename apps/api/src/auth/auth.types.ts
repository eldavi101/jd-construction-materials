export type AuthUser = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  role: 'CUSTOMER' | 'ADMIN';
};

export type JwtPayload = {
  sub: string;
  email: string;
  role: 'CUSTOMER' | 'ADMIN';
  type: 'access' | 'refresh';
};

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

export type AuthResponse = {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
};
