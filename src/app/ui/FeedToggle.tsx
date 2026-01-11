'use client';

import { useMemo, useState } from 'react';
import PostCard from './PostCard';

export default function FeedToggle({
  followingFeed,
  discoverFeed,
  isLoggedIn,
}: {
  followingFeed: any[];
  discoverFeed: any[];
  isLoggedIn: boolean;
}) {
  const [tab, setTab] = useState<'following' | 'discover'>('following');

  const activeItems = useMemo(
    () => (tab === 'following' ? followingFeed : discoverFeed),
    [tab, followingFeed, discoverFeed],
  );

  const pillBase =
    'rounded-full px-3 py-1.5 text-sm transition border';
  const pillInactive =
    'border-border bg-card text-fg hover:bg-muted';
  const pillActive =
    'border-border bg-fg text-bg shadow-sm';

  return (
    <section className="mt-6">
      {/* Toggle row */}
      <div className="mb-3 flex items-center gap-2">
        {/* pill group container */}
        <div className="flex items-center gap-2 rounded-full border border-border bg-card p-1">
          <button
            type="button"
            onClick={() => setTab('following')}
            className={`${pillBase} ${tab === 'following' ? pillActive : pillInactive}`}
          >
            Following <span className="ml-1 opacity-70">({followingFeed.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setTab('discover')}
            className={`${pillBase} ${tab === 'discover' ? pillActive : pillInactive}`}
          >
            Discover <span className="ml-1 opacity-70">({discoverFeed.length})</span>
          </button>
        </div>

        <span className="ml-auto text-xs text-muted-fg">
          Showing: <span className="font-medium text-fg capitalize">{tab}</span>
        </span>
      </div>

      {/* Empty state */}
      {tab === 'following' && followingFeed.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card p-4 text-sm text-muted-fg shadow-sm">
          No posts from people you follow yet.
        </div>
      ) : (
        <div className="grid gap-4">
          {activeItems.map((p) => (
            <PostCard key={p.id} post={p} isLoggedIn={isLoggedIn} />
          ))}
        </div>
      )}
    </section>
  );
}
