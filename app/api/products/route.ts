import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get('categoryId');
    const materialId = searchParams.get('materialId');

    const where: any = { availability: true };

    if (categoryId) {
      where.category_id = categoryId;
    }

    if (materialId) {
      where.material_id = materialId;
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        category: true,
        material: true,
      },
      orderBy: { created_at: 'desc' },
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
      category_id,
      material_id,
      image_uri,
      product_image_urls,
      specs,
      price_range,
      availability,
      stock,
    } = body;

    const product = await prisma.product.create({
      data: {
        name,
        description,
        category_id,
        material_id,
        image_uri,
        product_image_urls: product_image_urls || [],
        specs,
        price_range,
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
