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

    // POST /uploads/posts/image  body: { contentType }
    // const up = await apiFetch<UploadRes>('/uploads/posts/image', {
    const up = await apiFetch<UploadRes>('/api/uploads/posts/image', {
      method: 'POST',
      body: JSON.stringify({ contentType: file.type }),
    });

    // PUT to S3 presigned url
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

      // await apiFetch('/posts', {
      await apiFetch('/api/posts/create', {
        method: 'POST',
        body: JSON.stringify({
          content: content.trim() || undefined,
          // ✅ backend expects imageKey (or imageKeys)
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
    <section className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="h-10 w-10 shrink-0 rounded-full bg-zinc-200" />
        <div className="w-full">
          <textarea
            placeholder="What's happening?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={3}
            className="w-full resize-none rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none placeholder:text-zinc-400 focus:border-zinc-400"
          />

          {previewUrl ? (
            <div className="mt-3 overflow-hidden rounded-xl border border-zinc-200">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={previewUrl} alt="preview" className="max-h-80 w-full object-cover" />
            </div>
          ) : null}

          {err ? (
            <div className="mt-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {err}
            </div>
          ) : null}

          <div className="mt-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-700 shadow-sm hover:bg-zinc-50">
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
                  className="text-sm text-zinc-500 hover:text-zinc-700"
                >
                  Remove
                </button>
              ) : null}
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs text-zinc-500">{content.length}/280</span>
              <button
                disabled={!canPost}
                onClick={submit}
                className="rounded-xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-black disabled:cursor-not-allowed disabled:opacity-50"
              >
                {busy ? 'Posting…' : 'Post'}
              </button>
            </div>
          </div>

          <p className="mt-2 text-xs text-zinc-400">Tip: you can post text, an image, or both.</p>
        </div>
      </div>
    </section>
  );
}
