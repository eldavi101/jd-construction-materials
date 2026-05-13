import { Injectable } from '@nestjs/common';
import { hash } from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly authUserSelect = {
    id: true,
    email: true,
    firstName: true,
    lastName: true,
    phone: true,
    role: true,
  } as const;

  private readonly authUserWithSecretsSelect = {
    id: true,
    email: true,
    passwordHash: true,
    refreshTokenHash: true,
    firstName: true,
    lastName: true,
    phone: true,
    role: true,
  } as const;

  findAll() {
    return this.prisma.user.findMany({
      select: this.authUserSelect,
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }

  findPublicById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      select: this.authUserSelect,
    });
  }

  findAuthById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      select: this.authUserWithSecretsSelect,
    });
  }

  findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      select: this.authUserWithSecretsSelect,
    });
  }

  createCustomer(input: {
    email: string;
    passwordHash: string;
    firstName: string;
    lastName: string;
    phone?: string;
  }) {
    return this.prisma.user.create({
      data: {
        email: input.email,
        passwordHash: input.passwordHash,
        firstName: input.firstName,
        lastName: input.lastName,
        phone: input.phone,
      },
      select: this.authUserWithSecretsSelect,
    });
  }

  async updateRefreshTokenHash(userId: string, refreshToken: string) {
    const refreshTokenHash = await hash(refreshToken, 12);

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        refreshTokenHash,
      },
    });
  }

  clearRefreshTokenHash(userId: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { refreshTokenHash: null },
    });
  }
}
