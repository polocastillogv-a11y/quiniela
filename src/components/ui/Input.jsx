export default function Input({ className = '', ...props }) {
  return (
    <input
      className={`w-full px-3 py-2 bg-white border border-cesped/30 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-ocre/40 focus:border-ocre transition-colors ${className}`}
      {...props}
    />
  )
}
