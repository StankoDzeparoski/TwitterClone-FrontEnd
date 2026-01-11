import Link from 'next/link';
import LikeButton from './post/LikeButton';
import RetweetButton from './post/RetweetButton';
import PostCommentsToggle from './comment/PostCommentsToggle';

export default function PostCard({ post, isLoggedIn }: { post: any; isLoggedIn: boolean }) {
  return (
    <article className="rounded-2xl border border-border bg-card p-4 text-card-fg shadow-sm">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 shrink-0 rounded-full bg-muted" />
          <div className="flex flex-col">
            <Link
              href={`/profile/${post.authorId}`}
              className="text-sm font-semibold text-fg hover:underline"
            >
              @{post.authorId}
            </Link>
            <time className="text-xs text-muted-fg" dateTime={post.createdAt}>
              {new Date(post.createdAt).toLocaleString()}
            </time>
          </div>
        </div>

        {post.retweetOfId ? (
          <span className="rounded-full border border-border bg-muted px-2 py-1 text-xs text-muted-fg">
            Repost
          </span>
        ) : null}
      </div>

      {post.retweetOfId ? (
        <div className="mt-2 text-xs text-muted-fg">
          Repost of{' '}
          <code className="rounded bg-muted px-1 py-0.5 text-fg">{post.retweetOfId}</code>
        </div>
      ) : null}

      {/* Content */}
      {post.content ? (
        <p className="mt-3 whitespace-pre-wrap text-sm text-fg">{post.content}</p>
      ) : null}

      {/* Images */}
      {post.imageUrls?.length ? (
        <div className="mt-3 grid gap-2">
          {post.imageUrls.map((url: string, idx: number) => (
            <div key={idx} className="overflow-hidden rounded-xl border border-border">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt={`post image ${idx + 1}`} className="max-h-96 w-full object-cover" />
            </div>
          ))}
        </div>
      ) : null}

      {/* Actions */}
      <div className="mt-4 flex items-center gap-3">
        <LikeButton postId={post.id} isLoggedIn={isLoggedIn} />
        <RetweetButton postId={post.id} isLoggedIn={isLoggedIn} />

        <div className="ml-auto flex items-center gap-3 text-xs text-muted-fg">
          <span>
            Likes: <span className="font-medium text-fg">{post.likeCount ?? 0}</span>
          </span>
          <span className="hidden sm:inline">
            Comments: <span className="font-medium text-fg">{post.commentCount ?? 0}</span>
          </span>
        </div>
      </div>

      {/* Comments toggle */}
      <div className="mt-3 border-t border-border pt-3">
        <PostCommentsToggle postId={post.id} isLoggedIn={isLoggedIn} initialCount={post.commentCount ?? 0} />
      </div>
    </article>
  );
}