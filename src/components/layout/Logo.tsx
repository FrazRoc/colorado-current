interface Props {
  dark?: boolean;
  size?: "sm" | "md" | "lg";
}

const sizes = {
  sm: { mark: 28, stroke: 2.4, wave: 1.6, gap: 10, font: 13 },
  md: { mark: 40, stroke: 3.2, wave: 2.0, gap: 14, font: 16 },
  lg: { mark: 96, stroke: 6.0, wave: 3.5, gap: 24, font: 26 },
};

export default function Logo({ dark = false, size = "md" }: Props) {
  const s = sizes[size];
  const color = dark ? "#4db8a0" : "#2d8c5e";
  const textColor = dark ? "#ffffff" : "#111111";

  const u = s.mark / 40;
  const lx = 13 * u;
  const ly = 20 * u;
  const lt = 20 * u;
  const wy = 8 * u;
  const wa = 8 * u;
  const wh = 5 * u;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: s.gap }}>
      <svg
        width={s.mark}
        height={s.mark}
        viewBox={`${-lx - 4} ${-lt - 4} ${(lx + 4) * 2} ${lt + ly + 8}`}
        fill="none"
        aria-hidden="true"
      >
        <line
          x1={-lx} y1={ly}
          x2={0} y2={-lt}
          stroke={color}
          strokeWidth={s.stroke}
          strokeLinecap="round"
        />
        <line
          x1={lx} y1={ly}
          x2={0} y2={-lt}
          stroke={color}
          strokeWidth={s.stroke}
          strokeLinecap="round"
        />
        <path
          d={`M${-wa},${wy} C${-wa * 0.65},${wy - wh} ${-wa * 0.25},${wy - wh} 0,${wy} C${wa * 0.25},${wy + wh} ${wa * 0.65},${wy + wh} ${wa},${wy}`}
          stroke={color}
          strokeWidth={s.wave}
          strokeLinecap="round"
          fill="none"
        />
      </svg>
      <span
        style={{
          fontFamily: "var(--font-family-serif, Georgia, serif)",
          fontSize: s.font,
          fontWeight: 700,
          color: textColor,
          letterSpacing: "-0.3px",
          lineHeight: 1,
          userSelect: "none",
        }}
      >
        Colorado Current
      </span>
    </div>
  );
}
