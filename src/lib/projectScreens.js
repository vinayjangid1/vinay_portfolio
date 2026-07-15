const EXTENSIONS = ['png', 'jpg', 'jpeg', 'webp']
const MAX_AUTO_SCREENS = 20

/** Check if a static asset exists (dev + production). */
async function assetExists(url) {
  try {
    const res = await fetch(url, { method: 'HEAD' })
    return res.ok
  } catch {
    return false
  }
}

/**
 * Load preview screens for a project:
 * 1. Explicit paths from data.json `screens`
 * 2. Auto-discover /projects/{slug}/screens/01.png … 20.png
 */
export async function loadProjectScreens(project) {
  if (!project) return []

  const explicit = (project.screens || []).filter(Boolean)
  if (explicit.length) return explicit

  const slug = project.slug
  const found = []

  for (let i = 1; i <= MAX_AUTO_SCREENS; i += 1) {
    const num = String(i).padStart(2, '0')
    for (const ext of EXTENSIONS) {
      const url = `/projects/${slug}/screens/${num}.${ext}`
      if (await assetExists(url)) {
        found.push(url)
        break
      }
    }
  }

  return found
}
