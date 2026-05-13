import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

type CreateProductInput = {
  name: string;
  description?: string;
  sku: string;
  brand?: string;
  price: number;
  categoryId: string;
};

type UpdateProductInput = {
  name?: string;
  description?: string;
  sku?: string;
  brand?: string;
  price?: number;
  categoryId?: string;
};

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.product.findMany({
      include: {
        category: true,
        inventoryItem: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
  }

  async findById(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        inventoryItem: true,
      },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID "${id}" not found`);
    }

    return product;
  }

  async createProduct(input: CreateProductInput) {
    const { name, description, sku, brand, price, categoryId } = input;

    // Verify category exists
    const category = await this.prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      throw new BadRequestException(`Category with ID "${categoryId}" not found`);
    }

    // Check for duplicate SKU
    const existingSku = await this.prisma.product.findUnique({
      where: { sku },
    });

    if (existingSku) {
      throw new BadRequestException(`Product with SKU "${sku}" already exists`);
    }

    // Generate slug from name
    const slug = name
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]/g, '')
      .slice(0, 50);

    // Create product with inventory item
    const product = await this.prisma.product.create({
      data: {
        name,
        description,
        sku,
        brand,
        price: new Prisma.Decimal(price),
        slug,
        categoryId,
        inventoryItem: {
          create: {
            quantityOnHand: 0,
            quantityReserved: 0,
            reorderLevel: 10,
          },
        },
      },
      include: {
        category: true,
        inventoryItem: true,
      },
    });

    return product;
  }

  async updateProduct(id: string, input: UpdateProductInput) {
    await this.findById(id); // Verify product exists

    const { name, description, sku, brand, price, categoryId } = input;

    // If categoryId is provided, verify it exists
    if (categoryId) {
      const category = await this.prisma.category.findUnique({
        where: { id: categoryId },
      });

      if (!category) {
        throw new BadRequestException(`Category with ID "${categoryId}" not found`);
      }
    }

    // If SKU is being changed, check for duplicates
    if (sku) {
      const existingSku = await this.prisma.product.findUnique({
        where: { sku },
      });

      if (existingSku && existingSku.id !== id) {
        throw new BadRequestException(`Product with SKU "${sku}" already exists`);
      }
    }

    const updateData: Prisma.ProductUpdateInput = {};

    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (sku !== undefined) updateData.sku = sku;
    if (brand !== undefined) updateData.brand = brand;
    if (price !== undefined) updateData.price = new Prisma.Decimal(price);
      if (categoryId !== undefined) {
        updateData.category = {
          connect: { id: categoryId },
        };
      }

    const product = await this.prisma.product.update({
        where: { id },
        data: updateData,
      include: {
        category: true,
        inventoryItem: true,
      },
    });

    return product;
  }

  async updateProductStatus(id: string, active: boolean) {
    await this.findById(id); // Verify product exists

    const product = await this.prisma.product.update({
      where: { id },
      data: { active },
      include: {
        category: true,
        inventoryItem: true,
      },
    });

    return product;
  }

  async adjustInventory(
    productId: string,
    quantityAdjustment: number,
    warehouseCode?: string,
  ) {
    const product = await this.findById(productId);

    if (!product.inventoryItem) {
      throw new BadRequestException(
        `No inventory item found for product "${productId}"`,
      );
    }

    const newQuantity = product.inventoryItem.quantityOnHand + quantityAdjustment;

    if (newQuantity < 0) {
      throw new BadRequestException(
        `Cannot reduce inventory below 0. Current: ${product.inventoryItem.quantityOnHand}, Adjustment: ${quantityAdjustment}`,
      );
    }

    const updatedInventory = await this.prisma.inventoryItem.update({
      where: { id: product.inventoryItem.id },
      data: {
        quantityOnHand: newQuantity,
        ...(warehouseCode && { warehouseCode }),
      },
    });

    return updatedInventory;
  }
}
