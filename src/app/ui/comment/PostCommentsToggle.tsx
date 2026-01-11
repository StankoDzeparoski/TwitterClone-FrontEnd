'use client';

import { useEffect, useMemo, useState } from 'react';
import { apiFetch } from '../../lib/api.client';
import CreateCommentInline from './CreateCommentInline';
import CommentItem from './CommentItem';

type CommentListRes = { items: any[]; nextCursor: string | null };

export default function PostCommentsToggle({
  postId,
  isLoggedIn,
  initialCount,
}: {
  postId: string;
  isLoggedIn: boolean;
  initialCount?: number;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<any[]>([]);
  const [err, setErr] = useState<string | null>(null);

  const countLabel = useMemo(() => {
    if (open) {
      const n = items.length;
      return `${n} comment${n === 1 ? '' : 's'}`;
    }
    const n = typeof initialCount === 'number' ? initialCount : items.length;
    return `${n} comment${n === 1 ? '' : 's'}`;
  }, [open, initialCount, items.length]);

  async function load() {
    setLoading(true);
    setErr(null);
    try {
      const data = await apiFetch<CommentListRes>(`/api/posts/${postId}/comments?limit=50`, {
        cache: 'no-store',
      });
      setItems(data.items ?? []);
    } catch (e: any) {
      setErr(String(e?.message ?? 'Failed to load comments'));
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (open && items.length === 0 && !loading && !err) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <section>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="text-sm text-muted-fg hover:text-fg hover:underline"
      >
        {open ? 'Hide comments' : `Show comments (${countLabel})`}
      </button>

      {open ? (
        <div className="mt-3 grid gap-3">
          <CreateCommentInline postId={postId} isLoggedIn={isLoggedIn} onCreated={load} />

          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold text-fg">Comments</div>
            <button
              type="button"
              onClick={load}
              disabled={loading}
              className="text-xs text-muted-fg hover:text-fg disabled:opacity-60"
              title="Refresh"
            >
              {loading ? 'Loading…' : 'Refresh'}
            </button>
          </div>

          {err ? (
            <div className="rounded-2xl border border-border bg-muted p-3 text-sm text-fg">
              {err}
            </div>
          ) : null}

          {!loading && !items.length ? (
            <div className="rounded-2xl border border-border bg-card p-3 text-sm text-muted-fg shadow-sm">
              No comments yet.
            </div>
          ) : null}

          <div className="grid gap-3">
            {items.map((c) => (
              <CommentItem key={c.id} c={c} isLoggedIn={isLoggedIn} />
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}
