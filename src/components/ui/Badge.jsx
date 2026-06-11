export default function Badge({ children, color = 'gray' }) {
  const colors = {
    green: 'bg-pasto/10 text-pasto',
    red: 'bg-tinto/10 text-tinto',
    yellow: 'bg-ocre/10 text-ocre',
    blue: 'bg-cesped/10 text-cesped',
    gray: 'bg-cesped/5 text-cesped/60',
  }
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${colors[color] || colors.gray}`}>
      {children}
    </span>
  )
}
