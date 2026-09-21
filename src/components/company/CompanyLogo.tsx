"use client";

import { useState } from "react";

interface Props {
  name: string;
  website?: string;
  className?: string;
  textClassName?: string;
}

function getDomain(website?: string): string | null {
  if (!website) return null;
  try {
    return new URL(website).hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
}

export default function CompanyLogo({ name, website, className = "w-16 h-16", textClassName = "text-2xl" }: Props) {
  const [failed, setFailed] = useState(false);
  const domain = getDomain(website);

  if (!domain || failed) {
    return (
      <div
        className={`flex-none ${className} rounded-lg border border-dashed border-surface-border bg-surface flex items-center justify-center`}
      >
        <span className={`font-serif font-bold ${textClassName} text-ink-faint`}>{name.charAt(0)}</span>
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`/api/logo?domain=${encodeURIComponent(domain)}`}
      alt={`${name} logo`}
      onError={() => setFailed(true)}
      className={`flex-none ${className} rounded-lg border border-surface-border bg-white object-contain p-1.5`}
    />
  );
}
