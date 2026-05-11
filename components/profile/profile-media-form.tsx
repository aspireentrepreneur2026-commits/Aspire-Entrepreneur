"use client";

import { upload } from "@vercel/blob/client";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { saveProfileMediaAction, type ProfileActionState } from "@/app/actions/profile";
import { publicUserMediaUrl } from "@/lib/profile-media-url";

type Caps = { mode: "blob" | "multipart" | "disabled"; multipartMaxMb: number };

export function ProfileMediaForm({
  initialAvatarUrl,
  initialCoverUrl,
}: {
  initialAvatarUrl: string | null;
  initialCoverUrl: string | null;
}) {
  const router = useRouter();
  const [caps, setCaps] = useState<Caps | null>(null);
  const [avatarUrl, setAvatarUrl] = useState(initialAvatarUrl);
  const [coverUrl, setCoverUrl] = useState(initialCoverUrl);
  const [busy, setBusy] = useState(false);
  const [hint, setHint] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [saveMsg, setSaveMsg] = useState<ProfileActionState | null>(null);

  useEffect(() => {
    fetch("/api/feed/upload-capabilities", { cache: "no-store" })
      .then((r) => r.json())
      .then((d: Caps) => setCaps(d))
      .catch(() => setCaps({ mode: "multipart", multipartMaxMb: 15 }));
  }, []);

  useEffect(() => {
    setAvatarUrl(initialAvatarUrl);
    setCoverUrl(initialCoverUrl);
  }, [initialAvatarUrl, initialCoverUrl]);

  const uploadOne = async (file: File, slot: "avatar" | "cover") => {
    setHint(null);
    if (!caps) {
      setHint("Still loading upload settings…");
      return;
    }
    if (caps.mode === "disabled") {
      setHint("Uploads need BLOB_READ_WRITE_TOKEN on Vercel, or use local dev.");
      return;
    }

    const maxMb = caps.mode === "blob" ? 25 : caps.multipartMaxMb || 15;
    if (file.size > maxMb * 1024 * 1024) {
      setHint(`Image too large (max ~${maxMb}MB for this setup).`);
      return;
    }

    setBusy(true);
    try {
      let url: string;
      if (caps.mode === "blob") {
        const safe = file.name.replace(/[^\w.\-()+ ]/g, "_");
        const res = await upload(`profile/${slot}/${Date.now()}-${safe}`, file, {
          access: "public",
          handleUploadUrl: "/api/feed/blob-token",
        });
        url = res.url;
      } else {
        const fd = new FormData();
        fd.append("file", file);
        const res = await fetch("/api/profile/upload-local", { method: "POST", body: fd, credentials: "same-origin" });
        const data = (await res.json()) as { url?: string; error?: string };
        if (!res.ok || !data.url) {
          setHint(data.error ?? "Upload failed.");
          return;
        }
        url = data.url;
      }

      const form = new FormData();
      if (slot === "avatar") {
        form.set("profileImageUrl", url);
        if (coverUrl) form.set("coverImageUrl", coverUrl);
      } else {
        form.set("coverImageUrl", url);
        if (avatarUrl) form.set("profileImageUrl", avatarUrl);
      }

      startTransition(async () => {
        const out = await saveProfileMediaAction(undefined, form);
        setSaveMsg(out);
        if (!out.error) {
          if (slot === "avatar") setAvatarUrl(url);
          else setCoverUrl(url);
          router.refresh();
        }
      });
    } catch (e) {
      setHint(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setBusy(false);
    }
  };

  const avatarDisplay = publicUserMediaUrl(avatarUrl);
  const coverDisplay = publicUserMediaUrl(coverUrl);

  return (
    <div className="rounded-2xl border border-indigo-100 bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.06)]">
      <h2 className="text-lg font-semibold text-slate-900">Profile & cover photos</h2>
      <p className="mt-1 text-sm text-slate-600">
        Like LinkedIn or Facebook — a square avatar and a wide cover behind it on your member profile.
      </p>

      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        <div className="space-y-3">
          <p className="text-sm font-medium text-slate-700">Profile photo</p>
          <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-2 border-slate-200 bg-slate-100 text-2xl font-bold text-slate-500">
            {avatarDisplay ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={avatarDisplay} alt="" className="h-full w-full object-cover" />
            ) : (
              "?"
            )}
          </div>
          <label className="inline-block cursor-pointer rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50">
            <input
              type="file"
              accept="image/jpeg,image/png,image/gif,image/webp"
              className="sr-only"
              disabled={busy || pending}
              onChange={(e) => {
                const f = e.target.files?.[0];
                e.target.value = "";
                if (f) void uploadOne(f, "avatar");
              }}
            />
            {busy || pending ? "Saving…" : "Upload photo"}
          </label>
        </div>

        <div className="space-y-3">
          <p className="text-sm font-medium text-slate-700">Cover image</p>
          <div className="flex h-20 w-full max-w-sm items-center justify-center overflow-hidden rounded-lg border-2 border-slate-200 bg-slate-100 text-slate-400">
            {coverDisplay ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={coverDisplay} alt="" className="h-full w-full object-cover" />
            ) : (
              <span className="text-xs">Wide banner (optional)</span>
            )}
          </div>
          <label className="inline-block cursor-pointer rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50">
            <input
              type="file"
              accept="image/jpeg,image/png,image/gif,image/webp"
              className="sr-only"
              disabled={busy || pending}
              onChange={(e) => {
                const f = e.target.files?.[0];
                e.target.value = "";
                if (f) void uploadOne(f, "cover");
              }}
            />
            {busy || pending ? "Saving…" : "Upload cover"}
          </label>
        </div>
      </div>

      {hint ? <p className="mt-4 text-sm text-amber-800">{hint}</p> : null}
      {saveMsg?.error ? <p className="mt-2 text-sm text-red-600">{saveMsg.error}</p> : null}
      {saveMsg?.success ? <p className="mt-2 text-sm text-green-700">{saveMsg.success}</p> : null}
    </div>
  );
}
