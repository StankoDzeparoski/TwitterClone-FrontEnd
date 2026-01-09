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
      const res = await fetch(`/api/users/${targetUserId}/follow`, {
        method: 'POST',
      });

      if (res.status === 401) {
        router.push('/auth/login');
        return;
      }

      if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new Error(text || `Request failed: ${res.status}`);
      }

      const data = (await res.json()) as { following?: boolean };

      // backend returns { ok: true, following: boolean }
      if (typeof data.following === 'boolean') setFollowing(data.following);

      // re-render server components (counts/lists)
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      onClick={toggle}
      disabled={busy}
      className={`rounded-xl px-3 py-2 text-sm shadow-sm disabled:cursor-not-allowed disabled:opacity-60 ${
        following
          ? 'border border-zinc-200 bg-white text-zinc-800 hover:bg-zinc-50'
          : 'bg-zinc-900 text-white hover:bg-black'
      }`}
    >
      {busy ? '...' : following ? 'Unfollow' : 'Follow'}
    </button>
  );
}
