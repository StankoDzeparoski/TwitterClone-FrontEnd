// import Link from 'next/link';
// import { apiFetchServer } from './lib/api.server';
// import CreatePost from './ui/CreatePost';
// import PostCard from './ui/PostCard';

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

// export default async function FeedPage() {
//   // 1) Detect login (server-side, using forwarded cookies from apiFetchServer)
//   let meUserId: string | null = null;

//   try {
//     const me = await apiFetchServer<MeRes>('/auth/me', { cache: 'no-store' });
//     meUserId = me?.user?.id ?? null;
//   } catch {
//     meUserId = null;
//   }

//   const isLoggedIn = !!meUserId;

//   // 2) Fetch global feed (guests allowed)
//   const feed = await apiFetchServer<FeedRes>('/posts/feed?limit=50', { cache: 'no-store' });

//   // 3) If logged in, fetch following ids
//   let followingIds: string[] = [];
//   if (isLoggedIn) {
//     try {
//       const u = await apiFetchServer<PublicUserRes>(`/users/${meUserId}`, { cache: 'no-store' });
//       followingIds = u?.user?.usersFollowingIds ?? [];
//     } catch {
//       followingIds = [];
//     }
//   }

//   const followingSet = new Set(followingIds);

//   const followingFeed = isLoggedIn
//     ? feed.items.filter((p) => followingSet.has(p.authorId))
//     : [];

//   const discoverFeed = isLoggedIn
//     ? feed.items.filter((p) => !followingSet.has(p.authorId))
//     : feed.items;

//   return (
//     <main className="mx-auto max-w-2xl px-4 py-6">
//       <div className="mb-4 flex items-center justify-between">
//         <h1 className="text-xl font-semibold text-zinc-900">Feed</h1>
//         <span className="text-sm text-zinc-500">{feed.items.length} posts</span>
//       </div>

//       {/* ✅ Hide CreatePost for guests */}
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

//       {/* ✅ Two separate feeds */}
//       {isLoggedIn ? (
//         <>
//           <section className="mt-6">
//             <div className="mb-3 flex items-center justify-between">
//               <h2 className="text-sm font-semibold text-zinc-900">Following</h2>
//               <span className="text-xs text-zinc-500">{followingFeed.length} posts</span>
//             </div>

//             {followingFeed.length ? (
//               <div className="grid gap-4">
//                 {followingFeed.map((p) => (
//                   <PostCard key={p.id} post={p} isLoggedIn={isLoggedIn} />
//                 ))}
//               </div>
//             ) : (
//               <div className="rounded-2xl border border-zinc-200 bg-white p-4 text-sm text-zinc-600 shadow-sm">
//                 No posts from people you follow yet.
//               </div>
//             )}
//           </section>

//           <section className="mt-8">
//             <div className="mb-3 flex items-center justify-between">
//               <h2 className="text-sm font-semibold text-zinc-900">Discover</h2>
//               <span className="text-xs text-zinc-500">{discoverFeed.length} posts</span>
//             </div>

//             <div className="grid gap-4">
//               {discoverFeed.map((p) => (
//                 <PostCard key={p.id} post={p} isLoggedIn={isLoggedIn} />
//               ))}
//             </div>
//           </section>
//         </>
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

import Link from 'next/link';
import { apiFetchServer } from './lib/api.server';
import CreatePost from './ui/CreatePost';
import PostCard from './ui/PostCard';

type FeedItem = {
  id: string;
  authorId: string;
  content: string;
  createdAt: string;
  retweetOfId: string | null;
  likeCount: number;
  imageKeys: string[];
  imageUrls: string[];
};

type FeedRes = { items: FeedItem[]; nextCursor: string | null };
type MeRes = { user: { id: string } | null };
type PublicUserRes = { user: { usersFollowingIds?: string[] } | null };

async function safeMe() {
  try {
    // IMPORTANT: this must work with Authorization bearer from apiFetchServer
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
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-zinc-900">Feed</h1>
        <span className="text-sm text-zinc-500">{feed.items.length} posts</span>
      </div>

      {isLoggedIn ? (
        <CreatePost />
      ) : (
        <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-zinc-700">
            You’re browsing as a guest.{' '}
            <Link className="underline" href="/auth/login">Login</Link>{' '}
            to post, like, and repost.
          </p>
        </div>
      )}

      {isLoggedIn ? (
        <>
          <section className="mt-6">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-zinc-900">Following</h2>
              <span className="text-xs text-zinc-500">{followingFeed.length} posts</span>
            </div>

            {followingFeed.length ? (
              <div className="grid gap-4">
                {followingFeed.map((p) => (
                  <PostCard key={p.id} post={p} isLoggedIn={true} />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-zinc-200 bg-white p-4 text-sm text-zinc-600 shadow-sm">
                No posts from people you follow yet.
              </div>
            )}
          </section>

          <section className="mt-8">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-zinc-900">Discover</h2>
              <span className="text-xs text-zinc-500">{discoverFeed.length} posts</span>
            </div>

            <div className="grid gap-4">
              {discoverFeed.map((p) => (
                <PostCard key={p.id} post={p} isLoggedIn={true} />
              ))}
            </div>
          </section>
        </>
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
