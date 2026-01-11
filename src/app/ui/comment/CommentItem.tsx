import Link from 'next/link';
import CommentActions from './CommentActions';

export default function CommentItem({
  c,
  isLoggedIn,
}: {
  c: any;
  isLoggedIn: boolean;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-3 text-card-fg shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 shrink-0 rounded-full bg-muted" />
          <div className="flex flex-col">
            <Link href={`/profile/${c.authorId}`} className="text-xs font-semibold text-fg hover:underline">
              @{c.authorId}
            </Link>
            <time className="text-[11px] text-muted-fg" dateTime={c.createdAt}>
              {new Date(c.createdAt).toLocaleString()}
            </time>
          </div>
        </div>

        {c.repostOfId ? (
          <span className="rounded-full border border-border bg-muted px-2 py-1 text-[11px] text-muted-fg">
            Repost
          </span>
        ) : null}
      </div>

      {c.repostOfId ? (
        <div className="mt-2 text-[11px] text-muted-fg">
          Repost of <code className="rounded bg-muted px-1 py-0.5 text-fg">{c.repostOfId}</code>
        </div>
      ) : null}

      <p className="mt-2 whitespace-pre-wrap text-sm text-fg">{c.content}</p>

      <div className="mt-3 flex items-center gap-3">
        <CommentActions commentId={c.id} isLoggedIn={isLoggedIn} />
        <span className="ml-auto text-[11px] text-muted-fg">
          Likes: <span className="font-medium text-fg">{c.likeCount ?? 0}</span>
        </span>
      </div>
    </div>
  );
}
