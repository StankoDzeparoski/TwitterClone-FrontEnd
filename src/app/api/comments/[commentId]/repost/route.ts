import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export async function POST(
  _: Request,
  { params }: { params: Promise<{ commentId: string }> }
) {
  const { commentId } = await params;

  const token = (await cookies()).get('token')?.value;
  if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  const res = await fetch(`${API_URL}/comments/${commentId}/repost`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json().catch(() => null);
  return NextResponse.json(data, { status: res.status });
}
