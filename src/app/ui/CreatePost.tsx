'use client';

import { useMemo, useState } from 'react';
import { apiFetch } from '../lib/api.client';
import { useRouter } from 'next/navigation';

type UploadRes = { key: string; uploadUrl: string; expiresIn?: number };

export default function CreatePost() {
  const [content, setContent] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const router = useRouter();

  const previewUrl = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);

  async function uploadImageIfNeeded(): Promise<string | undefined> {
    if (!file) return undefined;

    const up = await apiFetch<UploadRes>('/api/uploads/posts/image', {
      method: 'POST',
      body: JSON.stringify({ contentType: file.type }),
    });

    const putRes = await fetch(up.uploadUrl, {
      method: 'PUT',
      headers: { 'Content-Type': file.type },
      body: file,
    });

    if (!putRes.ok) {
      const t = await putRes.text().catch(() => '');
      throw new Error(t || 'Failed to upload image to S3');
    }

    return up.key;
  }

  async function submit() {
    setErr(null);
    setBusy(true);

    try {
      const imageKey = await uploadImageIfNeeded();

      await apiFetch('/api/posts/create', {
        method: 'POST',
        body: JSON.stringify({
          content: content.trim() || undefined,
          imageKey: imageKey ?? undefined,
        }),
      });

      setContent('');
      setFile(null);
      router.refresh();
    } catch (e: any) {
      setErr(e?.message ?? 'Failed to post');
    } finally {
      setBusy(false);
    }
  }

  const canPost = (!!content.trim() || !!file) && !busy;

  return (
    <section className="rounded-2xl border border-border bg-card p-4 text-card-fg shadow-sm">
      <div className="flex items-start gap-3">
        <div className="h-10 w-10 shrink-0 rounded-full bg-muted" />

        <div className="w-full">
          <textarea
            placeholder="What's happening?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={3}
            className="w-full resize-none rounded-xl border border-border bg-bg px-3 py-2 text-sm text-fg outline-none placeholder:text-muted-fg focus:border-border focus:ring-2 focus:ring-ring/30"
          />

          {previewUrl ? (
            <div className="mt-3 overflow-hidden rounded-xl border border-border">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={previewUrl} alt="preview" className="max-h-80 w-full object-cover" />
            </div>
          ) : null}

          {err ? (
            <div className="mt-2 rounded-xl border border-border bg-muted px-3 py-2 text-sm text-fg">
              {err}
            </div>
          ) : null}

          <div className="mt-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 text-sm text-fg shadow-sm hover:bg-muted">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                />
                <span className="font-medium">{file ? 'Change image' : 'Add image'}</span>
              </label>

              {file ? (
                <button
                  type="button"
                  onClick={() => setFile(null)}
                  className="text-sm text-muted-fg hover:text-fg"
                >
                  Remove
                </button>
              ) : null}
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs text-muted-fg">{content.length}/280</span>
              <button
                disabled={!canPost}
                onClick={submit}
                className="rounded-xl bg-fg px-4 py-2 text-sm font-medium text-bg shadow-sm hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {busy ? 'Posting…' : 'Post'}
              </button>
            </div>
          </div>

          <p className="mt-2 text-xs text-muted-fg">Tip: you can post text, an image, or both.</p>
        </div>
      </div>
    </section>
  );
}
