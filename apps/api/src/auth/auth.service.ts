import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { AuthResponse, AuthTokens, AuthUser, JwtPayload } from './auth.types';

type RegisterInput = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
};

type LoginInput = {
  email: string;
  password: string;
};

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  private toAuthUser(user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone: string | null;
    role: 'CUSTOMER' | 'ADMIN';
  }): AuthUser {
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      role: user.role,
    };
  }

  private getAccessSecret() {
    return this.configService.get<string>('JWT_ACCESS_SECRET') ?? 'dev-access-secret';
  }

  private getRefreshSecret() {
    return this.configService.get<string>('JWT_REFRESH_SECRET') ?? 'dev-refresh-secret';
  }

  private getAccessExpiresIn() {
    return this.configService.get<string>('JWT_ACCESS_EXPIRES_IN') ?? '15m';
  }

  private getRefreshExpiresIn() {
    return this.configService.get<string>('JWT_REFRESH_EXPIRES_IN') ?? '7d';
  }

  private async createTokens(user: {
    id: string;
    email: string;
    role: 'CUSTOMER' | 'ADMIN';
  }): Promise<AuthTokens> {
    const accessPayload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      type: 'access',
    };

    const refreshPayload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      type: 'refresh',
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(accessPayload, {
        secret: this.getAccessSecret(),
        expiresIn: this.getAccessExpiresIn() as any,
      }),
      this.jwtService.signAsync(refreshPayload, {
        secret: this.getRefreshSecret(),
        expiresIn: this.getRefreshExpiresIn() as any,
      }),
    ]);

    return { accessToken, refreshToken };
  }

  private async buildAuthResponse(user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone: string | null;
    role: 'CUSTOMER' | 'ADMIN';
  }): Promise<AuthResponse> {
    const tokens = await this.createTokens(user);
    await this.usersService.updateRefreshTokenHash(user.id, tokens.refreshToken);

    return {
      user: this.toAuthUser(user),
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }

  async register(input: RegisterInput): Promise<AuthResponse> {
    const email = input.email.trim().toLowerCase();
    const firstName = input.firstName.trim();
    const lastName = input.lastName.trim();
    const phone = input.phone?.trim() || undefined;

    if (!email || !firstName || !lastName) {
      throw new BadRequestException('Missing required fields');
    }

    if (input.password.length < 8) {
      throw new BadRequestException('Password must be at least 8 characters');
    }

    const existing = await this.usersService.findByEmail(email);
    if (existing) {
      throw new BadRequestException('Email already in use');
    }

    const passwordHash = await hash(input.password, 12);
    const user = await this.usersService.createCustomer({
      email,
      passwordHash,
      firstName,
      lastName,
      phone,
    });

    return this.buildAuthResponse(user);
  }

  async login(input: LoginInput): Promise<AuthResponse> {
    const email = input.email.trim().toLowerCase();
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const validPassword = await compare(input.password, user.passwordHash);
    if (!validPassword) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.buildAuthResponse(user);
  }

  async refresh(refreshToken: string): Promise<AuthResponse> {
    if (!refreshToken) {
      throw new UnauthorizedException('Missing refresh token');
    }

    let payload: JwtPayload;

    try {
      payload = await this.jwtService.verifyAsync<JwtPayload>(refreshToken, {
        secret: this.getRefreshSecret(),
      });
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    if (payload.type !== 'refresh') {
      throw new UnauthorizedException('Invalid token type');
    }

    const user = await this.usersService.findAuthById(payload.sub);
    if (!user || !user.refreshTokenHash) {
      throw new UnauthorizedException('Refresh token rejected');
    }

    const validRefreshToken = await compare(refreshToken, user.refreshTokenHash);
    if (!validRefreshToken) {
      throw new UnauthorizedException('Refresh token rejected');
    }

    return this.buildAuthResponse(user);
  }

  async logout(userId: string) {
    await this.usersService.clearRefreshTokenHash(userId);
    return { success: true };
  }

  async me(userId: string) {
    const user = await this.usersService.findAuthById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return this.toAuthUser(user);
  }
}
