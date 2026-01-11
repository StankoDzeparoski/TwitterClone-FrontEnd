import Link from 'next/link';
import { apiFetchServer } from '../../lib/api.server';
import PostCard from '../../ui/PostCard';
import FollowButton from '../../ui/profile/FollowButton';
import FollowListsToggle from '../../ui/profile/FollowListsToggle';

type MeRes = { user: { id: string } | null };

type PublicUser = {
  id: string;
  username?: string;
  email?: string;
  createdAt?: string;

  likedPostIds?: string[];
  repostedPostIds?: string[];

  usersFollowingIds?: string[];
  userFollowersIds?: string[];
};

type UserRes = { user: PublicUser | null };
type FeedRes = { items: any[]; nextCursor: string | null };
type IdListRes = { items: string[] };

async function safeGetMe() {
  try {
    const res = await apiFetchServer<MeRes>('/auth/me', { cache: 'no-store' });
    return res?.user ?? null;
  } catch {
    return null;
  }
}

async function fetchPostById(postId: string) {
  try {
    const data = await apiFetchServer<any>(`/posts/${postId}`, { cache: 'no-store' });
    return data?.post ?? data ?? null;
  } catch {
    return null;
  }
}

export default async function ProfilePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ tab?: string }>;
}) {
  const { id } = await params;
  const sp = (await searchParams) ?? {};
  const tab = (sp.tab ?? 'posts') as 'posts' | 'liked' | 'reposted';

  const me = await safeGetMe();
  const isLoggedIn = !!me?.id;
  const isMe = me?.id === id;

  const userData = await apiFetchServer<UserRes>(`/users/${id}`, { cache: 'no-store' });
  const user = userData.user;

  if (!user) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-6">
        <div className="rounded-2xl border border-border bg-card p-4 text-card-fg shadow-sm">
          <h1 className="text-xl font-semibold">User not found</h1>
        </div>
      </main>
    );
  }

  const [followersRes, followingRes] = await Promise.all([
    apiFetchServer<IdListRes>(`/users/${id}/followers`, { cache: 'no-store' }).catch(() => ({
      items: [],
    })),
    apiFetchServer<IdListRes>(`/users/${id}/following`, { cache: 'no-store' }).catch(() => ({
      items: [],
    })),
  ]);

  const followerIds = followersRes.items ?? [];
  const followingIds = followingRes.items ?? [];
  const followersCount = followerIds.length;
  const followingCount = followingIds.length;

  const iFollowThisUser =
    isLoggedIn && !isMe ? (user.userFollowersIds ?? followerIds).includes(me!.id) : false;

  let items: any[] = [];
  if (tab === 'posts') {
    const data = await apiFetchServer<FeedRes>(`/posts/user/${id}?limit=20`, { cache: 'no-store' });
    items = data.items;
  } else if (tab === 'liked') {
    const ids = user.likedPostIds ?? [];
    const posts = await Promise.all(ids.slice(0, 50).map(fetchPostById));
    items = posts.filter(Boolean);
  } else if (tab === 'reposted') {
    const ids = user.repostedPostIds ?? [];
    const posts = await Promise.all(ids.slice(0, 50).map(fetchPostById));
    items = posts.filter(Boolean);
  }

  const tabLink = (t: string) => `/profile/${id}?tab=${t}`;

  // const tabBtnBase =
  // 'inline-flex items-center rounded-full border border-border bg-card px-4 py-2 text-sm font-medium shadow-sm transition hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring/30';

  // const tabBtnActive =
  // 'border-transparent bg-fg text-bg hover:bg-fg/90';

  const tabBtnBase =
  'inline-flex items-center rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-fg shadow-sm transition ';
  // 'hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring/30'

  const tabBtnActive =
  'border-transparent bg-fg !text-bg hover:opacity-90';




  return (
    <main className="mx-auto max-w-2xl px-4 py-6 text-fg">
      {/* Profile header card */}
      <div className="rounded-2xl border border-border bg-card p-4 text-card-fg shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold">
              Profile: <span className="font-semibold">@{user.id}</span>
            </h1>

            <p className="mt-1 text-sm text-muted-fg">
              Followers: <span className="font-medium text-fg">{followersCount}</span> · Following:{' '}
              <span className="font-medium text-fg">{followingCount}</span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            {!isLoggedIn ? (
              <Link
                href="/auth/login"
                className="rounded-xl border border-border bg-card px-3 py-2 text-sm text-fg shadow-sm hover:bg-muted"
              >
                Login to interact
              </Link>
            ) : !isMe ? (
              <FollowButton targetUserId={id} initialFollowing={iFollowThisUser} />
            ) : null}
          </div>
        </div>

        {/* "You" box */}
        {isMe ? (
          <div className="mt-3 rounded-xl border border-border bg-muted p-3 text-sm">
            <div className="font-medium">You</div>
            <div className="mt-1 text-xs text-muted-fg">
              Liked: {user.likedPostIds?.length ?? 0} · Reposted: {user.repostedPostIds?.length ?? 0}
            </div>
          </div>
        ) : null}

        {/* Followers / Following toggle */}
        <div className="mt-4">
          <FollowListsToggle profileUserId={id} followerIds={followerIds} followingIds={followingIds} />
        </div>

        {/* Tabs */}
        <div className="mt-4 flex flex-wrap gap-2">
          {(['posts', 'liked', 'reposted'] as const).map((t) => {
            const active = tab === t;
            return (
              <Link
                key={t}
                href={tabLink(t)}
                className={`${tabBtnBase} ${active ? tabBtnActive : ''}`}
              >
                {t[0].toUpperCase() + t.slice(1)}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Posts list */}
      <div className="mt-6 grid gap-4">
        {items.length ? (
          items.map((p) => <PostCard key={p.id} post={p} isLoggedIn={isLoggedIn} />)
        ) : (
          <div className="rounded-2xl border border-border bg-card p-4 text-sm text-muted-fg shadow-sm">
            No items in this tab.
          </div>
        )}
      </div>
    </main>
  );
}
