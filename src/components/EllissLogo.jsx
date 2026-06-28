/**
 * EllissLogo — Samantha Schaum's official Elliss wordmark (June 2026)
 *
 * Inline SVG derived from Sammy's Illustrator source files.
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
          <linearGradient id="elliss-grad" x1="380.1" y1="99.5" x2="472" y2="99.5" gradientUnits="userSpaceOnUse">
            <stop offset=".2" stopColor="#76479c"/>
            <stop offset=".8" stopColor="#92c19d"/>
          </linearGradient>
        </defs>
      )}

      {/* Wordmark text: "ell ss" — gap holds the torch */}
      <text
        style={{
          fontFamily: "CanelaTextTrial-Regular, 'Canela Text Trial', Georgia, serif",
          fontSize: '300.7px',
          fill: c.text,
        }}
        transform="translate(66.6 362.2)"
      >
        ell ss
      </text>

      {/* Flame */}
      <path
        fill={c.flame}
        d="M435.5,33.1c-1.3-1.6-16,8-22.1,19.1-6,11-10,20.1-5,34.1,0,0,3.5-5.1,6.8-9.2,3.3-4.1,5.9-4.8,5.9-4.8,0,0-.2,7.9-7.8,20.8-6.9,11.8-10,14.9-11.3,14.7s-3-14.3-4.4-14.5c-1.4-.2-16.6,17.8-17.6,37-.6,11.6,5.7,25,14.4,30.5,12.3,7.7,28.4,5,28.4,5,0,0-17-10-17.5-22.1-.3-6.3,3.1-8.9,5.9-10,8-3.1,12.9,7,12.9,7,0,0,4.7-8.5,13.2-7.2,4.3.7,7.1,3.8,6.8,10-.5,12.3-17.8,22.3-17.8,22.3,0,0,14.6,1.7,27.2-5,5.1-2.7,10.3-8.6,13.1-13.9,10.8-21,2.7-41.5-3.1-52.5-5.8-10.9-2.9-17.2-5.2-17.7-2.3-.5-5.9,6.7-6.5,13.3-.6,6.5.6,15.7-4.4,21.1-5,5.4-7.1,6.1-7.1,6.1,0,0-1.9-1.2-1.9-4.3s-.1-4.9-1.6-7.2,7.5-12,7.1-20.4c-.8-17.5-9.1-22.7-9.4-34.2-.3-10.4,2.4-16.2,1.1-17.8Z"
      />

      {/* Torch stem + base */}
      <path
        fill={c.stem}
        d="M469.6,173.7h-89.5s-3.4,1.5-3.4,10,.9,7.9,3.2,9.7c3.7,3,13.3,3.1,15.1,8,1.8,4.9,4.8,30.7,4.8,40.8,0,2.8,3.1,78.3,8.9,81,5.7,2.7-.4,9-.9,9.6s-7.8,8.5-7.9,19.7c-.2,10.5,8.6,20.2,21.4,20.2,13.8,0,20.9-10.2,20.8-20.2,0-9.3-5.8-18.3-6.9-19.7s-7.4-7.3-2.9-9.7,10.9-17.6,14.7-80.9c1.2-19.8,4-38.7,6.5-41.3,7.3-7.4,11.5-4.7,15.1-8,3.6-3.3,3-6.2,3-10.1,0-6.8-2.1-9.1-2.1-9.1Z"
      />
    </svg>
  )
}
