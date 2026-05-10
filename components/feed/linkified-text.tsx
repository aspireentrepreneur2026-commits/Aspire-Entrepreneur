"use client";

import type { ReactNode } from "react";

/** Renders plain text with http(s) URLs turned into external links (safe for user content). */
export function LinkifiedText({ text }: { text: string }) {
  const nodes: ReactNode[] = [];
  const re = /https?:\/\/[^\s<]+[^<.,:;"')\]\s]/gi;
  let last = 0;
  const s = String(text);
  const matches = [...s.matchAll(re)];
  for (const m of matches) {
    const index = m.index ?? 0;
    if (index > last) {
      nodes.push(<span key={`t-${last}`}>{s.slice(last, index)}</span>);
    }
    const url = m[0];
    nodes.push(
      <a
        key={`u-${index}`}
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="break-all text-indigo-600 underline decoration-indigo-400/80 underline-offset-2 hover:text-indigo-800"
      >
        {url}
      </a>,
    );
    last = index + url.length;
  }
  if (last < s.length) {
    nodes.push(<span key={`t-${last}`}>{s.slice(last)}</span>);
  }
  return <span className="whitespace-pre-wrap break-words">{nodes}</span>;
}
