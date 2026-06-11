export default function Avatar({ name, size = 'md', className = '' }) {
  const initials = name
    ? name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : '?'
  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
  }
  return (
    <span className={`inline-flex items-center justify-center rounded-full bg-ocre text-crema font-bold ${sizes[size]} ${className}`}>
      {initials}
    </span>
  )
}
