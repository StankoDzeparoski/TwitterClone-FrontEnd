// const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

// function buildErrorMessage(data: any) {
//   // Nest often returns { message: string[] | string, ... }
//   if (!data) return 'Request failed';
//   if (typeof data === 'string') return data;
//   if (Array.isArray(data.message)) return data.message.join(', ');
//   if (typeof data.message === 'string') return data.message;
//   return JSON.stringify(data);
// }

// export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
//   const res = await fetch(`${API_URL}${path}`, {
//     ...init,
//     credentials: 'include',
//     headers: {
//       ...(init?.headers ?? {}),
//       // only set JSON by default if you didn't pass something else
//       ...(init?.body && !(init?.body instanceof FormData)
//         ? { 'Content-Type': 'application/json' }
//         : {}),
//     },
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

function buildErrorMessage(data: any) {
  if (!data) return 'Request failed';
  if (typeof data === 'string') return data;
  if (Array.isArray(data.message)) return data.message.join(', ');
  if (typeof data.message === 'string') return data.message;
  return JSON.stringify(data);
}

// Calls Next API routes (same-origin), so cookies work reliably.
export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    ...init,
    headers: {
      ...(init?.headers ?? {}),
      ...(init?.body && !(init?.body instanceof FormData)
        ? { 'Content-Type': 'application/json' }
        : {}),
    },
  });

  if (!res.ok) {
    const ct = res.headers.get('content-type') || '';
    if (ct.includes('application/json')) {
      const data = await res.json().catch(() => null);
      throw new Error(buildErrorMessage(data));
    }
    const text = await res.text().catch(() => '');
    throw new Error(text || `Request failed: ${res.status}`);
  }

  const ct = res.headers.get('content-type') || '';
  if (!ct.includes('application/json')) return {} as T;
  return (await res.json()) as T;
}

