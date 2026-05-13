import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { OrderStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

type DraftOrderItemInput = {
  productId: string;
  quantity: number;
};

type CreateDraftOrderInput = {
  userId?: string;
  shippingAmount?: number;
  taxAmount?: number;
  currency?: string;
  items: DraftOrderItemInput[];
};

type AdminOrderStatus = 'PROCESSING' | 'SHIPPED' | 'DELIVERED';

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  private generateOrderNumber() {
    return `ORD-${Date.now()}-${Math.floor(Math.random() * 1_000_000)}`;
  }

  findAllForUser(userId: string, role: 'CUSTOMER' | 'ADMIN') {
    return this.prisma.order.findMany({
      where: role === 'ADMIN' ? undefined : { userId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        user: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
  }

  findByIdForUser(id: string, userId: string, role: 'CUSTOMER' | 'ADMIN') {
    return this.prisma.order.findFirst({
      where: role === 'ADMIN' ? { id } : { id, userId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        user: true,
      },
    });
  }

  async createDraftOrder(input: CreateDraftOrderInput) {
    if (!input.items?.length) {
      throw new BadRequestException('items are required');
    }

    const normalizedItems = new Map<string, number>();
    for (const item of input.items) {
      if (!item.productId) {
        throw new BadRequestException('productId is required');
      }

      if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
        throw new BadRequestException('quantity must be a positive integer');
      }

      const current = normalizedItems.get(item.productId) ?? 0;
      normalizedItems.set(item.productId, current + item.quantity);
    }

    const productIds = [...normalizedItems.keys()];
    const products = await this.prisma.product.findMany({
      where: {
        id: { in: productIds },
        active: true,
      },
    });

    if (products.length !== productIds.length) {
      throw new BadRequestException('One or more products are invalid or inactive');
    }

    const productMap = new Map(products.map((product) => [product.id, product]));

    const lineItems = productIds.map((productId) => {
      const product = productMap.get(productId);
      if (!product) {
        throw new BadRequestException('Invalid product in cart');
      }

      const quantity = normalizedItems.get(productId) ?? 0;
      const unitAmount = Math.round(Number(product.price) * 100);
      const totalAmount = unitAmount * quantity;

      return {
        product,
        quantity,
        unitAmount,
        totalAmount,
      };
    });

    const subtotalCents = lineItems.reduce((acc, item) => acc + item.totalAmount, 0);
    const shippingCents = Math.round((input.shippingAmount ?? 0) * 100);
    const taxCents = Math.round((input.taxAmount ?? 0) * 100);

    if (shippingCents < 0 || taxCents < 0) {
      throw new BadRequestException('shippingAmount and taxAmount must be >= 0');
    }

    const totalCents = subtotalCents + shippingCents + taxCents;

    return this.prisma.order.create({
      data: {
        orderNumber: this.generateOrderNumber(),
        userId: input.userId,
        currency: input.currency ?? 'USD',
        status: OrderStatus.PENDING,
        subtotalAmount: subtotalCents / 100,
        shippingAmount: shippingCents / 100,
        taxAmount: taxCents / 100,
        totalAmount: totalCents / 100,
        items: {
          create: lineItems.map((item) => ({
            productId: item.product.id,
            quantity: item.quantity,
            unitPrice: item.unitAmount / 100,
            totalAmount: item.totalAmount / 100,
          })),
        },
      },
      include: {
        items: true,
        user: true,
      },
    });
  }

  async updateAdminStatus(id: string, nextStatus: AdminOrderStatus) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        items: true,
        user: true,
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.status === nextStatus) {
      return order;
    }

    const allowedTransitions: Record<OrderStatus, AdminOrderStatus[]> = {
      PENDING: ['PROCESSING'],
      PAID: ['PROCESSING'],
      PROCESSING: ['SHIPPED'],
      SHIPPED: ['DELIVERED'],
      DELIVERED: [],
      CANCELED: [],
      REFUNDED: [],
    };

    const canTransition = allowedTransitions[order.status].includes(nextStatus);
    if (!canTransition) {
      throw new BadRequestException(
        `Invalid transition from ${order.status} to ${nextStatus}`,
      );
    }

    return this.prisma.order.update({
      where: { id: order.id },
      data: {
        status: nextStatus,
      },
      include: {
        items: true,
        user: true,
      },
    });
  }
}
