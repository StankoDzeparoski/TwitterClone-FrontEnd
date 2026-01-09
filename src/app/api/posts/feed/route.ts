import { NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export async function GET(req: Request) {
  const url = new URL(req.url);
  const limit = url.searchParams.get('limit') ?? '20';
  const cursor = url.searchParams.get('cursor');

  const qs = new URLSearchParams({ limit });
  if (cursor) qs.set('cursor', cursor);

  const res = await fetch(`${API_URL}/posts/feed?${qs.toString()}`, {
    cache: 'no-store',
  });

  const data = await res.json().catch(() => null);
  return NextResponse.json(data, { status: res.status });
}
