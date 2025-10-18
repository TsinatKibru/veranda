import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const role = (session.user as any).role;

    if (role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const { status } = body;
    const params = await context.params;

    const request = await prisma.request.update({
      where: { id: params.id },
      data: { status },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            companyName: true,
          },
        },
        product: true,
      },
    });

    return NextResponse.json(request);
  } catch (error) {
    console.error('Error updating request:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
