/**
 * EllissLogo
 * "ell[torch]ss" — the i is a torch with a gold flame,
 * matching the Elliss brand identity.
 *
 * Props:
 *   size      — font size in px (default 48)
 *   color     — text + stem color (defaults to brand plum #5A2860)
 *   flame     — flame color (defaults to brand gold #F0B428)
 *   className — optional wrapper class
 */
export default function EllissLogo({
  size = 48,
  color = '#5A2860',
  flame = '#F0B428',
  className = '',
}) {
  const textStyle = {
    fontSize: size,
    fontWeight: 800,
    letterSpacing: '-0.03em',
    color,
    lineHeight: 1,
    fontFamily: 'inherit',
    display: 'inline',
  }

  return (
    <span
      className={className}
      style={{ display: 'inline-flex', alignItems: 'flex-end', lineHeight: 1 }}
      aria-label="elliss"
      role="img"
    >
      <span style={textStyle}>ell</span>
      <TorchI height={size} stemColor={color} flameColor={flame} />
      <span style={textStyle}>ss</span>
    </span>
  )
}

/**
 * The torch that replaces the letter "i".
 * Matches the brand logo: teardrop gold flame + plum cylindrical stem.
 */
function TorchI({ height, stemColor, flameColor }) {
  // Scale to match font metrics
  const W        = height * 0.30     // total width of the glyph
  const flameH   = height * 0.38     // height of the flame portion
  const stemH    = height * 0.56     // height of the stem
  const stemW    = height * 0.10     // width of the stem
  const baseH    = height * 0.06     // small base/foot at bottom
  const baseW    = height * 0.20     // width of base
  const cx       = W / 2             // horizontal center
  const stemY    = flameH            // stem starts where flame ends
  const baseY    = stemY + stemH     // base starts below stem
  const totalH   = baseY + baseH     // total SVG height

  // Flame: teardrop shape — pointed at top, rounded at bottom
  const flamePath = `
    M ${cx} ${height * 0.015}
    C ${cx - W * 0.38} ${flameH * 0.30},
      ${cx - W * 0.46} ${flameH * 0.62},
      ${cx} ${flameH}
    C ${cx + W * 0.46} ${flameH * 0.62},
      ${cx + W * 0.38} ${flameH * 0.30},
      ${cx} ${height * 0.015} Z
  `

  // Inner highlight to give flame a "lit" look
  const highlightPath = `
    M ${cx} ${flameH * 0.14}
    C ${cx - W * 0.18} ${flameH * 0.40},
      ${cx - W * 0.14} ${flameH * 0.72},
      ${cx} ${flameH * 0.88}
    C ${cx + W * 0.14} ${flameH * 0.72},
      ${cx + W * 0.18} ${flameH * 0.40},
      ${cx} ${flameH * 0.14} Z
  `

  return (
    <svg
      width={W}
      height={totalH}
      viewBox={`0 0 ${W} ${totalH}`}
      style={{ display: 'inline', verticalAlign: 'bottom', flexShrink: 0, marginBottom: 0 }}
      aria-hidden="true"
    >
      {/* Flame body */}
      <path d={flamePath} fill={flameColor} />
      {/* Flame highlight */}
      <path d={highlightPath} fill="rgba(255,255,255,0.30)" />
      {/* Torch stem */}
      <rect
        x={cx - stemW / 2}
        y={stemY}
        width={stemW}
        height={stemH}
        rx={stemW / 2}
        fill={stemColor}
      />
      {/* Base */}
      <rect
        x={cx - baseW / 2}
        y={baseY}
        width={baseW}
        height={baseH}
        rx={baseH / 2}
        fill={stemColor}
      />
    </svg>
  )
}
