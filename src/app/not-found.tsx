import Link from "next/link";

export default function NotFound() {
  return (
    <div className="px-5 md:px-8 py-24 max-w-2xl mx-auto text-center">
      <div className="text-tag font-sans font-bold uppercase tracking-widest text-cc-green mb-4">
        404
      </div>
      <h1 className="text-3xl md:text-4xl font-serif font-extrabold text-ink tracking-tight mb-4">
        Page not found
      </h1>
      <p className="text-sm font-sans text-ink-muted leading-relaxed mb-8 max-w-sm mx-auto">
        This page doesn't exist. The company you're looking for might have moved, or the URL might be wrong.
      </p>
      <div className="flex items-center justify-center gap-4">
        <Link
          href="/"
          className="bg-cc-green text-white text-xs font-sans font-semibold uppercase tracking-wider px-5 py-2.5 rounded no-underline hover:bg-cc-green-dark transition-colors"
        >
          Back to dashboard
        </Link>
        <Link
          href="/companies"
          className="text-xs font-sans font-semibold uppercase tracking-wider text-ink-muted hover:text-ink no-underline transition-colors"
        >
          Browse companies →
        </Link>
      </div>
    </div>
  );
}
