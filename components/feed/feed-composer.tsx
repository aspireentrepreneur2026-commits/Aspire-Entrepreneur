"use client";

import { upload } from "@vercel/blob/client";
import { useActionState, useEffect, useRef, useState } from "react";
import { createFeedPost, type FeedActionState } from "@/app/actions/feed";
import { inferFeedAttachmentKind } from "@/lib/feed-attachment";

const initial: FeedActionState | undefined = undefined;

type UploadCaps = { blob: boolean; multipartMaxMb: number; mode: "blob" | "multipart" };

type Chip = {
  id: string;
  url: string;
  label: string;
  /** Set for device uploads so videos without obvious URL extensions still render as video. */
  mediaKind?: "IMAGE" | "VIDEO";
};

function isValidHttpUrl(raw: string) {
  try {
    const u = new URL(raw.trim());
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

export function FeedComposer({ publisherName = "You" }: { publisherName?: string }) {
  const [state, action, pending] = useActionState(createFeedPost, initial);
  const [caps, setCaps] = useState<UploadCaps | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [urlPanelOpen, setUrlPanelOpen] = useState(false);
  const [bulkOpen, setBulkOpen] = useState(false);
  const [urlDraft, setUrlDraft] = useState("");
  const [bulkText, setBulkText] = useState("");
  const [chips, setChips] = useState<Chip[]>([]);
  const [uploading, setUploading] = useState(false);
  const [clientMsg, setClientMsg] = useState<string | null>(null);

  const formRef = useRef<HTMLFormElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/feed/upload-capabilities")
      .then((r) => r.json())
      .then((d: UploadCaps) => setCaps(d))
      .catch(() => setCaps({ blob: false, multipartMaxMb: 4, mode: "multipart" }));
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onDown = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [menuOpen]);

  useEffect(() => {
    if (!state?.success) return;
    setTimeout(() => {
      formRef.current?.reset();
      setChips([]);
      setUrlDraft("");
      setBulkText("");
      setClientMsg(null);
      setUrlPanelOpen(false);
      setBulkOpen(false);
      setMenuOpen(false);
    }, 0);
  }, [state?.success]);

  const attachmentsJson = JSON.stringify(
    chips.map((c) => ({
      url: c.url,
      ...(c.mediaKind ? { kind: c.mediaKind } : {}),
    })),
  );

  const addChip = (url: string, label: string, mediaKind?: "IMAGE" | "VIDEO") => {
    const u = url.trim();
    if (!u) return;
    setChips((prev) => {
      if (prev.some((c) => c.url === u) || prev.length >= 10) return prev;
      return [...prev, { id: crypto.randomUUID(), url: u, label, mediaKind }];
    });
  };

  const removeChip = (id: string) => {
    setChips((prev) => prev.filter((c) => c.id !== id));
  };

  const handleDeviceFile = async (file: File, kind: "IMAGE" | "VIDEO") => {
    setClientMsg(null);
    const maxMb = caps?.multipartMaxMb ?? 80;

    if (caps?.mode === "blob") {
      setUploading(true);
      try {
        const safeName = file.name.replace(/[^\w.\-()+ ]/g, "_");
        const result = await upload(`feed/${kind}/${Date.now()}-${safeName}`, file, {
          access: "public",
          handleUploadUrl: "/api/feed/blob-token",
        });
        addChip(result.url, file.name, kind);
        setClientMsg("File attached.");
      } catch (e) {
        setClientMsg(e instanceof Error ? e.message : "Upload failed.");
      } finally {
        setUploading(false);
      }
      return;
    }

    if (file.size > maxMb * 1024 * 1024) {
      setClientMsg(
        `File too large for this setup (max ${maxMb}MB). Add Vercel Blob (BLOB_READ_WRITE_TOKEN) for larger uploads.`,
      );
      return;
    }

    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/feed/upload-local", { method: "POST", body: fd });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok) {
        setClientMsg(data.error ?? "Upload failed.");
        return;
      }
      if (data.url) {
        addChip(data.url, file.name, kind);
        setClientMsg("File attached.");
      }
    } catch {
      setClientMsg("Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const submitSingleUrl = () => {
    const u = urlDraft.trim();
    if (!u) return;
    if (!isValidHttpUrl(u)) {
      setClientMsg("Enter a valid URL (https://…).");
      return;
    }
    const hint = inferFeedAttachmentKind(u);
    const labelPrefix = hint === "IMAGE" ? "Image link" : hint === "VIDEO" ? "Video link" : "Link";
    addChip(u, `${labelPrefix}: ${u.length > 40 ? `${u.slice(0, 40)}…` : u}`);
    setUrlDraft("");
    setClientMsg(null);
  };

  const submitBulkUrls = () => {
    const lines = bulkText
      .split(/\r?\n/)
      .map((s) => s.trim())
      .filter(Boolean);
    for (const line of lines) {
      if (!isValidHttpUrl(line)) {
        setClientMsg("Each line must be a full http(s) URL.");
        return;
      }
    }

    let added = 0;
    setChips((prev) => {
      const next = [...prev];
      for (const line of lines) {
        if (next.length >= 10) break;
        const t = line.trim();
        if (next.some((c) => c.url === t)) continue;
        const hint = inferFeedAttachmentKind(t);
        const labelPrefix = hint === "IMAGE" ? "Image link" : hint === "VIDEO" ? "Video link" : "Link";
        next.push({
          id: crypto.randomUUID(),
          url: t,
          label: `${labelPrefix}: ${t.length > 36 ? `${t.slice(0, 36)}…` : t}`,
        });
        added += 1;
      }
      return next;
    });

    setBulkText("");
    setClientMsg(added ? `Added ${added} URL(s).` : "No new URLs added (duplicates skipped or limit reached).");
  };

  const busy = pending || uploading;
  const initialLetter = publisherName.trim().charAt(0).toUpperCase() || "Y";

  return (
    <form
      ref={formRef}
      action={action}
      className="relative z-10 rounded-lg border border-slate-200/90 bg-white shadow-sm"
    >
      <div className="flex gap-3 border-b border-slate-100 p-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#0a66c2] to-[#004182] text-lg font-semibold text-white shadow-inner">
          {initialLetter}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[15px] font-semibold leading-tight text-slate-900">Start a post</p>
          <p className="mt-0.5 text-xs text-slate-500">
            Post as <span className="font-medium text-slate-700">{publisherName}</span> · Visible to members
          </p>
        </div>
      </div>

      <div className="space-y-3 px-4 pt-4">
        {state?.error ? <p className="text-sm text-red-600">{state.error}</p> : null}
        {state?.success ? <p className="text-sm text-green-700">{state.success}</p> : null}
        {clientMsg ? <p className="text-sm text-[#0a66c2]">{clientMsg}</p> : null}

        <textarea
          name="body"
          required
          rows={5}
          maxLength={8000}
          placeholder={`What do you want to talk about, ${publisherName.split(" ")[0] ?? "there"}?`}
          className="w-full resize-y rounded-lg border-0 bg-white px-2 py-2 text-[15px] leading-relaxed text-slate-900 outline-none ring-0 placeholder:text-slate-400 focus:placeholder:text-slate-300"
        />

        <input type="hidden" name="attachmentsJson" value={attachmentsJson} />
      </div>

      {chips.length > 0 ? (
        <div className="flex flex-wrap gap-2 px-4 pb-2">
          {chips.map((c) => (
            <span
              key={c.id}
              className="inline-flex max-w-full items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-800"
            >
              <span className="truncate" title={c.url}>
                {c.mediaKind === "IMAGE"
                  ? "📷 "
                  : c.mediaKind === "VIDEO"
                    ? "🎬 "
                    : inferFeedAttachmentKind(c.url) === "VIDEO"
                      ? "🎬 "
                      : inferFeedAttachmentKind(c.url) === "IMAGE"
                        ? "📷 "
                        : "🔗 "}
                {c.label}
              </span>
              <button
                type="button"
                onClick={() => removeChip(c.id)}
                className="shrink-0 text-slate-500 hover:text-red-600"
                aria-label={`Remove ${c.label}`}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      ) : null}

      {(urlPanelOpen || bulkOpen) && (
        <div className="mx-4 space-y-3 rounded-lg border border-[#0a66c2]/15 bg-[#e8f3fc] p-4">
          {urlPanelOpen && !bulkOpen ? (
            <div className="flex flex-wrap gap-2">
              <input
                type="url"
                value={urlDraft}
                onChange={(e) => setUrlDraft(e.target.value)}
                placeholder="https://…"
                className="min-w-[200px] flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20"
              />
              <button
                type="button"
                onClick={submitSingleUrl}
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
              >
                Add link
              </button>
            </div>
          ) : null}
          {bulkOpen ? (
            <div className="space-y-2">
              <p className="text-xs font-medium text-slate-600">Paste one URL per line</p>
              <textarea
                value={bulkText}
                onChange={(e) => setBulkText(e.target.value)}
                placeholder={"https://…\nhttps://…"}
                rows={4}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 font-mono text-xs outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20"
              />
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={submitBulkUrls}
                  className="rounded-lg border border-indigo-200 bg-white px-4 py-2 text-xs font-medium text-indigo-800 hover:bg-indigo-50"
                >
                  Add all lines
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setBulkOpen(false);
                    setUrlPanelOpen(false);
                  }}
                  className="rounded-lg px-4 py-2 text-xs text-slate-600 hover:bg-white/80"
                >
                  Close
                </button>
              </div>
            </div>
          ) : null}
          {!bulkOpen && urlPanelOpen ? (
            <button
              type="button"
              className="text-xs text-indigo-700 underline underline-offset-2 hover:text-indigo-900"
              onClick={() => setBulkOpen(true)}
            >
              Paste several URLs instead
            </button>
          ) : null}
          {!bulkOpen && urlPanelOpen ? (
            <button
              type="button"
              className="block text-xs text-slate-600 underline-offset-2 hover:underline"
              onClick={() => {
                setUrlPanelOpen(false);
              }}
            >
              Close
            </button>
          ) : null}
        </div>
      )}

      <p className="px-4 pb-2 text-[11px] text-slate-500">
        <strong className="font-medium text-slate-600">+</strong> Add photos, videos, or links · Emoji & https links
        supported
        {caps?.blob
          ? " · Large files use Vercel Blob."
          : caps
            ? ` · Max ~${caps.multipartMaxMb}MB per upload here.`
            : null}
      </p>

      <div className="relative z-20 flex flex-wrap items-center justify-between gap-3 overflow-visible border-t border-slate-100 bg-slate-50/70 px-4 py-3">
      <input
        ref={imageInputRef}
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          e.target.value = "";
          if (f) void handleDeviceFile(f, "IMAGE");
        }}
      />
      <input
        ref={videoInputRef}
        type="file"
        accept="video/mp4,video/webm,video/quicktime"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          e.target.value = "";
          if (f) void handleDeviceFile(f, "VIDEO");
        }}
      />

        <div className="relative flex flex-1 items-center gap-2 sm:flex-initial" ref={menuRef}>
          <button
            type="button"
            disabled={busy}
            onClick={() => {
              setMenuOpen((o) => !o);
            }}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-300 bg-white text-xl font-light text-slate-700 shadow-sm hover:border-indigo-400 hover:bg-indigo-50 disabled:opacity-50"
            aria-expanded={menuOpen}
            aria-haspopup="true"
            title="Add to post"
          >
            +
          </button>
          {menuOpen ? (
            <div className="absolute bottom-full left-0 z-[100] mb-2 w-60 rounded-xl border border-slate-200 bg-white py-1 text-sm shadow-xl">
              <button
                type="button"
                className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-slate-800 hover:bg-slate-50"
                onClick={() => {
                  setMenuOpen(false);
                  imageInputRef.current?.click();
                }}
              >
                <span aria-hidden>📷</span> Upload photo
              </button>
              <button
                type="button"
                className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-slate-800 hover:bg-slate-50"
                onClick={() => {
                  setMenuOpen(false);
                  videoInputRef.current?.click();
                }}
              >
                <span aria-hidden>🎬</span> Upload video
              </button>
              <button
                type="button"
                className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-slate-800 hover:bg-slate-50"
                onClick={() => {
                  setMenuOpen(false);
                  setUrlPanelOpen(true);
                  setBulkOpen(false);
                }}
              >
                <span aria-hidden>🔗</span> Link / URL
              </button>
              <button
                type="button"
                className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-slate-800 hover:bg-slate-50"
                onClick={() => {
                  setMenuOpen(false);
                  setUrlPanelOpen(true);
                  setBulkOpen(true);
                }}
              >
                <span aria-hidden>📋</span> Multiple URLs
              </button>
            </div>
          ) : null}
          <span className="hidden text-xs text-slate-500 xl:inline">Attach</span>
        </div>

        <button
          type="submit"
          disabled={busy}
          className="rounded-full bg-[#0a66c2] px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#004182] disabled:opacity-60"
        >
          {pending ? "Posting…" : uploading ? "Uploading…" : "Post"}
        </button>
      </div>
    </form>
  );
}
