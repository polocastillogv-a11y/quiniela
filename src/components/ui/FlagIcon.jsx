import { getAlpha2 } from '../../utils/flagCodes'

export default function FlagIcon({ code, size = 16, className = '' }) {
  const code2 = getAlpha2(code)
  return (
    <span
      className={`fi fi-${code2} ${className}`}
      style={{ width: size, height: size, fontSize: size, borderRadius: 2 }}
      title={code}
    />
  )
}
