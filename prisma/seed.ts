import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('1qaz2wsx3edc', 10);

  await prisma.user.createMany({
    data: [
      {
        email: 'admin@veranda.com',
        name: 'Admin User',
        role: 'ADMIN',
        passwordHash: passwordHash,
        companyName: 'Veranda Plastics',
        contactInfo: '+1-555-0100',
      },
      {
        email: 'client@example.com',
        name: 'Hotel Manager',
        role: 'CLIENT',
        passwordHash: passwordHash,
        companyName: 'Seaside Resort & Spa',
        contactInfo: '+1-555-0200',
      },
      {
        email: 'client2@example.com',
        name: 'Resort Director',
        role: 'CLIENT',
        passwordHash: passwordHash,
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
        categoryOrder: 1,
        isActive: true,
        imageUri: 'https://res.cloudinary.com/dbcuyckat/image/upload/v1760870920/verandalounge_chair_-_classic_ubx00x.png',
      },
      {
        name: 'Tables',
        description: 'Weather-resistant tables for patios and poolsides',
        categoryOrder: 2,
        isActive: true,
        imageUri: 'https://res.cloudinary.com/dbcuyckat/image/upload/v1760870917/verandadiningtable_-_round_mwy64p.png',
      },
      {
        name: 'Planters',
        description: 'Decorative planters for landscaping',
        categoryOrder: 3,
        isActive: true,
        imageUri: 'https://res.cloudinary.com/dbcuyckat/image/upload/v1760870923/verandaplanter-_large_q0fnwb.png',
      },
      {
        name: 'Waste Bins',
        description: 'Commercial-grade outdoor waste management',
        categoryOrder: 4,
        isActive: true,
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
        categoryId: chairCategory?.id,
        materialId: hdPlastic?.id,
        priceRange: '$45 - $65',
        imageUri: 'https://res.cloudinary.com/dbcuyckat/image/upload/v1760870920/verandalounge_chair_-_classic_ubx00x.png',
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
        categoryId: chairCategory?.id,
        materialId: recycledPlastic?.id,
        priceRange: '$30 - $45',
        imageUri: 'https://res.cloudinary.com/dbcuyckat/image/upload/v1760870919/verandastackingchair_jtlqja.png',
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
        categoryId: chairCategory?.id,
        materialId: hdPlastic?.id,
        priceRange: '$75 - $95',
        imageUri: 'https://res.cloudinary.com/dbcuyckat/image/upload/v1760870920/verandaadirondackchair_jlcrq8.png',
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
        categoryId: tableCategory?.id,
        materialId: metalFrame?.id,
        priceRange: '$250 - $350',
        imageUri: 'https://res.cloudinary.com/dbcuyckat/image/upload/v1760870917/verandadiningtable_-_round_mwy64p.png',
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
        categoryId: tableCategory?.id,
        materialId: hdPlastic?.id,
        priceRange: '$40 - $60',
        imageUri: 'https://res.cloudinary.com/dbcuyckat/image/upload/v1760858729/sideTable_hzjoi8.jpg',
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
        categoryId: planterCategory?.id,
        materialId: recycledPlastic?.id,
        priceRange: '$80 - $120',
        imageUri: 'https://res.cloudinary.com/dbcuyckat/image/upload/v1760870923/verandaplanter-_large_q0fnwb.png',
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
    const quoteRequest = await prisma.quoteRequest.create({
      data: {
        userId: client.id,
        status: 'PENDING',
        notes: 'Need 50 units for our new poolside area. Can we get a bulk discount?',
        items: {
          create: [
            {
              productId: loungeChair.id,
              quantity: 50,
              customSpecs: {
                color_preference: 'Navy',
                delivery_date: '2025-11-01',
              },
            }
          ]
        }
      },
    });

    if (admin) {
      await prisma.message.create({
        data: {
          quoteRequestId: quoteRequest.id,
          fromUserId: client.id,
          content: 'Hi, I would like to discuss pricing for a bulk order of 50 lounge chairs.',
        },
      });

      await prisma.message.create({
        data: {
          quoteRequestId: quoteRequest.id,
          fromUserId: admin.id,
          content:
            'Thank you for your inquiry! For an order of 50 units, we can offer a 15% discount. Let me prepare a detailed quote for you.',
        },
      });
    }

    console.log('✓ Sample quote request and messages seeded');
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
