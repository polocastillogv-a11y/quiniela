export default function Button({ children, variant = 'primary', size = 'md', className = '', ...props }) {
  const base = 'inline-flex items-center justify-center gap-2 font-display font-bold tracking-wider rounded-lg transition-colors'
  const variants = {
    primary: 'bg-ocre text-white hover:bg-ocre/90',
    secondary: 'border border-cesped text-cesped hover:bg-cesped/5',
    ghost: 'text-cesped hover:bg-cesped/5',
    danger: 'bg-tinto text-white hover:bg-tinto/90',
  }
  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-8 py-3.5 text-base',
  }
  return (
    <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {children}
    </button>
  )
}
