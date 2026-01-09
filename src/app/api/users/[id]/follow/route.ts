import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export async function POST(_: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;

  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join('; ');

  const res = await fetch(`${API_URL}/users/${id}/follow`, {
    method: 'POST',
    headers: {
      ...(cookieHeader ? { cookie: cookieHeader } : {}),
    },
    cache: 'no-store',
  });

  const text = await res.text();
  return new NextResponse(text, {
    status: res.status,
    headers: { 'content-type': res.headers.get('content-type') ?? 'application/json' },
  });
}
