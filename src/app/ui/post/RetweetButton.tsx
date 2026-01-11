'use client';

import { apiFetch } from '../../lib/api.client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function RetweetButton({
  postId,
  isLoggedIn,
}: {
  postId: string;
  isLoggedIn: boolean;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function toggle() {
    if (!isLoggedIn || busy) return;
    setBusy(true);

    try {
      await apiFetch(`/api/posts/${postId}/retweet`, { method: 'POST' });
      router.refresh();
    } catch (e: any) {
      const msg = String(e?.message ?? '');
      if (msg.includes('401') || msg.toLowerCase().includes('unauthorized')) {
        router.push('/auth/login');
      } else {
        throw e;
      }
    } finally {
      setBusy(false);
    }
  }

  const disabled = busy || !isLoggedIn;

  return (
    <button
      onClick={toggle}
      disabled={disabled}
      title={!isLoggedIn ? 'Login to repost' : undefined}
      className="rounded-xl border border-border bg-card px-3 py-2 text-sm text-fg shadow-sm hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60"
    >
      🔁 {busy ? '...' : 'Repost'}
    </button>
  );
}
