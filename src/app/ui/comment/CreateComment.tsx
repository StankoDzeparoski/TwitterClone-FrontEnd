'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch } from '../../lib/api.client';

export default function CreateComment({
  postId,
  isLoggedIn,
}: {
  postId: string;
  isLoggedIn: boolean;
}) {
  const [content, setContent] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const router = useRouter();

  async function submit() {
    if (!isLoggedIn || busy) return;
    const safe = content.trim();
    if (!safe) return;

    setBusy(true);
    setErr(null);

    try {
      await apiFetch(`/api/posts/${postId}/comments`, {
        method: 'POST',
        body: JSON.stringify({ content: safe }),
      });
      setContent('');
      router.refresh();
    } catch (e: any) {
      const msg = String(e?.message ?? '');
      if (msg.includes('401') || msg.toLowerCase().includes('unauthorized')) {
        router.push('/auth/login');
      } else {
        setErr(msg || 'Failed to comment');
      }
    } finally {
      setBusy(false);
    }
  }

  if (!isLoggedIn) {
    return (
      <div className="rounded-2xl border border-border bg-card p-3 text-sm text-muted-fg shadow-sm">
        Login to comment.
      </div>
    );
  }

  return (
    <section className="rounded-2xl border border-border bg-card p-3 text-card-fg shadow-sm">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={2}
        placeholder="Write a comment…"
        className="w-full resize-none rounded-xl border border-border bg-bg px-3 py-2 text-sm text-fg outline-none placeholder:text-muted-fg focus:ring-2 focus:ring-ring/30"
      />

      {err ? (
        <div className="mt-2 rounded-xl border border-border bg-muted px-3 py-2 text-sm text-fg">
          {err}
        </div>
      ) : null}

      <div className="mt-2 flex items-center justify-between">
        <span className="text-xs text-muted-fg">{content.length}/280</span>
        <button
          onClick={submit}
          disabled={busy || !content.trim()}
          className="rounded-xl bg-fg px-4 py-2 text-sm font-medium text-bg shadow-sm hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {busy ? 'Posting…' : 'Comment'}
        </button>
      </div>
    </section>
  );
}
