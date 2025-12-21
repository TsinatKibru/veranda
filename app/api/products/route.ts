import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get('categoryId');
    const materialId = searchParams.get('materialId');

    const where: any = { availability: true };

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (materialId) {
      where.materialId = materialId;
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        category: true,
        material: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      name,
      description,
      categoryId,
      materialId,
      imageUri,
      productImageUrls,
      specs,
      priceRange,
      availability,
      stock,
    } = body;

    const product = await prisma.product.create({
      data: {
        name,
        description,
        categoryId,
        materialId,
        imageUri,
        productImageUrls: productImageUrls || [],
        specs,
        priceRange,
        availability: availability ?? true,
        stock: stock ?? 0,
      },
      include: {
        category: true,
        material: true,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
