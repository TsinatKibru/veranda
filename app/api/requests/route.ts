import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const role = (session.user as any).role;

    const where: any = role === 'ADMIN' ? {} : { userId: userId };

    const requests = await prisma.quoteRequest.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            companyName: true,
          },
        },
        items: {
          include: {
            product: {
              include: {
                category: true,
                material: true,
              },
            },
          },
        },
        messages: {
          include: {
            fromUser: {
              select: {
                id: true,
                name: true,
                role: true,
              },
            },
          },
          orderBy: { createdAt: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(requests);
  } catch (error) {
    console.error('Error fetching requests:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const body = await req.json();
    const { items, notes } = body; // items is an array of { productId, quantity, customSpecs }

    const quoteRequest = await prisma.quoteRequest.create({
      data: {
        userId: userId,
        notes,
        status: 'PENDING',
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            customSpecs: item.customSpecs,
          })),
        },
      },
      include: {
        items: {
          include: {
            product: true,
          }
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            companyName: true,
          },
        },
      },
    });

    return NextResponse.json(quoteRequest, { status: 201 });
  } catch (error) {
    console.error('Error creating request:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
