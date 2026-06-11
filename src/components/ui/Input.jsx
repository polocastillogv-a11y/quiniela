export default function Input({ className = '', ...props }) {
  return (
    <input
      className={`w-full px-3 py-2 bg-crema-card border border-tinta/30 rounded-lg text-sm text-tinta placeholder-tinta/40 focus:outline-none focus:ring-2 focus:ring-ocre/40 focus:border-ocre transition-colors ${className}`}
      {...props}
    />
  )
}
