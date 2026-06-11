export default function Card({ children, className = '', title, action, variant = 'light' }) {
  const variants = {
    dark: 'bg-cesped text-crema',
    light: 'bg-white text-gray-900',
    crema: 'bg-crema/50 text-gray-900 border border-cesped/10',
  }
  return (
    <div className={`rounded-xl ${variants[variant]} ${variant === 'light' ? 'border border-gray-200' : ''} ${className}`}>
      {(title || action) && (
        <div className="flex items-center justify-between px-6 py-4 border-b border-cesped/10">
          {title && <h2 className="text-lg font-display font-bold tracking-wide">{title}</h2>}
          {action && <div>{action}</div>}
        </div>
      )}
      <div className="px-6 py-5">{children}</div>
    </div>
  )
}
