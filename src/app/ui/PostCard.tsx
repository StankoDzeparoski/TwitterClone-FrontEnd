import Link from 'next/link';
import LikeButton from './post/LikeButton';
import RetweetButton from './post/RetweetButton';

export default function PostCard({ post, isLoggedIn }: { post: any; isLoggedIn: boolean }) {
  return (
    <article className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 shrink-0 rounded-full bg-zinc-200" />
          <div className="flex flex-col">
            <Link
              href={`/profile/${post.authorId}`}
              className="text-sm font-semibold text-zinc-900 hover:underline"
            >
              @{post.authorId}
            </Link>
            <time className="text-xs text-zinc-500" dateTime={post.createdAt}>
              {new Date(post.createdAt).toLocaleString()}
            </time>
          </div>
        </div>

        {post.retweetOfId ? (
          <span className="rounded-full border border-zinc-200 bg-zinc-50 px-2 py-1 text-xs text-zinc-600">
            Repost
          </span>
        ) : null}
      </div>

      {post.retweetOfId ? (
        <div className="mt-2 text-xs text-zinc-500">
          Repost of <code className="rounded bg-zinc-100 px-1 py-0.5">{post.retweetOfId}</code>
        </div>
      ) : null}

      {post.content ? (
        <p className="mt-3 whitespace-pre-wrap text-sm text-zinc-800">{post.content}</p>
      ) : null}

      {post.imageUrls?.length ? (
        <div className="mt-3 grid gap-2">
          {post.imageUrls.map((url: string, idx: number) => (
            <div key={idx} className="overflow-hidden rounded-xl border border-zinc-200">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt={`post image ${idx + 1}`} className="max-h-96 w-full object-cover" />
            </div>
          ))}
        </div>
      ) : null}

      <div className="mt-4 flex items-center gap-3">
        <LikeButton postId={post.id} isLoggedIn={isLoggedIn} />
        <RetweetButton postId={post.id} isLoggedIn={isLoggedIn} />

        <span className="ml-auto text-xs text-zinc-500">
          Likes: <span className="font-medium text-zinc-800">{post.likeCount ?? 0}</span>
        </span>
      </div>
    </article>
  );
}
