import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OrderStatus, Prisma } from '@prisma/client';
import Stripe from 'stripe';
import { PrismaService } from '../prisma/prisma.service';

type CheckoutItemInput = {
  productId: string;
  quantity: number;
};

type CreateCheckoutSessionInput = {
  userId?: string;
  shippingAmount?: number;
  taxAmount?: number;
  currency?: string;
  items: CheckoutItemInput[];
};

@Injectable()
export class StripeService {
  private readonly stripe: InstanceType<typeof Stripe> | null;

  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    const secretKey = this.configService.get<string>('STRIPE_SECRET_KEY');
    this.stripe = secretKey
      ? new Stripe(secretKey, {
          apiVersion: '2026-04-22.dahlia',
        })
      : null;
  }

  private generateOrderNumber() {
    return `ORD-${Date.now()}-${Math.floor(Math.random() * 1_000_000)}`;
  }

  private extractOrderIdFromEvent(event: any): string | null {
    if (
      event.type !== 'checkout.session.completed' &&
      event.type !== 'checkout.session.expired'
    ) {
      return null;
    }

    const session = event.data.object as any;
    return session.client_reference_id ?? session.metadata?.orderId ?? null;
  }

  async createCheckoutSession(input: CreateCheckoutSessionInput) {
    if (!this.stripe) {
      throw new BadRequestException('Stripe is not configured');
    }

    if (!input.items?.length) {
      throw new BadRequestException('items are required');
    }

    const normalizedItems = new Map<string, number>();
    for (const item of input.items) {
      if (typeof item.productId !== 'string' || !item.productId.trim()) {
        throw new BadRequestException('productId must be a non-empty string');
      }

      if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
        throw new BadRequestException('quantity must be a positive integer');
      }

      const productId = item.productId.trim();
      const current = normalizedItems.get(productId) ?? 0;
      normalizedItems.set(productId, current + item.quantity);
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
      if (!Number.isFinite(unitAmount) || unitAmount <= 0) {
        throw new BadRequestException('Invalid product price');
      }

      return {
        product,
        quantity,
        unitAmount,
        totalAmount: unitAmount * quantity,
      };
    });

    const subtotalCents = lineItems.reduce(
      (acc, item) => acc + item.totalAmount,
      0,
    );
    const shippingCents = Math.round((input.shippingAmount ?? 0) * 100);
    const taxCents = Math.round((input.taxAmount ?? 0) * 100);
    const totalCents = subtotalCents + shippingCents + taxCents;

    const order = await this.prisma.order.create({
      data: {
        orderNumber: this.generateOrderNumber(),
        userId: input.userId,
        currency: input.currency ?? 'USD',
        subtotalAmount: subtotalCents / 100,
        shippingAmount: shippingCents / 100,
        taxAmount: taxCents / 100,
        totalAmount: totalCents / 100,
        status: 'PENDING',
        items: {
          create: lineItems.map((item) => ({
            productId: item.product.id,
            quantity: item.quantity,
            unitPrice: item.unitAmount / 100,
            totalAmount: item.totalAmount / 100,
          })),
        },
      },
    });

    const frontendUrl =
      this.configService.get<string>('FRONTEND_URL') ?? 'http://localhost:3000';

    try {
      const session = await this.stripe.checkout.sessions.create({
        mode: 'payment',
        success_url: `${frontendUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${frontendUrl}/checkout/cancel`,
        client_reference_id: order.id,
        metadata: {
          orderId: order.id,
          orderNumber: order.orderNumber,
        },
        payment_method_types: ['card'],
        line_items: lineItems.map((item) => ({
          price_data: {
            currency: (input.currency ?? 'USD').toLowerCase(),
            unit_amount: item.unitAmount,
            product_data: {
              name: item.product.name,
              metadata: {
                productId: item.product.id,
                sku: item.product.sku,
              },
            },
          },
          quantity: item.quantity,
        })),
      });

      await this.prisma.order.update({
        where: { id: order.id },
        data: {
          stripeSessionId: session.id,
        },
      });

      return {
        orderId: order.id,
        orderNumber: order.orderNumber,
        stripeSessionId: session.id,
        checkoutUrl: session.url,
        checkoutStatus: session.status,
      };
    } catch (error) {
      await this.prisma.order.update({
        where: { id: order.id },
        data: {
          status: 'CANCELED',
        },
      });

      throw new InternalServerErrorException(
        `Unable to create Stripe checkout session: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`,
      );
    }
  }

  async handleWebhook(rawBody: Buffer, signature: string) {
    if (!this.stripe) {
      throw new BadRequestException('Stripe is not configured');
    }

    const webhookSecret = this.configService.get<string>('STRIPE_WEBHOOK_SECRET');
    if (!webhookSecret) {
      throw new BadRequestException('Stripe webhook secret is not configured');
    }

    if (!signature) {
      throw new BadRequestException('Missing stripe-signature header');
    }

    let event: any;
    try {
      event = this.stripe.webhooks.constructEvent(
        rawBody,
        signature,
        webhookSecret,
      );
    } catch {
      throw new BadRequestException('Invalid Stripe webhook signature');
    }

    const orderId = this.extractOrderIdFromEvent(event);

    let webhookEvent = await this.prisma.stripeWebhookEvent.findUnique({
      where: { eventId: event.id },
    });

    if (!webhookEvent) {
      webhookEvent = await this.prisma.stripeWebhookEvent.create({
        data: {
          eventId: event.id,
          type: event.type,
          orderId,
          rawPayload: event as unknown as Prisma.InputJsonValue,
        },
      });
    } else if (webhookEvent.processedAt) {
      return { received: true, type: event.type, duplicate: true };
    }

    try {
      switch (event.type) {
        case 'checkout.session.completed': {
          const session = event.data.object as any;
          const resolvedOrderId =
            session.client_reference_id ?? session.metadata?.orderId ?? null;

          if (resolvedOrderId) {
            await this.prisma.order.updateMany({
              where: {
                id: resolvedOrderId,
                status: {
                  in: [OrderStatus.PENDING, OrderStatus.PROCESSING],
                },
              },
              data: {
                status: OrderStatus.PAID,
                stripeSessionId: session.id,
                stripePaymentIntentId:
                  typeof session.payment_intent === 'string'
                    ? session.payment_intent
                    : null,
              },
            });
          }
          break;
        }

        case 'checkout.session.expired': {
          const session = event.data.object as any;
          const resolvedOrderId =
            session.client_reference_id ?? session.metadata?.orderId ?? null;

          if (resolvedOrderId) {
            await this.prisma.order.updateMany({
              where: {
                id: resolvedOrderId,
                status: OrderStatus.PENDING,
              },
              data: {
                status: OrderStatus.CANCELED,
              },
            });
          }
          break;
        }

        default:
          break;
      }
    } catch (error) {
      await this.prisma.stripeWebhookEvent.update({
        where: { id: webhookEvent.id },
        data: {
          processingError:
            error instanceof Error ? error.message : 'Unknown processing error',
        },
      });

      throw new InternalServerErrorException('Unable to process Stripe webhook');
    }

    await this.prisma.stripeWebhookEvent.update({
      where: { id: webhookEvent.id },
      data: {
        processedAt: new Date(),
        processingError: null,
      },
    });

    return { received: true, type: event.type };
  }
}
