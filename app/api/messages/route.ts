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
    const { quoteRequestId, content } = body;

    const quoteRequest = await prisma.quoteRequest.findUnique({
      where: { id: quoteRequestId },
    });

    if (!quoteRequest) {
      return NextResponse.json({ error: 'Request not found' }, { status: 404 });
    }

    const userRole = (session.user as any).role;
    if (userRole !== 'ADMIN' && quoteRequest.userId !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const message = await prisma.message.create({
      data: {
        quoteRequestId,
        fromUserId: userId,
        content,
      },
      include: {
        fromUser: {
          select: {
            id: true,
            name: true,
            role: true,
          },
        },
      },
    });

    // Notify the other party via Pusher
    const pusher = new (require('pusher'))({
      appId: process.env.PUSHER_APP_ID,
      key: process.env.NEXT_PUBLIC_PUSHER_KEY,
      secret: process.env.PUSHER_SECRET,
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
      useTLS: true,
    });

    const targetChannel = userRole === 'ADMIN' ? `user-${quoteRequest.userId}` : 'admin-notifications';

    await pusher.trigger(targetChannel, "new-message", {
      message,
      quoteRequestId,
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
