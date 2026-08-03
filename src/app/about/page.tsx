import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
  description: "Colorado Current is an independent publication tracking the companies, capital, and policy shaping Colorado's clean energy future.",
};

export default function AboutPage() {
  return (
    <div className="px-8 py-12 max-w-2xl mx-auto">

      {/* Lede */}
      <p className="text-lg font-sans font-semibold text-ink leading-relaxed mb-8 pb-8 border-b border-surface-border">
        Colorado Current is an independent publication tracking the companies, capital, and policy shaping Colorado's clean energy future.
      </p>

      {/* Body */}
      <div className="space-y-5 text-base font-sans text-ink-secondary leading-relaxed">

        <p>
          Colorado has become one of the central locations of clean energy innovators in the country. I am setting out to bring attention to the people and companies that are building the future we need to respond to climate change.
        </p>

        <p>
          Colorado Current will bring both industry-wide policy analysis and deep dives into the local companies that are pushing the technology. Our company directory has dozens of startups and established players across every sector of the ecosystem, with funding, stage, and sourced data you won't find aggregated anywhere else.
        </p>

        <p>
          I'm Evan Frasz, a Denver-based product leader who spent the last year researching Colorado's clean energy landscape. Professionally I come from the enterprise SaaS world — I have a background in media intelligence, data platforms, and complex multi-product systems. I am bringing my skills and techniques to this new sector to show that we can all contribute to the better future that I know is possible (and necessary!) I'm a Denver homeowner working to electrify my house, I serve on the board of YIMBY Denver, and I volunteer and advocate for safer cycling infrastructure around the state.
        </p>

        <p>
          Growing up, I watched as my father, Al Frasz, led a solar and wind installation company in Ohio, but I saw that the state government and local media often worked at odds with what the then-nascent industry needed. Every sale and new project was bogged down in permitting battles and financing hurdles, and every year brought new state legislation designed to protect the existing fossil fuel generators and keep renewables on the margins.
        </p>

        <p>
          I created Colorado Current to highlight the fact that we are now in the exact opposite scenario here. The governor, the legislators, and the clean energy industry are all aligned on the urgency of the problem and the potential economic impacts if we succeed. There is a growing positive feedback loop of industry and policy working together to build the companies that will innovate our way to a cleaner tomorrow.
        </p>

        {/* Emissions section */}
        <div className="border-l-2 border-cc-green pl-5 my-8 space-y-4">
          <p>
            In 2019, Colorado became the first state in the country to enshrine both short- and long-term emissions reduction targets into law. We must be 50% below 2005 carbon emissions levels by 2030, 90% by 2045, and net-zero by 2050.
          </p>
          <p>
            Unfortunately, Colorado is currently running about two years behind all of these legally required targets. The most recent state greenhouse gas inventory estimates actual 2025 emissions at 115 million metric tons against a statutory target of 109 million. The 2030 target is now expected to land in the early 2030s at best. Transportation emissions remain stubbornly high, even as the state continues spending billions on expanded highways. Federal rollbacks and funding cuts have complicated the picture further.
          </p>
        </div>

        <p>
          This is why we have to fight for and champion the work that will speed up our transition to an electrified world. Our local companies are ready to deploy their solutions and our policymakers are pushing even harder to create the regulatory framework to retire fossil fuel generation and replace it with renewables. I want to bring attention to this exciting new clean tech ecosystem and highlight the progress and challenges that remain.
        </p>

        <p className="text-ink font-semibold">
          Colorado needs honest, specific, data-backed coverage of what's working, what isn't, and who's building the solutions.
        </p>

        <p className="text-ink font-semibold">
          That's what Colorado Current is for.
        </p>

      </div>

      {/* Independence note */}
      <div className="mt-10 pt-8 border-t border-surface-border">
        <h2 className="text-xs font-sans font-bold uppercase tracking-widest text-ink-muted mb-3">
          A note on independence
        </h2>
        <p className="text-sm font-sans text-ink-secondary leading-relaxed">
          Colorado Current is editorially independent. It is not affiliated with, funded by, or paid by any company, utility, investor, or organization in the ecosystem. When I cover a company, it's because I think it's interesting — not because anyone asked me to.
        </p>
      </div>

      {/* Get in touch */}
      <div className="mt-8 pt-8 border-t border-surface-border">
        <h2 className="text-xs font-sans font-bold uppercase tracking-widest text-ink-muted mb-3">
          Get in touch
        </h2>
        <p className="text-sm font-sans text-ink-secondary leading-relaxed">
          If you're building a clean energy company in Colorado and want to be featured or added to the directory, reach out on{" "}
          <a
            href="https://linkedin.com/in/evanfrasz"
            target="_blank"
            rel="noopener noreferrer"
            className="text-cc-green hover:underline"
          >
            LinkedIn
          </a>
          . Same if you have a tip, a correction, or just want to talk about what's happening in the ecosystem.
        </p>
      </div>

    </div>
  );
}
