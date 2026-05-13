import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const categories = [
  {
    slug: 'structural',
    name: 'Structural Materials',
    description: 'Cement, concrete blocks, rebar, wire mesh and structural steel supplies.',
  },
  {
    slug: 'framing-lumber',
    name: 'Framing & Lumber',
    description: 'Lumber, studs, beams, trusses and framing connectors for construction projects.',
  },
  {
    slug: 'drywall',
    name: 'Drywall & Interior',
    description: 'Drywall panels, joint compounds, tapes and interior wall systems.',
  },
  {
    slug: 'roofing',
    name: 'Roofing',
    description: 'Shingles, membranes, flashing, sealers and roofing accessories.',
  },
  {
    slug: 'plumbing',
    name: 'Plumbing',
    description: 'PVC, CPVC, PEX, copper lines, fittings, valves and sanitary accessories.',
  },
  {
    slug: 'electrical',
    name: 'Electrical',
    description: 'Electrical cables, breakers, panels, conduit, outlets, switches and fixtures.',
  },
  {
    slug: 'hardware',
    name: 'Hardware & Fasteners',
    description: 'Screws, nails, anchors, washers, adhesives and general hardware supplies.',
  },
  {
    slug: 'tools',
    name: 'Tools & Machinery',
    description: 'Power tools, machinery and jobsite equipment for contractors.',
  },
  {
    slug: 'paint',
    name: 'Paint & Finishes',
    description: 'Interior/exterior paint, primers, textures and finishing accessories.',
  },
  {
    slug: 'flooring',
    name: 'Flooring & Tile',
    description: 'Ceramic, porcelain, vinyl, laminate and flooring installation materials.',
  },
  {
    slug: 'insulation',
    name: 'Insulation',
    description: 'Thermal insulation and waterproofing products for residential and commercial jobs.',
  },
] as const;

const products = [
  {
    slug: 'portland-cement-94lb',
    name: 'Portland Cement Type I/II (94 lb Bag)',
    description: 'General-purpose Portland cement for slabs, foundations and structural concrete.',
    sku: 'CEM-PORTLAND-94',
    brand: 'J&D Pro',
    price: 14.99,
    categorySlug: 'structural',
    quantityOnHand: 1500,
  },
  {
    slug: 'rebar-3-20ft',
    name: '#3 Rebar 20ft (3/8 in Steel Reinforcing Bar)',
    description: 'Reinforcing steel bar for residential and commercial concrete reinforcement.',
    sku: 'REB-3-20',
    brand: 'J&D Steel',
    price: 8.49,
    categorySlug: 'structural',
    quantityOnHand: 3200,
  },
  {
    slug: 'osb-7-16-panel-4x8',
    name: 'OSB 7/16 in Sheathing Panel 4x8 ft',
    description: 'Structural sheathing panel for wall and roof assemblies.',
    sku: 'OSB-716-48',
    brand: 'BuildCore',
    price: 22.99,
    categorySlug: 'framing-lumber',
    quantityOnHand: 900,
  },
  {
    slug: 'architectural-shingles-3tab',
    name: 'Architectural Shingles 3-Tab (Bundle)',
    description: 'Roof shingles engineered for weather protection and long durability.',
    sku: 'ROOF-3TAB',
    brand: 'StormGuard',
    price: 34.99,
    categorySlug: 'roofing',
    quantityOnHand: 1200,
  },
  {
    slug: 'drywall-half-inch-4x8',
    name: '1/2 in Drywall Panel 4x8 ft',
    description: 'Standard gypsum drywall for interior walls and ceilings.',
    sku: 'DRY-12-48',
    brand: 'InteriorPro',
    price: 12.49,
    categorySlug: 'drywall',
    quantityOnHand: 1800,
  },
  {
    slug: 'pvc-pipe-schedule40-half-10ft',
    name: 'PVC Pipe Schedule 40 - 1/2 in x 10 ft',
    description: 'Schedule 40 pipe for plumbing and water distribution lines.',
    sku: 'PVC-S40-05-10',
    brand: 'FlowLine',
    price: 4.99,
    categorySlug: 'plumbing',
    quantityOnHand: 2400,
  },
  {
    slug: 'romex-12-2-250ft',
    name: '12/2 Romex Wire NM-B (250 ft Roll)',
    description: 'Copper NM-B cable for branch circuits in dry interior applications.',
    sku: 'ELC-ROMEX-122-250',
    brand: 'ElectraSafe',
    price: 89.99,
    categorySlug: 'electrical',
    quantityOnHand: 500,
  },
  {
    slug: 'makita-18v-lxt-combo',
    name: 'Makita 18V LXT Cordless Drill Combo Kit',
    description: 'Professional drill combo for high-performance construction work.',
    sku: 'TLS-MAK-LXT-18',
    brand: 'Makita',
    price: 229.99,
    categorySlug: 'tools',
    quantityOnHand: 120,
  },
] as const;

async function main() {
  const adminEmail = 'admin@jd.com';
  const adminPassword = 'AdminPass123!';
  const adminPasswordHash = await (bcrypt as any).hash(adminPassword, 10);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      role: 'ADMIN',
    },
    create: {
      email: adminEmail,
      passwordHash: adminPasswordHash,
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
    },
  });

  const categoryBySlug = new Map<string, string>();

  for (const category of categories) {
    const savedCategory = await prisma.category.upsert({
      where: { slug: category.slug },
      update: {
        name: category.name,
        description: category.description,
      },
      create: {
        slug: category.slug,
        name: category.name,
        description: category.description,
      },
    });

    categoryBySlug.set(category.slug, savedCategory.id);
  }

  for (const product of products) {
    const categoryId = categoryBySlug.get(product.categorySlug);
    if (!categoryId) {
      throw new Error("Category not found for slug " + product.categorySlug);
    }

    const savedProduct = await prisma.product.upsert({
      where: { sku: product.sku },
      update: {
        slug: product.slug,
        name: product.name,
        description: product.description,
        brand: product.brand,
        price: product.price,
        categoryId,
        active: true,
      },
      create: {
        slug: product.slug,
        name: product.name,
        description: product.description,
        sku: product.sku,
        brand: product.brand,
        price: product.price,
        categoryId,
        active: true,
      },
    });

    await prisma.inventoryItem.upsert({
      where: { productId: savedProduct.id },
      update: {
        quantityOnHand: product.quantityOnHand,
        quantityReserved: 0,
        reorderLevel: 100,
        warehouseCode: 'MIA-01',
      },
      create: {
        productId: savedProduct.id,
        quantityOnHand: product.quantityOnHand,
        quantityReserved: 0,
        reorderLevel: 100,
        warehouseCode: 'MIA-01',
      },
    });
  }

  console.log('Seed completed. Admin user: ' + adminEmail + ' / ' + adminPassword);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
