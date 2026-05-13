import {
  BadRequestException,
  Body,
  Controller,
  Headers,
  HttpCode,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { CurrentUser } from '../auth/current-user.decorator';
import type { JwtPayload } from '../auth/auth.types';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { StripeService } from './stripe.service';

type CheckoutBody = {
  shippingAmount?: number;
  taxAmount?: number;
  currency?: string;
  items: {
    productId: string;
    quantity: number;
  }[];
};

@Controller('stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @UseGuards(JwtAuthGuard)
  @Post('checkout-session')
  createCheckoutSession(@CurrentUser() user: JwtPayload, @Body() body: CheckoutBody) {
    return this.stripeService.createCheckoutSession({
      userId: user.sub,
      shippingAmount: body.shippingAmount,
      taxAmount: body.taxAmount,
      currency: body.currency,
      items: body.items ?? [],
    });
  }

  @Post('webhook')
  @HttpCode(200)
  handleWebhook(
    @Req() req: Request & { rawBody?: Buffer },
    @Headers('stripe-signature') signature: string,
  ) {
    const rawBody = req.rawBody;
    if (!rawBody) {
      throw new BadRequestException(
        'Raw body is required for webhook validation',
      );
    }

    return this.stripeService.handleWebhook(rawBody, signature);
  }
}
