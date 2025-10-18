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

    const where: any = role === 'ADMIN' ? {} : { user_id: userId };

    const requests = await prisma.request.findMany({
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
        product: {
          include: {
            category: true,
            material: true,
          },
        },
        messages: {
          include: {
            from_user: {
              select: {
                id: true,
                name: true,
                role: true,
              },
            },
          },
          orderBy: { created_at: 'asc' },
        },
      },
      orderBy: { created_at: 'desc' },
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
    const { product_id, quantity, custom_specs, notes } = body;

    const request = await prisma.request.create({
      data: {
        user_id: userId,
        product_id,
        quantity,
        custom_specs,
        notes,
        status: 'PENDING',
      },
      include: {
        product: true,
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

    return NextResponse.json(request, { status: 201 });
  } catch (error) {
    console.error('Error creating request:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
