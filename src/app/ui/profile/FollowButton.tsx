'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function FollowButton({
  targetUserId,
  initialFollowing,
}: {
  targetUserId: string;
  initialFollowing: boolean;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [following, setFollowing] = useState(initialFollowing);

  async function toggle() {
    if (busy) return;
    setBusy(true);

    try {
      const res = await fetch(`/api/users/${targetUserId}/follow`, { method: 'POST' });

      if (res.status === 401) {
        router.push('/auth/login');
        return;
      }

      if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new Error(text || `Request failed: ${res.status}`);
      }

      const data = (await res.json()) as { following?: boolean };
      if (typeof data.following === 'boolean') setFollowing(data.following);

      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  const base =
    'inline-flex items-center rounded-full px-4 py-2 text-sm font-medium shadow-sm transition focus:outline-none focus:ring-2 focus:ring-ring/30 disabled:cursor-not-allowed disabled:opacity-60';

  const primary = 'bg-fg text-bg hover:bg-fg/90';
  const outline = 'border border-border bg-card text-fg hover:bg-muted';

  return (
    <button
      onClick={toggle}
      disabled={busy}
      className={`${base} ${following ? outline : primary}`}
    >
      {busy ? '…' : following ? 'Unfollow' : 'Follow'}
    </button>
  );
}
