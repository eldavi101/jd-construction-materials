import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminGuard } from '../auth/admin.guard';
import { ProductsService } from './products.service';

type CreateProductDto = {
  name: string;
  description?: string;
  sku: string;
  brand?: string;
  price: number;
  categoryId: string;
};

type UpdateProductDto = {
  name?: string;
  description?: string;
  sku?: string;
  brand?: string;
  price?: number;
  categoryId?: string;
};

type AdjustInventoryDto = {
  quantityAdjustment: number;
  warehouseCode?: string;
};

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.productsService.findById(id);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Post()
  createProduct(@Body() body: CreateProductDto) {
    return this.productsService.createProduct(body);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Put(':id')
  updateProduct(@Param('id') id: string, @Body() body: UpdateProductDto) {
    return this.productsService.updateProduct(id, body);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Patch(':id/status')
  updateProductStatus(
    @Param('id') id: string,
    @Body('active') active: boolean,
  ) {
    return this.productsService.updateProductStatus(id, active);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Post(':id/inventory')
  adjustInventory(
    @Param('id') productId: string,
    @Body() body: AdjustInventoryDto,
  ) {
    return this.productsService.adjustInventory(
      productId,
      body.quantityAdjustment,
      body.warehouseCode,
    );
  }
}
