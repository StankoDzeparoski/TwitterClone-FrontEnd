import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export async function GET() {
  const token = (await cookies()).get('token')?.value;
  if (!token) return NextResponse.json({ user: null }, { status: 200 });

  const res = await fetch(`${API_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });

  // if backend says 401, treat as logged out
  if (res.status === 401) return NextResponse.json({ user: null }, { status: 200 });

  const data = await res.json().catch(() => null);
  return NextResponse.json(data, { status: res.status });
}
