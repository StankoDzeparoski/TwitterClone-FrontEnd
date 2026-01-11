'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { apiFetch } from '../../lib/api.client';

export default function CommentActions({
  commentId,
  isLoggedIn,
}: {
  commentId: string;
  isLoggedIn: boolean;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState<'like' | 'repost' | 'bookmark' | null>(null);

  async function act(kind: 'like' | 'repost' | 'bookmark') {
    if (!isLoggedIn || busy) return;
    setBusy(kind);
    try {
      await apiFetch(`/api/comments/${commentId}/${kind}`, { method: 'POST' });
      router.refresh();
    } catch (e: any) {
      const msg = String(e?.message ?? '');
      if (msg.includes('401') || msg.toLowerCase().includes('unauthorized')) {
        router.push('/auth/login');
      } else {
        console.error(e);
      }
    } finally {
      setBusy(null);
    }
  }

  const disabled = !isLoggedIn || !!busy;

  const btn =
    'rounded-xl border border-border bg-card px-3 py-2 text-xs text-fg shadow-sm hover:bg-muted disabled:opacity-60';

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button onClick={() => act('like')} disabled={disabled} className={btn}>
        ❤️ {busy === 'like' ? '…' : 'Like'}
      </button>

      <button onClick={() => act('repost')} disabled={disabled} className={btn}>
        🔁 {busy === 'repost' ? '…' : 'Repost'}
      </button>

      <button onClick={() => act('bookmark')} disabled={disabled} className={btn}>
        🔖 {busy === 'bookmark' ? '…' : 'Save'}
      </button>
    </div>
  );
}
