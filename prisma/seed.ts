import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('1qaz2wsx3edc', 12);

  await prisma.user.createMany({
    data: [
      {
        email: 'admin@veranda.com',
        name: 'Admin User',
        role: 'ADMIN',
        password_hash: passwordHash,
        companyName: 'Veranda Plastics',
        contactInfo: '+1-555-0100',
      },
      {
        email: 'client@example.com',
        name: 'Hotel Manager',
        role: 'CLIENT',
        password_hash: passwordHash,
        companyName: 'Seaside Resort & Spa',
        contactInfo: '+1-555-0200',
      },
      {
        email: 'client2@example.com',
        name: 'Resort Director',
        role: 'CLIENT',
        password_hash: passwordHash,
        companyName: 'Mountain View Hotels',
        contactInfo: '+1-555-0300',
      },
    ],
    skipDuplicates: true,
  });

  console.log('✓ Users seeded');

  await prisma.category.createMany({
    data: [
      {
        name: 'Outdoor Chairs',
        description: 'Durable chairs for outdoor hospitality spaces',
        category_order: 1,
        is_active: true,
      },
      {
        name: 'Tables',
        description: 'Weather-resistant tables for patios and poolsides',
        category_order: 2,
        is_active: true,
      },
      {
        name: 'Planters',
        description: 'Decorative planters for landscaping',
        category_order: 3,
        is_active: true,
      },
      {
        name: 'Waste Bins',
        description: 'Commercial-grade outdoor waste management',
        category_order: 4,
        is_active: true,
      },
    ],
    skipDuplicates: true,
  });

  console.log('✓ Categories seeded');

  await prisma.material.createMany({
    data: [
      {
        name: 'High-Density Plastic',
        description: 'UV-resistant, weatherproof plastic for all climates',
      },
      {
        name: 'Recycled Plastic',
        description: 'Eco-friendly recycled plastic composite',
      },
      {
        name: 'Metal Frame',
        description: 'Powder-coated aluminum or steel frame',
      },
      {
        name: 'Wood Composite',
        description: 'Synthetic wood-look composite material',
      },
    ],
    skipDuplicates: true,
  });

  console.log('✓ Materials seeded');

  const categories = await prisma.category.findMany();
  const materials = await prisma.material.findMany();

  const chairCategory = categories.find((c) => c.name === 'Outdoor Chairs');
  const tableCategory = categories.find((c) => c.name === 'Tables');
  const planterCategory = categories.find((c) => c.name === 'Planters');

  const hdPlastic = materials.find((m) => m.name === 'High-Density Plastic');
  const recycledPlastic = materials.find((m) => m.name === 'Recycled Plastic');
  const metalFrame = materials.find((m) => m.name === 'Metal Frame');

  await prisma.product.createMany({
    data: [
      {
        name: 'Veranda Lounge Chair - Classic',
        description:
          'Our signature poolside lounge chair with adjustable backrest. Perfect for resorts and hotels.',
        category_id: chairCategory?.id,
        material_id: hdPlastic?.id,
        price_range: '$45 - $65',
        availability: true,
        stock: 250,
        specs: {
          dimensions: '72" L x 26" W x 14" H',
          weight: '28 lbs',
          capacity: '350 lbs',
          colors: ['White', 'Navy', 'Teal', 'Sand'],
        },
      },
      {
        name: 'Veranda Stacking Chair',
        description:
          'Space-saving stackable dining chair for outdoor venues. UV-resistant and easy to clean.',
        category_id: chairCategory?.id,
        material_id: recycledPlastic?.id,
        price_range: '$30 - $45',
        availability: true,
        stock: 500,
        specs: {
          dimensions: '19" L x 20" W x 35" H',
          weight: '12 lbs',
          capacity: '300 lbs',
          stackable: true,
          colors: ['White', 'Black', 'Grey'],
        },
      },
      {
        name: 'Veranda Adirondack Chair',
        description:
          'Classic Adirondack style chair with modern durability. Ideal for patios and terraces.',
        category_id: chairCategory?.id,
        material_id: hdPlastic?.id,
        price_range: '$75 - $95',
        availability: true,
        stock: 150,
        specs: {
          dimensions: '30" L x 33" W x 38" H',
          weight: '35 lbs',
          capacity: '400 lbs',
          colors: ['White', 'Red', 'Blue', 'Green'],
        },
      },
      {
        name: 'Veranda Dining Table - Round',
        description: '48" round table perfect for 4-6 guests. Durable and stylish.',
        category_id: tableCategory?.id,
        material_id: metalFrame?.id,
        price_range: '$250 - $350',
        availability: true,
        stock: 75,
        specs: {
          dimensions: '48" diameter x 29" H',
          weight: '65 lbs',
          capacity: '200 lbs',
          umbrella_hole: true,
        },
      },
      {
        name: 'Veranda Side Table',
        description: 'Compact side table for poolside and patio use.',
        category_id: tableCategory?.id,
        material_id: hdPlastic?.id,
        price_range: '$40 - $60',
        availability: true,
        stock: 200,
        specs: {
          dimensions: '18" L x 18" W x 20" H',
          weight: '15 lbs',
          colors: ['White', 'Black', 'Teal'],
        },
      },
      {
        name: 'Veranda Planter - Large',
        description: 'Commercial-grade planter box for landscaping.',
        category_id: planterCategory?.id,
        material_id: recycledPlastic?.id,
        price_range: '$80 - $120',
        availability: true,
        stock: 100,
        specs: {
          dimensions: '36" L x 18" W x 18" H',
          weight: '25 lbs',
          drainage: true,
          colors: ['Terracotta', 'Stone Grey', 'Forest Green'],
        },
      },
    ],
    skipDuplicates: true,
  });

  console.log('✓ Products seeded');

  const users = await prisma.user.findMany();
  const products = await prisma.product.findMany();

  const client = users.find((u) => u.role === 'CLIENT');
  const admin = users.find((u) => u.role === 'ADMIN');
  const loungeChair = products.find((p) => p.name.includes('Lounge Chair'));

  if (client && loungeChair) {
    const request = await prisma.request.create({
      data: {
        user_id: client.id,
        product_id: loungeChair.id,
        quantity: 50,
        status: 'PENDING',
        notes: 'Need 50 units for our new poolside area. Can we get a bulk discount?',
        custom_specs: {
          color_preference: 'Navy',
          delivery_date: '2025-11-01',
        },
      },
    });

    if (admin) {
      await prisma.message.create({
        data: {
          request_id: request.id,
          from_user_id: client.id,
          content: 'Hi, I would like to discuss pricing for a bulk order of 50 lounge chairs.',
        },
      });

      await prisma.message.create({
        data: {
          request_id: request.id,
          from_user_id: admin.id,
          content:
            'Thank you for your inquiry! For an order of 50 units, we can offer a 15% discount. Let me prepare a detailed quote for you.',
        },
      });
    }

    console.log('✓ Sample request and messages seeded');
  }

  console.log('\n✅ Database seeded successfully!');
  console.log('\nTest credentials:');
  console.log('Admin: admin@veranda.com / 1qaz2wsx3edc');
  console.log('Client: client@example.com / 1qaz2wsx3edc');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
