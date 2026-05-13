import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from '../auth/current-user.decorator';
import type { JwtPayload } from '../auth/auth.types';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { OrdersService } from './orders.service';

type DraftOrderBody = {
  shippingAmount?: number;
  taxAmount?: number;
  currency?: string;
  items: {
    productId: string;
    quantity: number;
  }[];
};

type AdminStatusBody = {
  status: 'PROCESSING' | 'SHIPPED' | 'DELIVERED';
};

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@CurrentUser() user: JwtPayload) {
    return this.ordersService.findAllForUser(user.sub, user.role);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findById(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
    return this.ordersService.findByIdForUser(id, user.sub, user.role);
  }

  @UseGuards(JwtAuthGuard)
  @Post('draft')
  createDraft(@CurrentUser() user: JwtPayload, @Body() body: DraftOrderBody) {
    return this.ordersService.createDraftOrder({
      userId: user.sub,
      shippingAmount: body.shippingAmount,
      taxAmount: body.taxAmount,
      currency: body.currency,
      items: body.items ?? [],
    });
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/admin-status')
  updateAdminStatus(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
    @Body() body: AdminStatusBody,
  ) {
    if (user.role !== 'ADMIN') {
      throw new ForbiddenException('Admin role required');
    }

    return this.ordersService.updateAdminStatus(id, body.status);
  }
}
