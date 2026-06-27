/**
 * EllissLogo
 * Renders "ell[torch]ss" — the "i" is replaced by a flame/torch,
 * per the Elliss brand identity guide ("The torch is you.").
 *
 * Props:
 *   size      — font size in px (default 48)
 *   purple    — stem / text color (defaults to brand purple)
 *   flame     — flame color (defaults to brand gold)
 *   className — optional wrapper class
 */
export default function EllissLogo({
  size = 48,
  purple = 'var(--brand-purple)',
  flame = 'var(--brand-flame)',
  className = '',
}) {
  const textStyle = {
    fontSize: size,
    fontWeight: 800,
    letterSpacing: '-0.04em',
    color: purple,
    lineHeight: 1,
    fontFamily: 'inherit',
  }

  return (
    <span
      className={className}
      style={{ display: 'inline-flex', alignItems: 'flex-start' }}
      aria-label="elliss"
    >
      <span style={textStyle}>ell</span>
      <TorchI height={size} stemColor={purple} flameColor={flame} />
      <span style={textStyle}>ss</span>
    </span>
  )
}

/** The torch that stands in for the letter "i" */
function TorchI({ height, stemColor, flameColor }) {
  // All measurements scale with font height
  const totalW   = height * 0.32
  const flameH   = height * 0.40
  const stemH    = height * 0.54
  const stemW    = height * 0.11
  const cx       = totalW / 2
  const stemX    = cx - stemW / 2
  const stemY    = flameH + height * 0.01

  // Cubic-bezier teardrop flame (pointy at top, round at bottom)
  const flamePath = [
    `M ${cx} ${height * 0.01}`,
    `C ${cx - totalW * 0.42} ${flameH * 0.28},`,
    `  ${cx - totalW * 0.48} ${flameH * 0.68},`,
    `  ${cx} ${flameH}`,
    `C ${cx + totalW * 0.48} ${flameH * 0.68},`,
    `  ${cx + totalW * 0.42} ${flameH * 0.28},`,
    `  ${cx} ${height * 0.01} Z`,
  ].join(' ')

  // Inner highlight (makes the flame look lit)
  const highlightPath = [
    `M ${cx} ${flameH * 0.18}`,
    `C ${cx - totalW * 0.22} ${flameH * 0.42},`,
    `  ${cx - totalW * 0.18} ${flameH * 0.72},`,
    `  ${cx} ${flameH * 0.86}`,
    `C ${cx + totalW * 0.18} ${flameH * 0.72},`,
    `  ${cx + totalW * 0.22} ${flameH * 0.42},`,
    `  ${cx} ${flameH * 0.18} Z`,
  ].join(' ')

  return (
    <svg
      width={totalW}
      height={height}
      viewBox={`0 0 ${totalW} ${height}`}
      style={{ display: 'inline', verticalAlign: 'top', flexShrink: 0 }}
      aria-hidden="true"
    >
      {/* Flame body */}
      <path d={flamePath} fill={flameColor} />
      {/* Inner highlight */}
      <path d={highlightPath} fill="rgba(255,255,255,0.28)" />
      {/* Torch stem */}
      <rect
        x={stemX}
        y={stemY}
        width={stemW}
        height={stemH}
        rx={stemW / 2}
        fill={stemColor}
      />
    </svg>
  )
}
