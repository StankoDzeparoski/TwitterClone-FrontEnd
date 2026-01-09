// const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

// export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
//   const res = await fetch(`${API_URL}${path}`, {
//     ...init,
//     credentials: 'include',
//     headers: {
//       'Content-Type': 'application/json',
//       ...(init?.headers ?? {}),
//     },
//   });

//   if (!res.ok) {
//     const ct = res.headers.get('content-type') || '';
//     if (ct.includes('application/json')) {
//       const data = await res.json().catch(() => null);
//       throw new Error(data?.message ? JSON.stringify(data.message) : JSON.stringify(data));
//     }
//     const text = await res.text().catch(() => '');
//     throw new Error(text || `Request failed: ${res.status}`);
//   }


//   const ct = res.headers.get('content-type') || '';
//   if (!ct.includes('application/json')) return {} as T;
//   return (await res.json()) as T;
// }
