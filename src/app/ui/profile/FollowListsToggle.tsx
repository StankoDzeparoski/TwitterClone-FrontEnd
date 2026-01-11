'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function FollowListsToggle({
  profileUserId,
  followerIds,
  followingIds,
}: {
  profileUserId: string;
  followerIds: string[];
  followingIds: string[];
}) {
  const [open, setOpen] = useState<'followers' | 'following' | null>(null);

  const followersCount = followerIds.length;
  const followingCount = followingIds.length;

  const showFollowers = open === 'followers';
  const showFollowing = open === 'following';

 const buttonBase =
  'inline-flex items-center rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-fg shadow-sm transition ';
  // 'hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring/30'
  const buttonActive =
  'border-transparent bg-fg !text-bg hover:opacity-90';

  return (
    <div className="mt-4">
      {/* Toggle buttons */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setOpen((cur) => (cur === 'followers' ? null : 'followers'))}
          className={`${buttonBase} ${showFollowers ? buttonActive : ''}`}
        >
          Followers <span className="ml-2 text-xs opacity-80">({followersCount})</span>
        </button>

        <button
          type="button"
          onClick={() => setOpen((cur) => (cur === 'following' ? null : 'following'))}
          className={`${buttonBase} ${showFollowing ? buttonActive : ''}`}
        >
          Following <span className="ml-2 text-xs opacity-80">({followingCount})</span>
        </button>

        {open ? (
          <button
            type="button"
            onClick={() => setOpen(null)}
            className="ml-1 rounded-full px-3 py-2 text-sm text-muted-fg hover:bg-muted hover:text-fg"
          >
            Close
          </button>
        ) : null}
      </div>

      {/* Collapsible panel */}
      {open ? (
        <div className="mt-3 rounded-2xl border border-border bg-card p-3 text-card-fg shadow-sm">
          <div className="mb-2 flex items-center justify-between">
            <div className="text-sm font-semibold">
              {open === 'followers' ? 'Followers' : 'Following'}
            </div>
            <div className="text-xs text-muted-fg">
              {open === 'followers' ? followersCount : followingCount} total
            </div>
          </div>

          {/* list */}
          <div className="grid gap-1">
            {(open === 'followers' ? followerIds : followingIds).length ? (
              (open === 'followers' ? followerIds : followingIds).slice(0, 50).map((uid) => (
                <Link
                  key={uid}
                  href={`/profile/${uid}`}
                  className={`rounded-lg px-2 py-1 text-sm text-fg transition hover:bg-muted hover:underline ${
                    uid === profileUserId ? 'opacity-70' : ''
                  }`}
                >
                  @{uid}
                </Link>
              ))
            ) : (
              <div className="text-sm text-muted-fg">
                {open === 'followers' ? 'No followers yet.' : 'Not following anyone yet.'}
              </div>
            )}

            {(open === 'followers' ? followerIds : followingIds).length > 50 ? (
              <div className="mt-1 text-xs text-muted-fg">
                …and {(open === 'followers' ? followerIds : followingIds).length - 50} more
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
