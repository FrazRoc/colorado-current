"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Dashboard" },
  { href: "/companies", label: "Companies" },
  { href: "/blog", label: "Blog" },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <nav className="bg-surface border-b border-surface-border px-8 flex items-center justify-between h-14 sticky top-0 z-50">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-1.5 no-underline">
        <span className="text-[19px] font-serif font-extrabold text-ink tracking-tight">
          Colorado Current
        </span>
        <span className="w-2 h-2 rounded-full bg-cc-green inline-block mb-px" />
      </Link>

      {/* Nav links */}
      <div className="flex gap-7">
        {links.map(({ href, label }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`text-xs font-sans font-semibold uppercase tracking-wider no-underline transition-colors ${
                active
                  ? "text-ink border-b-2 border-cc-green pb-px"
                  : "text-ink-muted hover:text-ink"
              }`}
            >
              {label}
            </Link>
          );
        })}
      </div>

      {/* Subscribe CTA — placeholder for future newsletter */}
      <Link
        href="/about"
        className="bg-cc-green text-white text-xs font-sans font-semibold uppercase tracking-wider px-4 py-2 rounded no-underline hover:bg-cc-green-dark transition-colors"
      >
        About
      </Link>
    </nav>
  );
}
