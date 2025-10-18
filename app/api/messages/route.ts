import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const body = await req.json();
    const { request_id, content } = body;

    const request = await prisma.request.findUnique({
      where: { id: request_id },
    });

    if (!request) {
      return NextResponse.json({ error: 'Request not found' }, { status: 404 });
    }

    const userRole = (session.user as any).role;
    if (userRole !== 'ADMIN' && request.user_id !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const message = await prisma.message.create({
      data: {
        request_id,
        from_user_id: userId,
        content,
      },
      include: {
        from_user: {
          select: {
            id: true,
            name: true,
            role: true,
          },
        },
      },
    });

    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    console.error('Error creating message:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
