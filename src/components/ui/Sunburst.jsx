export default function Sunburst({ className = '' }) {
  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`} aria-hidden="true">
      <svg
        viewBox="0 0 1200 800"
        preserveAspectRatio="xMidYMid slice"
        className="w-full h-full opacity-[0.04]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="sunCore" cx="85%" cy="20%" r="60%">
            <stop offset="0%" stopColor="#D9A441" />
            <stop offset="30%" stopColor="#D9A441" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#D9A441" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="ray1" x1="85%" y1="20%" x2="20%" y2="80%">
            <stop offset="0%" stopColor="#D9A441" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#D9A441" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="ray2" x1="85%" y1="20%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#D9A441" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#D9A441" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="ray3" x1="85%" y1="20%" x2="0%" y2="50%">
            <stop offset="0%" stopColor="#D9A441" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#D9A441" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="ray4" x1="85%" y1="20%" x2="80%" y2="100%">
            <stop offset="0%" stopColor="#D9A441" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#D9A441" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="ray5" x1="85%" y1="20%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#D9A441" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#D9A441" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Core glow */}
        <rect width="1200" height="800" fill="url(#sunCore)" />

        {/* Rays emanating from top-right */}
        <polygon points="1020,160 200,700 400,800" fill="url(#ray1)" />
        <polygon points="1020,160 600,800 800,800" fill="url(#ray2)" />
        <polygon points="1020,160 0,500 0,700" fill="url(#ray3)" />
        <polygon points="1020,160 900,800 1100,800" fill="url(#ray4)" />
        <polygon points="1020,160 0,0 200,0" fill="url(#ray5)" />
        <polygon points="1020,160 0,200 0,400" fill="url(#ray3)" />
        <polygon points="1020,160 1000,800 1200,700" fill="url(#ray1)" />

        {/* Additional soft rays */}
        <polygon points="1020,160 300,0 500,0" fill="url(#ray5)" />
        <polygon points="1020,160 1200,400 1200,600" fill="url(#ray4)" />

        {/* Horizontal band glow */}
        <ellipse cx="1020" cy="160" rx="350" ry="80" fill="#D9A441" opacity="0.06" />
      </svg>
    </div>
  )
}
