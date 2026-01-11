'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterForm() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;

    setErr(null);
    setBusy(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });

      if (!res.ok) {
        const t = await res.text().catch(() => '');
        throw new Error(t || 'Register failed');
      }

      router.push('/');
      router.refresh();
    } catch (e: any) {
      setErr(String(e?.message ?? 'Register failed'));
    } finally {
      setBusy(false);
    }
  }

  const inputCls =
    'w-full rounded-xl border border-border bg-bg px-3 py-2 text-sm text-fg outline-none ' +
    'placeholder:text-muted-fg focus:ring-2 focus:ring-ring/30';

  return (
    <section className="rounded-2xl border border-border bg-card p-5 text-card-fg shadow-sm">
      <div className="mb-4">
        <h1 className="text-lg font-semibold">Create account</h1>
        <p className="mt-1 text-sm text-muted-fg">Join and start posting.</p>
      </div>

      <form onSubmit={onSubmit} className="grid gap-3">
        <label className="grid gap-1">
          <span className="text-xs text-muted-fg">Username</span>
          <input
            className={inputCls}
            placeholder="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
          />
        </label>

        <label className="grid gap-1">
          <span className="text-xs text-muted-fg">Email</span>
          <input
            className={inputCls}
            placeholder="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
        </label>

        <label className="grid gap-1">
          <span className="text-xs text-muted-fg">Password</span>
          <input
            className={inputCls}
            placeholder="password (min 6)"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
          />
        </label>

        {err ? (
          <div className="rounded-xl border border-border bg-muted p-3 text-sm text-fg">
            <span className="font-medium">Error:</span> {err}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={busy}
          className="mt-1 inline-flex items-center justify-center rounded-xl bg-fg px-4 py-2 text-sm font-medium !text-bg shadow-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {busy ? 'Creating…' : 'Create account'}
        </button>
      </form>
    </section>
  );
}
