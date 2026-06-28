/**
 * EllissLogo — Samantha Schaum's official Elliss wordmark (June 2026)
 *
 * Inline SVG derived from Sammy's Illustrator source files.
 * Font: Chanticleer Roman NF (free for commercial use, 1001Fonts FFC license).
 * The "i" in Elliss is the torch; flame variant maps to side.
 *
 * Props:
 *   width     — rendered width in px (default 180; height auto-scales 792×418.3)
 *   variant   — 'colored' | 'white' | 'give' | 'help'
 *                 colored = gradient flame (default, primary logo)
 *                 white   = all white (for dark / photo backgrounds)
 *                 give    = purple flame (#76479c)
 *                 help    = green flame (#92c19d)
 *   className — optional CSS class
 */
export default function EllissLogo({ width = 180, variant = 'colored', className = '' }) {
  const height = Math.round(width * (418.3 / 792))

  const configs = {
    colored: { text: '#2b4b81', stem: '#2b4b81', flame: 'url(#elliss-grad)', showGrad: true },
    white:   { text: '#ffffff', stem: '#ffffff', flame: '#ffffff',            showGrad: false },
    give:    { text: '#2b4b81', stem: '#2b4b81', flame: '#76479c',            showGrad: false },
    help:    { text: '#2b4b81', stem: '#2b4b81', flame: '#92c19d',            showGrad: false },
  }
  const c = configs[variant] ?? configs.colored

  return (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox="0 0 792 418.3"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      aria-label="Elliss"
      role="img"
    >
      {c.showGrad && (
        <defs>
          <linearGradient id="elliss-grad" x1="415.7" y1="102.5" x2="505" y2="102.5" gradientUnits="userSpaceOnUse">
            <stop offset=".2" stopColor="#76479c"/>
            <stop offset=".8" stopColor="#92c19d"/>
          </linearGradient>
        </defs>
      )}

      {/* Wordmark text: "ell ss" — gap holds the torch */}
      <text
        style={{
          fontFamily: "ChanticleerRomanNF, 'Chanticleer Roman NF', Georgia, serif",
          fontSize: '388.1px',
          fill: c.text,
        }}
        transform="translate(28.8 364.3)"
      >
        ell ss
      </text>

      {/* Flame */}
      <path
        fill={c.flame}
        d="M469.6,37.9c-1.3-1.5-15.6,7.8-21.4,18.5-5.8,10.7-9.7,19.5-4.9,33.1,0,0,3.4-5,6.6-8.9,3.2-4,5.8-4.6,5.8-4.6,0,0-.2,7.7-7.6,20.2-6.7,11.5-9.7,14.5-11,14.3s-2.9-13.9-4.3-14.1c-1.4-.2-16.2,17.3-17.1,36-.6,11.3,5.6,24.3,14,29.6,11.9,7.5,27.6,4.9,27.6,4.9,0,0-16.6-9.8-17-21.5s3-8.7,5.8-9.7c7.7-3,12.5,6.8,12.5,6.8,0,0,4.5-8.3,12.8-7,4.2.7,6.9,3.7,6.6,9.7-.5,11.9-17.3,21.7-17.3,21.7,0,0,14.2,1.7,26.5-4.9,4.9-2.6,10-8.3,12.7-13.6,10.5-20.4,2.6-40.4-3.1-51s-2.8-16.7-5.1-17.2c-2.3-.5-5.8,6.6-6.3,12.9s.6,15.3-4.3,20.5c-4.9,5.2-6.9,5.9-6.9,5.9,0,0-1.8-1.1-1.8-4.2s-.1-4.8-1.6-7c-1.5-2.3,7.3-11.6,6.9-19.8-.8-17-8.8-22.1-9.2-33.3-.3-10.2,2.3-15.8,1.1-17.3Z"
      />

      {/* Torch stem + base */}
      <path
        fill={c.stem}
        d="M502.7,174.6h-87s-3.3,1.5-3.3,9.7.9,7.6,3.1,9.4c3.6,3,12.9,3,14.7,7.8,1.8,4.8,4.7,29.8,4.7,39.7,0,2.7,3.1,76.1,8.6,78.7,5.6,2.6-.4,8.7-.8,9.3s-7.5,8.3-7.7,19.2c-.2,10.2,8.4,19.7,20.8,19.7,13.4,0,20.3-9.9,20.3-19.7,0-9-5.7-17.8-6.7-19.2-1.2-1.7-7.1-7.1-2.8-9.4s10.6-17.1,14.3-78.7c1.2-19.2,3.9-37.7,6.3-40.1,7.1-7.2,11.2-4.6,14.7-7.8,3.5-3.2,2.9-6,2.9-9.9,0-6.6-2-8.8-2-8.8Z"
      />
    </svg>
  )
}
