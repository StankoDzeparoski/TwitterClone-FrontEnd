import Link from 'next/link';
import { apiFetchServer } from '../../lib/api.server';
import PostCard from '../../ui/PostCard';

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

async function safeGetMe() {
  try {
    const res = await apiFetchServer<MeRes>('/auth/me', { cache: 'no-store' });
    return res?.user ?? null;
  } catch {
    return null;
  }
}

// Tries both shapes: {post: ...} or direct object
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
  const isMe = me?.id === id;

  const userData = await apiFetchServer<UserRes>(`/users/${id}`, { cache: 'no-store' });
  const user = userData.user;

  if (!user) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-6">
        <h1 className="text-xl font-semibold">User not found</h1>
      </main>
    );
  }

  // Load posts depending on tab
  let items: any[] = [];

  if (tab === 'posts') {
    const data = await apiFetchServer<FeedRes>(`/posts/user/${id}?limit=20`, { cache: 'no-store' });
    items = data.items;
  } else if (tab === 'liked') {
    const ids = user.likedPostIds ?? [];
    const posts = await Promise.all(ids.slice(0, 50).map(fetchPostById)); // cap for sanity
    items = posts.filter(Boolean);
  } else if (tab === 'reposted') {
    const ids = user.repostedPostIds ?? [];
    const posts = await Promise.all(ids.slice(0, 50).map(fetchPostById));
    items = posts.filter(Boolean);
  }

  const followersCount = user.userFollowersIds?.length ?? 0;
  const followingCount = user.usersFollowingIds?.length ?? 0;

  const tabLink = (t: string) => `/profile/${id}?tab=${t}`;

  return (
    <main className="mx-auto max-w-2xl px-4 py-6">
      <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold text-zinc-900">
              Profile: <span className="text-zinc-600">@{user.id}</span>
            </h1>
            <p className="mt-1 text-sm text-zinc-600">
              Followers: <span className="font-medium text-zinc-900">{followersCount}</span> · Following:{' '}
              <span className="font-medium text-zinc-900">{followingCount}</span>
            </p>
          </div>

          {!me ? (
            <Link
              href="/auth/login"
              className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-50"
            >
              Login to interact
            </Link>
          ) : null}
        </div>

        {/* ✅ moved /me useful bits here */}
        {isMe ? (
          <div className="mt-3 rounded-xl border border-zinc-200 bg-zinc-50 p-3 text-sm text-zinc-700">
            <div className="font-medium text-zinc-900">You</div>
            <div className="mt-1 text-xs text-zinc-500">
              Liked: {user.likedPostIds?.length ?? 0} · Reposted: {user.repostedPostIds?.length ?? 0}
            </div>
          </div>
        ) : null}

        {/* Tabs */}
        <div className="mt-4 flex gap-2">
          <Link
            href={tabLink('posts')}
            className={`rounded-xl px-3 py-2 text-sm ${
              tab === 'posts' ? 'bg-zinc-900 text-white' : 'border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50'
            }`}
          >
            Posts
          </Link>
          <Link
            href={tabLink('liked')}
            className={`rounded-xl px-3 py-2 text-sm ${
              tab === 'liked' ? 'bg-zinc-900 text-white' : 'border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50'
            }`}
          >
            Liked
          </Link>
          <Link
            href={tabLink('reposted')}
            className={`rounded-xl px-3 py-2 text-sm ${
              tab === 'reposted' ? 'bg-zinc-900 text-white' : 'border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50'
            }`}
          >
            Reposted
          </Link>
        </div>
      </div>

      {/* Posts list */}
      <div className="mt-6 grid gap-4">
        {items.length ? (
          items.map((p) => <PostCard key={p.id} post={p} isLoggedIn={!!me?.id} />)

        ) : (
          <div className="rounded-2xl border border-zinc-200 bg-white p-4 text-sm text-zinc-600 shadow-sm">
            No items in this tab.
            {(tab === 'liked' || tab === 'reposted') ? (
              <div className="mt-2 text-xs text-zinc-500">
                If this stays empty but you know there are ids, confirm your backend has <code>/posts/:id</code>.
              </div>
            ) : null}
          </div>
        )}
      </div>
    </main>
  );
}
