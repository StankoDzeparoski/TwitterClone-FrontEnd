'use client';

import { useState } from 'react';
import { apiFetch } from '../lib/api.client';
import { useRouter } from 'next/navigation';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState<string | null>(null);
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    try {
      await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      // await apiFetch('/auth/login', {
      //   method: 'POST',
      //   body: JSON.stringify({ email, password }),
      // });
      router.push('/');
      router.refresh();
    } catch (e: any) {
      setErr(e.message ?? 'Login failed');
    }
  }

  return (
    <form onSubmit={onSubmit} style={{ display: 'grid', gap: 12 }}>
      <input placeholder="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input placeholder="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      {err && <div style={{ color: 'crimson' }}>{err}</div>}
      <button type="submit">Login</button>
    </form>
  );
}
