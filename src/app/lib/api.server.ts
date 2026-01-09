// import { cookies } from 'next/headers';

// const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

// function buildErrorMessage(data: any) {
//   if (!data) return 'Request failed';
//   if (typeof data === 'string') return data;
//   if (Array.isArray(data.message)) return data.message.join(', ');
//   if (typeof data.message === 'string') return data.message;
//   return JSON.stringify(data);
// }

// // ✅ Use this from Server Components / Route Handlers
// export async function apiFetchServer<T>(path: string, init?: RequestInit): Promise<T> {
//   const cookieStore = await cookies();
//   const cookieHeader = cookieStore
//     .getAll()
//     .map((c) => `${c.name}=${c.value}`)
//     .join('; ');

//   const res = await fetch(`${API_URL}${path}`, {
//     ...init,
//     // forward cookies so auth works in server components
//     headers: {
//       ...(init?.headers ?? {}),
//       ...(cookieHeader ? { cookie: cookieHeader } : {}),
//       ...(init?.body ? { 'Content-Type': 'application/json' } : {}),
//     },
//     cache: init?.cache ?? 'no-store',
//   });

//   if (!res.ok) {
//     const ct = res.headers.get('content-type') || '';
//     if (ct.includes('application/json')) {
//       const data = await res.json().catch(() => null);
//       throw new Error(buildErrorMessage(data));
//     }
//     const text = await res.text().catch(() => '');
//     throw new Error(text || `Request failed: ${res.status}`);
//   }

//   const ct = res.headers.get('content-type') || '';
//   if (!ct.includes('application/json')) return {} as T;
//   return (await res.json()) as T;
// }
// =============


// import { cookies } from 'next/headers';

// const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

// function buildErrorMessage(data: any) {
//   if (!data) return 'Request failed';
//   if (typeof data === 'string') return data;
//   if (Array.isArray(data.message)) return data.message.join(', ');
//   if (typeof data.message === 'string') return data.message;
//   return JSON.stringify(data);
// }

// export async function apiFetchServer<T>(path: string, init?: RequestInit): Promise<T> {
//   const cookieStore = await cookies();
//   const token = cookieStore.get('token')?.value; // ✅ Next-owned cookie now exists

//   const res = await fetch(`${API_URL}${path}`, {
//     ...init,
//     headers: {
//       ...(init?.headers ?? {}),
//       ...(init?.body ? { 'Content-Type': 'application/json' } : {}),
//       ...(token ? { Authorization: `Bearer ${token}` } : {}), // ✅ SSR auth
//     },
//     cache: init?.cache ?? 'no-store',
//   });

//   if (!res.ok) {
//     const ct = res.headers.get('content-type') || '';
//     if (ct.includes('application/json')) {
//       const data = await res.json().catch(() => null);
//       throw new Error(buildErrorMessage(data));
//     }
//     const text = await res.text().catch(() => '');
//     throw new Error(text || `Request failed: ${res.status}`);
//   }

//   const ct = res.headers.get('content-type') || '';
//   if (!ct.includes('application/json')) return {} as T;
//   return (await res.json()) as T;
// }

// =================

import { cookies } from 'next/headers';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

export async function apiFetchServer<T>(path: string, init?: RequestInit): Promise<T> {
  const token = (await cookies()).get('token')?.value;

  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      ...(init?.headers ?? {}),
      ...(init?.body ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    cache: init?.cache ?? 'no-store',
  });

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.message ? JSON.stringify(data.message) : JSON.stringify(data));
  }

  return (await res.json()) as T;
}
