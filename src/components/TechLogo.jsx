import { useState } from 'react'

/** Maps skill / stack names to Simple Icons CDN slugs + brand colors. */
const LOGO_MAP = {
  flutter: { slug: 'flutter', color: '02569B' },
  dart: { slug: 'dart', color: '0175C2' },
  swift: { slug: 'swift', color: 'F05138' },
  apple: { slug: 'apple', color: 'FFFFFF' },
  nodedotjs: { slug: 'nodedotjs', color: '339933' },
  graphql: { slug: 'graphql', color: 'E10098' },
  tensorflow: { slug: 'tensorflow', color: 'FF6F00' },
  react: { slug: 'react', color: '61DAFB' },
  firebase: { slug: 'firebase', color: 'FFCA28' },
  fastapi: { slug: 'fastapi', color: '009688' },
}

function resolveLogo(key) {
  if (!key) return null
  const normalized = String(key).toLowerCase().replace(/\s+/g, '')
  if (LOGO_MAP[key]) return LOGO_MAP[key]
  if (LOGO_MAP[normalized]) return LOGO_MAP[normalized]
  // fallback: treat key as slug
  return { slug: key, color: 'ff6b00' }
}

/**
 * Technology logo via Simple Icons CDN.
 * Pass `logo` slug (e.g. "flutter") or a known skill name.
 */
export default function TechLogo({
  logo,
  name,
  size = 28,
  className = '',
  showLabel = false,
}) {
  const [failed, setFailed] = useState(false)
  const meta = resolveLogo(logo)
  const label = name || logo

  if (!meta || failed) {
    return (
      <span
        className={`inline-flex items-center justify-center rounded-lg bg-white/10 text-[10px] font-bold text-[#e5e5e5] ${className}`}
        style={{ width: size, height: size }}
        title={label}
      >
        {(label || '?').slice(0, 2).toUpperCase()}
      </span>
    )
  }

  const src = `https://cdn.simpleicons.org/${meta.slug}/${meta.color}`

  const icon = (
    <img
      src={src}
      alt=""
      width={size}
      height={size}
      className={`object-contain ${className}`}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  )

  if (!showLabel) {
    return (
      <span className="inline-flex" title={label} aria-label={label}>
        {icon}
      </span>
    )
  }

  return (
    <span className="inline-flex items-center gap-2" title={label}>
      {icon}
      <span className="text-sm text-[#e5e5e5]">{label}</span>
    </span>
  )
}
