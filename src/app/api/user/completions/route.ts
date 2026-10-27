import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getUserCompletions } from '@/lib/data';

export const dynamic = 'force-dynamic';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ completedIds: [] });
  }

  const completedIds = await getUserCompletions(session.user.id);
  return NextResponse.json({ completedIds });
}
