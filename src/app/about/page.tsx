import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "About Colorado Current — independent analysis of Colorado's clean energy ecosystem.",
};

export default function AboutPage() {
  return (
    <div className="px-8 py-12 max-w-2xl mx-auto">
      <h1 className="text-4xl font-serif font-extrabold text-ink tracking-tight mb-6">
        About Colorado Current
      </h1>
      <div className="space-y-5 text-base font-sans text-ink-secondary leading-relaxed">
        <p>
          Colorado Current is an independent publication tracking the companies, capital,
          and policy shaping Colorado's clean energy future.
        </p>
        <p>
          Colorado has quietly become one of the most interesting clean energy ecosystems
          in the country — geologic hydrogen moonshots in Denver, industrial heat pumps
          in Loveland, geothermal wells drilled four miles deep in Weld County. None of
          it gets the coverage it deserves.
        </p>
        <p>
          Colorado Current exists to fix that. Every two weeks: one company spotlight,
          one industry analysis — always Colorado-specific, always data-backed, always
          with a point of view.
        </p>
        <p className="text-ink font-semibold">
          Built by{" "}
          <a
            href="https://linkedin.com/in/evanfrasz"
            className="text-cc-green hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Evan Frasz
          </a>
          , a Denver-based product leader and clean energy advocate.
        </p>
      </div>
    </div>
  );
}
