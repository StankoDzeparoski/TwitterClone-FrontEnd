'use client';

import { useState } from 'react';
import { apiFetch } from '../lib/api.client';
import { useRouter } from 'next/navigation';

export default function RegisterForm() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState<string | null>(null);
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    try {

      await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });
        
      // await apiFetch('/auth/register', {
      //   method: 'POST',
      //   body: JSON.stringify({ username, email, password }),
      // });
      router.push('/');
      router.refresh();
    } catch (e: any) {
      setErr(e.message ?? 'Register failed');
    }
  }

  return (
    <form onSubmit={onSubmit} style={{ display: 'grid', gap: 12 }}>
      <input placeholder="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
      <input placeholder="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input placeholder="password (min 6)" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      {err && <div style={{ color: 'crimson' }}>{err}</div>}
      <button type="submit">Create account</button>
    </form>
  );
}
