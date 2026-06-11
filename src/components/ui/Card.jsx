export default function Card({ children, className = '', title, action, variant = 'light' }) {
  const variants = {
    dark: 'bg-cesped text-crema-text',
    light: 'bg-crema-card text-tinta border border-tinta/13',
    crema: 'bg-crema/50 text-tinta border border-tinta/10',
  }
  return (
    <div className={`rounded-xl ${variants[variant]} ${className}`}>
      {(title || action) && (
        <div className="flex items-center justify-between px-6 py-4 border-b border-tinta/10">
          {title && <h2 className="text-lg font-display font-bold tracking-wide">{title}</h2>}
          {action && <div>{action}</div>}
        </div>
      )}
      <div className="px-6 py-5">{children}</div>
    </div>
  )
}
