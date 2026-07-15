import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import data from '../data.json'

function upsertMeta(attr, key, content) {
  if (!content) return
  let el = document.head.querySelector(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function upsertLink(rel, href) {
  if (!href) return
  let el = document.head.querySelector(`link[rel="${rel}"]`)
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', rel)
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

function upsertJsonLd(id, json) {
  let el = document.getElementById(id)
  if (!el) {
    el = document.createElement('script')
    el.type = 'application/ld+json'
    el.id = id
    document.head.appendChild(el)
  }
  el.textContent = JSON.stringify(json)
}

/**
 * Sets document title, meta, Open Graph, Twitter, canonical, and JSON-LD
 * for home and project routes (Flutter / iOS / full stack SEO).
 */
export default function SEO({ project = null }) {
  const location = useLocation()
  const seo = data.seo || {}
  const siteUrl = (data.siteUrl || 'https://vinay.dev').replace(/\/$/, '')

  useEffect(() => {
    const path = location.pathname || '/'
    const pageUrl = `${siteUrl}${path === '/' ? '' : path}`

    const title = project
      ? `${project.title} | ${data.name} — Flutter & Full Stack Developer`
      : seo.title || `${data.name} | Flutter Developer`

    const description = project
      ? `${project.description} Built by ${data.name}, Flutter developer, iOS developer, and full stack developer.`
      : seo.description

    const keywords = (seo.keywords || []).join(', ')
    const imagePath = project?.thumbnail || seo.ogImage || data.profileImage
    const imageUrl = imagePath?.startsWith('http')
      ? imagePath
      : `${siteUrl}${imagePath}`

    document.title = title

    upsertMeta('name', 'description', description)
    upsertMeta('name', 'keywords', keywords)
    upsertMeta('name', 'author', data.name)
    upsertMeta('name', 'robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1')
    upsertMeta('name', 'googlebot', 'index, follow')
    upsertMeta('name', 'theme-color', '#000000')

    upsertMeta('property', 'og:type', project ? 'article' : 'website')
    upsertMeta('property', 'og:site_name', `${data.name} Portfolio`)
    upsertMeta('property', 'og:locale', seo.locale || 'en_US')
    upsertMeta('property', 'og:title', title)
    upsertMeta('property', 'og:description', description)
    upsertMeta('property', 'og:url', pageUrl)
    upsertMeta('property', 'og:image', imageUrl)
    upsertMeta('property', 'og:image:alt', `${data.name} — Flutter, iOS & Full Stack Developer`)

    upsertMeta('name', 'twitter:card', 'summary_large_image')
    upsertMeta('name', 'twitter:title', title)
    upsertMeta('name', 'twitter:description', description)
    upsertMeta('name', 'twitter:image', imageUrl)

    upsertLink('canonical', pageUrl)

    // Person + Professional profile
    upsertJsonLd('ld-person', {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: data.name,
      url: siteUrl,
      image: `${siteUrl}${data.profileImage}`,
      email: data.email,
      jobTitle: seo.jobTitle || data.title,
      description: seo.description || data.bio,
      sameAs: [data.github, data.linkedin].filter(Boolean),
      knowsAbout: seo.skills || [],
      worksFor: (data.experience || []).map((e) => ({
        '@type': 'Organization',
        name: e.company,
      })),
    })

    // Website
    upsertJsonLd('ld-website', {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: `${data.name} — Flutter Developer Portfolio`,
      url: siteUrl,
      description: seo.description,
      inLanguage: 'en',
      about: [
        'Flutter developer',
        'iOS developer',
        'Full stack developer',
        'Mobile app development',
      ],
      potentialAction: {
        '@type': 'SearchAction',
        target: `${siteUrl}/?q={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    })

    // ProfessionalService / offer (hire me)
    upsertJsonLd('ld-service', {
      '@context': 'https://schema.org',
      '@type': 'ProfessionalService',
      name: `${data.name} — Flutter, iOS & Full Stack Development`,
      image: `${siteUrl}${data.profileImage}`,
      url: siteUrl,
      description: seo.description,
      provider: {
        '@type': 'Person',
        name: data.name,
      },
      areaServed: 'Worldwide',
      serviceType: [
        'Flutter app development',
        'iOS app development',
        'Full stack development',
        'Mobile application development',
      ],
    })

    if (project) {
      upsertJsonLd('ld-project', {
        '@context': 'https://schema.org',
        '@type': 'CreativeWork',
        name: project.title,
        description: project.description,
        url: pageUrl,
        image: imageUrl,
        author: {
          '@type': 'Person',
          name: data.name,
        },
        keywords: (project.tech || []).join(', '),
      })
    } else {
      const existing = document.getElementById('ld-project')
      if (existing) existing.remove()
    }
  }, [location.pathname, project, siteUrl, seo])

  return null
}
