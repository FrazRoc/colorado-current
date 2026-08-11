import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-surface-border bg-surface-dash px-5 md:px-8 py-10 mt-16">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start justify-between gap-8">
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <span className="text-base font-serif font-extrabold text-ink">Colorado Current</span>
            <span className="w-1.5 h-1.5 rounded-full bg-cc-green inline-block" />
          </div>
          <p className="text-xs font-sans text-ink-muted max-w-xs leading-relaxed">
            Independent analysis of Colorado's clean energy startup ecosystem.
          </p>
        </div>

        <div className="flex gap-12 text-xs font-sans">
          <div>
            <div className="font-semibold text-ink uppercase tracking-wider mb-3">Explore</div>
            <div className="flex flex-col gap-2 text-ink-muted">
              <Link href="/companies" className="hover:text-ink no-underline">Companies</Link>
              <Link href="/blog" className="hover:text-ink no-underline">Blog</Link>
              <Link href="/about" className="hover:text-ink no-underline">About</Link>
            </div>
          </div>
          <div>
            <div className="font-semibold text-ink uppercase tracking-wider mb-3">Connect</div>
            <div className="flex flex-col gap-2 text-ink-muted">
              <a href="https://www.linkedin.com/company/colorado-current" target="_blank" rel="noopener noreferrer" className="hover:text-ink no-underline">LinkedIn</a>
              <a href="https://github.com/FrazRoc" target="_blank" rel="noopener noreferrer" className="hover:text-ink no-underline">GitHub</a>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto mt-8 pt-6 border-t border-surface-border flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
        <p className="text-2xs font-sans text-ink-faint">
          © {new Date().getFullYear()} Colorado Current. Built by{" "}
          <a href="https://linkedin.com/in/evanfrasz" className="text-cc-green no-underline hover:underline">
            Evan Frasz
          </a>.
        </p>
        <p className="text-2xs font-sans text-ink-faint">
          Data updated monthly. Not investment advice.
        </p>
      </div>
    </footer>
  );
}
