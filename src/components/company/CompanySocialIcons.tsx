import type { Company } from "@/types";
import { siX, siBluesky, siFacebook, siInstagram, siYoutube, siCrunchbase } from "simple-icons";

const BRAND_ICONS = {
  twitter: siX,
  bluesky: siBluesky,
  facebook: siFacebook,
  instagram: siInstagram,
  youtube: siYoutube,
  crunchbase: siCrunchbase,
} as const;

function BrandIcon({ id }: { id: keyof typeof BRAND_ICONS }) {
  const icon = BRAND_ICONS[id];
  return (
    <svg viewBox="0 0 24 24" width={14} height={14} fill={`#${icon.hex}`} aria-hidden="true">
      <path d={icon.path} />
    </svg>
  );
}

// Brands not available as accurate SVG data (removed from our icon source, or
// no verified brand mark on hand) fall back to a plain letter badge instead
// of a guessed/approximated logo shape.
function LetterBadge({ text }: { text: string }) {
  return (
    <span className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-[2px] bg-ink-faint text-white text-[8px] font-bold leading-none">
      {text}
    </span>
  );
}

const LINKS: { field: keyof Company; label: string; icon: React.ReactNode }[] = [
  { field: "linkedin_url", label: "LinkedIn", icon: <LetterBadge text="in" /> },
  { field: "twitter_url", label: "X / Twitter", icon: <BrandIcon id="twitter" /> },
  { field: "bluesky_url", label: "Bluesky", icon: <BrandIcon id="bluesky" /> },
  { field: "facebook_url", label: "Facebook", icon: <BrandIcon id="facebook" /> },
  { field: "instagram_url", label: "Instagram", icon: <BrandIcon id="instagram" /> },
  { field: "youtube_url", label: "YouTube", icon: <BrandIcon id="youtube" /> },
  { field: "crunchbase_url", label: "Crunchbase", icon: <BrandIcon id="crunchbase" /> },
  { field: "pitchbook_url", label: "Pitchbook", icon: <LetterBadge text="PB" /> },
  { field: "builtin_url", label: "Built In", icon: <LetterBadge text="BI" /> },
];

export default function CompanySocialIcons({ company }: { company: Company }) {
  const active = LINKS.filter((l) => company[l.field]);
  if (active.length === 0) return null;

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {active.map((l) => (
        <a
          key={l.field}
          href={company[l.field] as string}
          target="_blank"
          rel="noopener noreferrer"
          title={l.label}
          onClick={(e) => e.stopPropagation()}
          className="hover:opacity-70 transition-opacity"
        >
          {l.icon}
        </a>
      ))}
    </div>
  );
}
