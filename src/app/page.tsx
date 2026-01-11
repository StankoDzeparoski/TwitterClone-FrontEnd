import Link from 'next/link';
import { apiFetchServer } from './lib/api.server';
import CreatePost from './ui/CreatePost';
import PostCard from './ui/PostCard';
import FeedToggle from './ui/FeedToggle';

type FeedItem = {
  id: string;
  authorId: string;
  content: string;
  createdAt: string;
  retweetOfId: string | null;
  likeCount: number;
  imageKeys: string[];
  imageUrls: string[];
  commentCount?: number;
};

type FeedRes = { items: FeedItem[]; nextCursor: string | null };
type MeRes = { user: { id: string } | null };
type PublicUserRes = { user: { usersFollowingIds?: string[] } | null };

async function safeMe() {
  try {
    const res = await apiFetchServer<MeRes>('/auth/me', { cache: 'no-store' });
    return res?.user ?? null;
  } catch {
    return null;
  }
}

export default async function FeedPage() {
  const me = await safeMe();
  const isLoggedIn = !!me?.id;

  const feed = await apiFetchServer<FeedRes>('/posts/feed?limit=50', { cache: 'no-store' });

  let followingIds: string[] = [];
  if (isLoggedIn) {
    try {
      const u = await apiFetchServer<PublicUserRes>(`/users/${me!.id}`, { cache: 'no-store' });
      followingIds = u?.user?.usersFollowingIds ?? [];
    } catch {
      followingIds = [];
    }
  }

  const followingSet = new Set(followingIds);
  const followingFeed = isLoggedIn ? feed.items.filter((p) => followingSet.has(p.authorId)) : [];
  const discoverFeed = isLoggedIn ? feed.items.filter((p) => !followingSet.has(p.authorId)) : feed.items;

  return (
    <main className="mx-auto max-w-2xl px-4 py-6">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl dark:text-zinc-400">Feed</h1>
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            {feed.items.length} posts
          </p>
        </div>
      </div>

      {/* Composer / Guest banner */}
      {isLoggedIn ? (
        // <div className="rounded-2xl border border-border bg-card p-3 text-card-fg shadow-sm">
          <CreatePost />
        // </div>
      ) : (
        <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
           <p className="text-sm text-zinc-700 dark:text-zinc-300">
             You’re browsing as a guest.{' '} 
             <Link className="underline underline-offset-4 hover:text-zinc-900 dark:hover:text-zinc-100" href="/auth/login">
                Login</Link>{' '} to post, like, and repost. 
            </p> 
        </div>
      )}

      {/* Feed */}
      {isLoggedIn ? (
        <div className="mt-6">
          <FeedToggle followingFeed={followingFeed} discoverFeed={discoverFeed} isLoggedIn={true} />
        </div>
      ) : (
        <div className="mt-6 grid gap-4">
          {discoverFeed.map((p) => (
            <PostCard key={p.id} post={p} isLoggedIn={false} />
          ))}
        </div>
      )}
    </main>
  );
}


// import Link from 'next/link';
// import { apiFetchServer } from './lib/api.server';
// import CreatePost from './ui/CreatePost';
// import PostCard from './ui/PostCard';
// import FeedToggle from './ui/FeedToggle';

// type FeedItem = {
//   id: string;
//   authorId: string;
//   content: string;
//   createdAt: string;
//   retweetOfId: string | null;
//   likeCount: number;
//   imageKeys: string[];
//   imageUrls: string[];
// };

// type FeedRes = { items: FeedItem[]; nextCursor: string | null };
// type MeRes = { user: { id: string } | null };
// type PublicUserRes = { user: { usersFollowingIds?: string[] } | null };

// async function safeMe() {
//   try {
//     const res = await apiFetchServer<MeRes>('/auth/me', { cache: 'no-store' });
//     return res?.user ?? null;
//   } catch {
//     return null;
//   }
// }

// export default async function FeedPage() {
//   const me = await safeMe();
//   const isLoggedIn = !!me?.id;

//   const feed = await apiFetchServer<FeedRes>('/posts/feed?limit=50', { cache: 'no-store' });

//   let followingIds: string[] = [];
//   if (isLoggedIn) {
//     try {
//       const u = await apiFetchServer<PublicUserRes>(`/users/${me!.id}`, { cache: 'no-store' });
//       followingIds = u?.user?.usersFollowingIds ?? [];
//     } catch {
//       followingIds = [];
//     }
//   }

//   const followingSet = new Set(followingIds);
//   const followingFeed = isLoggedIn ? feed.items.filter((p) => followingSet.has(p.authorId)) : [];
//   const discoverFeed = isLoggedIn
//     ? feed.items.filter((p) => !followingSet.has(p.authorId))
//     : feed.items;

//   return (
//     <main className="mx-auto max-w-2xl px-4 py-6">
//       <div className="mb-4 flex items-center justify-between">
//         <h1 className="text-xl font-semibold text-zinc-900">Feed</h1>
//         <span className="text-sm text-zinc-500">{feed.items.length} posts</span>
//       </div>

//       {isLoggedIn ? (
//         <CreatePost />
//       ) : (
//         <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
//           <p className="text-sm text-zinc-700">
//             You’re browsing as a guest.{' '}
//             <Link className="underline" href="/auth/login">
//               Login
//             </Link>{' '}
//             to post, like, and repost.
//           </p>
//         </div>
//       )}

//       {isLoggedIn ? (
//         <FeedToggle followingFeed={followingFeed} discoverFeed={discoverFeed} isLoggedIn={true} />
//       ) : (
//         <div className="mt-6 grid gap-4">
//           {discoverFeed.map((p) => (
//             <PostCard key={p.id} post={p} isLoggedIn={false} />
//           ))}
//         </div>
//       )}
//     </main>
//   );
// }