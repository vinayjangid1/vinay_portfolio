/**
 * App Store / Play Store / Chrome icons for project cards & detail.
 * Shows icons from `platforms` (or inferred from tech/links).
 * Tap opens the link when URL is set in project.links.
 */

const PLATFORM_ORDER = ['ios', 'android', 'web']

const PLATFORM_TO_TYPE = {
  ios: 'appStore',
  android: 'playStore',
  web: 'website',
}

const LABELS = {
  appStore: 'App Store',
  playStore: 'Google Play',
  website: 'Website',
}

function inferPlatforms(project) {
  if (project.platforms?.length) return project.platforms

  const raw = project.links || {}
  const tech = (project.tech || []).join(' ').toLowerCase()
  const text = `${project.tagline || ''} ${project.description || ''}`.toLowerCase()
  const platforms = []

  if (
    raw.appStore ||
    tech.includes('swift') ||
    tech.includes('storyboard') ||
    tech.includes('swiftui') ||
    tech.includes('flutter') ||
    text.includes('ios')
  ) {
    platforms.push('ios')
  }
  if (
    raw.playStore ||
    tech.includes('flutter') ||
    text.includes('android')
  ) {
    platforms.push('android')
  }
  if (
    raw.website ||
    project.live ||
    tech.includes('react') ||
    text.includes('website') ||
    text.includes('web')
  ) {
    platforms.push('web')
  }

  return platforms.length ? platforms : ['ios']
}

export function getProjectLinks(project) {
  if (!project) return []
  const raw = project.links || {}
  return inferPlatforms(project)
    .filter((p) => PLATFORM_ORDER.includes(p))
    .sort((a, b) => PLATFORM_ORDER.indexOf(a) - PLATFORM_ORDER.indexOf(b))
    .map((platform) => {
      const type = PLATFORM_TO_TYPE[platform]
      const href =
        type === 'appStore'
          ? raw.appStore || null
          : type === 'playStore'
            ? raw.playStore || null
            : raw.website || project.live || null
      return { type, href, platform }
    })
}

function AppStoreIcon({ size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        fill="#FFFFFF"
        d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 22 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.1 22C7.79 22.05 6.8 20.68 5.96 19.47C4.25 16.98 2.93 12.44 4.7 9.39C5.58 7.87 7.13 6.91 8.82 6.88C10.1 6.86 11.32 7.75 12.11 7.75C12.89 7.75 14.37 6.68 15.92 6.84C16.57 6.87 18.39 7.1 19.56 8.82C19.47 8.88 17.39 10.1 17.41 12.63C17.44 15.65 20.06 16.66 20.09 16.67C20.06 16.74 19.67 18.11 18.71 19.5ZM13 3.5C13.73 2.67 14.94 2.04 15.94 2C16.07 3.17 15.6 4.35 14.9 5.19C14.21 6.04 13.07 6.7 11.95 6.61C11.8 5.46 12.36 4.26 13 3.5Z"
      />
    </svg>
  )
}

function PlayStoreIcon({ size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path fill="#00F076" d="M3.6 2.3c-.3.2-.5.6-.5 1.1v17.2c0 .5.2.9.5 1.1l.1.1 9.6-9.6v-.3L3.7 2.3l-.1 0z" />
      <path fill="#FFCE00" d="M16.1 14.9l-2.8-2.8v-.3l2.8-2.8.1.1 3.3 1.9c.9.5.9 1.4 0 1.9l-3.4 2z" />
      <path fill="#FF3A44" d="M16.2 14.8l-2.9-2.9-9.7 9.7c.4.4 1 .4 1.7 0l10.9-6.3v-.5z" />
      <path fill="#00A0FF" d="M16.2 9.1 5.3 2.8c-.7-.4-1.3-.4-1.7 0l9.7 9.7 2.9-2.9.1-.5z" />
    </svg>
  )
}

function ChromeIcon({ size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="10" fill="#FFFFFF" fillOpacity="0.08" />
      <path
        fill="#EA4335"
        d="M12 4a8 8 0 0 1 6.93 4H12a4 4 0 0 0-3.46 2L5.07 6.93A8 8 0 0 1 12 4z"
      />
      <path
        fill="#FBBC05"
        d="M8.54 12a3.46 3.46 0 0 1 .46-1.73L5.07 6.93A8 8 0 0 0 4.2 14.8L8.9 13.2A3.5 3.5 0 0 1 8.54 12z"
      />
      <path
        fill="#34A853"
        d="M12 15.46a3.46 3.46 0 0 1-3.1-1.93L4.2 14.8A8 8 0 0 0 12 20a8 8 0 0 0 6.93-4H12.9a3.46 3.46 0 0 1-.9-.54z"
      />
      <path
        fill="#4285F4"
        d="M20 12a8 8 0 0 0-1.07-4H12.9a3.46 3.46 0 0 1 0 5.92H18.93A8 8 0 0 0 20 12z"
      />
      <circle cx="12" cy="12" r="3.2" fill="#4285F4" />
      <circle cx="12" cy="12" r="1.5" fill="#FFFFFF" />
    </svg>
  )
}

function StoreIcon({ type, size }) {
  if (type === 'appStore') return <AppStoreIcon size={size} />
  if (type === 'playStore') return <PlayStoreIcon size={size} />
  return <ChromeIcon size={size} />
}

export default function ProjectLinks({
  project,
  size = 'md',
  className = '',
  onLinkClick,
}) {
  const links = getProjectLinks(project)
  if (!links.length) return null

  const dim =
    size === 'sm'
      ? { btn: 'h-8 w-8', icon: 16 }
      : size === 'lg'
        ? { btn: 'h-11 w-11', icon: 22 }
        : { btn: 'h-9 w-9', icon: 18 }

  return (
    <div
      className={`flex flex-wrap items-center gap-1.5 ${className}`}
      onClick={(e) => e.stopPropagation()}
      onKeyDown={(e) => e.stopPropagation()}
      role="presentation"
    >
      {links.map(({ type, href }) => {
        const label = LABELS[type]
        const sharedClass = `inline-flex ${dim.btn} items-center justify-center rounded-lg border border-white/15 bg-white/10 transition ${
          href
            ? 'hover:border-[#ff6b00]/45 hover:bg-white/15 hover:scale-105 active:scale-95 cursor-pointer'
            : 'opacity-70 cursor-default'
        }`

        if (href) {
          return (
            <a
              key={type}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Open ${project.title} on ${label}`}
              title={label}
              onClick={onLinkClick}
              className={sharedClass}
            >
              <StoreIcon type={type} size={dim.icon} />
            </a>
          )
        }

        return (
          <span
            key={type}
            aria-label={`${label} (link coming soon)`}
            title={`${label} — add URL in data.json`}
            className={sharedClass}
          >
            <StoreIcon type={type} size={dim.icon} />
          </span>
        )
      })}
    </div>
  )
}
