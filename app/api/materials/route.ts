import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const materials = await prisma.material.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });
    return NextResponse.json(materials);
  } catch (error) {
    console.error('Error fetching materials:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, description, imageUri } = body;

    const material = await prisma.material.create({
      data: {
        name,
        description,
        imageUri,
      },
    });

    return NextResponse.json(material, { status: 201 });
  } catch (error) {
    console.error('Error creating material:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
