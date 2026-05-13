import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class InventoryService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.inventoryItem.findMany({
      include: {
        product: true,
      },
      orderBy: { updatedAt: 'desc' },
      take: 100,
    });
  }
}
