const s = { fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' }

export function TrophyIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" {...s} className={className}>
      <path d="M8 4h8v5a4 4 0 0 1-8 0z" />
      <path d="M8 5.2H5.6a2 2 0 0 0 0 4H9" />
      <path d="M15 5.2h3.4a2 2 0 0 0 0 4H15" />
      <path d="M12 13v3.5" />
      <path d="M9 20h6" />
      <path d="M10.2 20l.6-3.6" />
      <path d="M13.8 20l-.6-3.6" />
    </svg>
  )
}

export function UsersIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" {...s} className={className}>
      <circle cx="9" cy="8" r="3.2" />
      <circle cx="16.5" cy="9" r="2.4" />
      <path d="M4 19c0-3 2.2-5.2 5-5.2s5 2.2 5 5.2" />
      <path d="M15.5 19c0-2.4.9-4.2 2.4-5" />
    </svg>
  )
}

export function WalletIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" {...s} className={className}>
      <path d="M3 7.5a2 2 0 0 1 2-2h12.5v3" />
      <path d="M3 7.5V17a2 2 0 0 0 2 2h13a1 1 0 0 0 1-1v-2.5" />
      <path d="M21 11.5v3.5h-3.8a1.75 1.75 0 0 1 0-3.5H21z" />
    </svg>
  )
}

export function HourglassIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" {...s} className={className}>
      <path d="M6 4h12" />
      <path d="M6 20h12" />
      <path d="M8 4v1.8l4 6.2 4-6.2V4" />
      <path d="M8 20v-1.8l4-6.2 4 6.2V20" />
    </svg>
  )
}

export function BallIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" {...s} className={className}>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="2" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function DicesIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" {...s} className={className}>
      <path d="M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z" />
      <circle cx="8.5" cy="8.5" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="15.5" cy="15.5" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function ClipboardIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" {...s} className={className}>
      <path d="M6.5 5.2h11a1.5 1.5 0 0 1 1.5 1.5V19a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 5 19V6.7a1.5 1.5 0 0 1 1.5-1.5z" />
      <path d="M9 5.6V4.6a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1" />
      <path d="M8.5 11h7" />
      <path d="M8.5 14.8h7" />
    </svg>
  )
}

export function CoinsIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" {...s} className={className}>
      <circle cx="9" cy="9" r="5" />
      <path d="M14.6 5.3a5 5 0 0 1 0 9.4" />
      <path d="M11.2 18.6a5 5 0 0 0 7.8-4.1" />
    </svg>
  )
}

export function ChartIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" {...s} className={className}>
      <path d="M4 4v16h16" />
      <path d="M8.5 20v-4" />
      <path d="M13 20v-8" />
      <path d="M17.5 20v-6" />
    </svg>
  )
}

export function ChevronRightIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" {...s} className={className}>
      <path d="M9.5 6l6 6-6 6" />
    </svg>
  )
}
