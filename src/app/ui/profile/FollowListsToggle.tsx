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
    'rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-50';
  const buttonActive = 'bg-zinc-900 text-white hover:bg-black border-zinc-900';

  return (
    <div className="mt-4">
      {/* Toggle buttons */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setOpen((cur) => (cur === 'followers' ? null : 'followers'))}
          className={`${buttonBase} ${showFollowers ? buttonActive : ''}`}
        >
          Followers <span className="ml-1 opacity-80">({followersCount})</span>
        </button>

        <button
          type="button"
          onClick={() => setOpen((cur) => (cur === 'following' ? null : 'following'))}
          className={`${buttonBase} ${showFollowing ? buttonActive : ''}`}
        >
          Following <span className="ml-1 opacity-80">({followingCount})</span>
        </button>

        {open ? (
          <button
            type="button"
            onClick={() => setOpen(null)}
            className="ml-1 text-sm text-zinc-500 hover:text-zinc-700"
          >
            Close
          </button>
        ) : null}
      </div>

      {/* Collapsible panel */}
      {open ? (
        <div className="mt-3 rounded-2xl border border-zinc-200 bg-white p-3">
          <div className="mb-2 flex items-center justify-between">
            <div className="text-sm font-semibold text-zinc-900">
              {open === 'followers' ? 'Followers' : 'Following'}
            </div>
            <div className="text-xs text-zinc-500">
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
                  className={`rounded-lg px-2 py-1 text-sm text-zinc-700 hover:bg-zinc-50 hover:underline ${
                    uid === profileUserId ? 'opacity-70' : ''
                  }`}
                >
                  @{uid}
                </Link>
              ))
            ) : (
              <div className="text-sm text-zinc-500">
                {open === 'followers' ? 'No followers yet.' : 'Not following anyone yet.'}
              </div>
            )}

            {(open === 'followers' ? followerIds : followingIds).length > 50 ? (
              <div className="mt-1 text-xs text-zinc-500">
                …and {(open === 'followers' ? followerIds : followingIds).length - 50} more
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
