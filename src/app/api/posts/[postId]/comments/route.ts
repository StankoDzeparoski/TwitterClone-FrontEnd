import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

// GET /api/posts/:postId/comments?limit=50&cursor=...
export async function GET(
  req: Request,
  { params }: { params: Promise<{ postId: string }> }
) {
  const { postId } = await params;

  const url = new URL(req.url);
  const qs = url.searchParams.toString();

  const res = await fetch(`${API_URL}/posts/${postId}/comments${qs ? `?${qs}` : ''}`, {
    method: 'GET',
  });

  const data = await res.json().catch(() => null);
  return NextResponse.json(data, { status: res.status });
}

// POST /api/posts/:postId/comments  body: { content }
export async function POST(
  req: Request,
  { params }: { params: Promise<{ postId: string }> }
) {
  const { postId } = await params;

  const token = (await cookies()).get('token')?.value;
  if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  const body = await req.json().catch(() => ({}));

  const res = await fetch(`${API_URL}/posts/${postId}/comments`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  const data = await res.json().catch(() => null);
  return NextResponse.json(data, { status: res.status });
}
