"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Logo from "./Logo";

const links = [
  { href: "/", label: "Dashboard" },
  { href: "/companies", label: "Companies" },
  { href: "/blog", label: "Blog" },
];

export default function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <nav className="bg-surface border-b border-surface-border px-5 md:px-8 sticky top-0 z-50">
      <div className="flex items-center justify-between h-14">
        {/* Logo */}
        <Link href="/" className="no-underline" onClick={() => setOpen(false)}>
          <Logo size="md" />
        </Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex gap-7">
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

        {/* Desktop about button */}
        <Link
          href="/about"
          className="hidden md:block bg-cc-green text-white text-xs font-sans font-semibold uppercase tracking-wider px-4 py-2 rounded no-underline hover:bg-cc-green-dark transition-colors"
        >
          About
        </Link>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          <span className={`block w-5 h-0.5 bg-ink transition-all ${open ? "rotate-45 translate-y-2" : ""}`} />
          <span className={`block w-5 h-0.5 bg-ink transition-all ${open ? "opacity-0" : ""}`} />
          <span className={`block w-5 h-0.5 bg-ink transition-all ${open ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>
      </div>

      {/* Mobile menu dropdown */}
      {open && (
        <div className="md:hidden border-t border-surface-border py-4 flex flex-col gap-3">
          {links.map(({ href, label }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className={`text-sm font-sans font-semibold no-underline py-1 ${
                  active ? "text-ink" : "text-ink-muted"
                }`}
              >
                {label}
              </Link>
            );
          })}
          <Link
            href="/about"
            onClick={() => setOpen(false)}
            className="text-sm font-sans font-semibold no-underline py-1 text-ink-muted"
          >
            About
          </Link>
        </div>
      )}
    </nav>
  );
}
