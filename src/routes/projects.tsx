import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { allProjects } from 'content-collections'
import { useEffect, useMemo, useRef, useState } from 'react'

const getProjectsData = createServerFn({ method: 'GET' }).handler(async () => {
  const projects = allProjects.sort((a, b) => a.order - b.order)
  return { projects }
})

export const Route = createFileRoute('/projects')({
  loader: () => getProjectsData(),
  component: ProjectsPage,
})

type ProjectEntry = {
  id: string
  title: string
  description: string
  tags: string[]
  coverImage?: string
  galleryImages: string[]
  youtubeUrl?: string
}

function getYouTubeId(url: string) {
  try {
    const parsed = new URL(url)
    if (parsed.hostname.includes('youtu.be')) return parsed.pathname.replace('/', '').trim()
    if (parsed.hostname.includes('youtube.com')) {
      if (parsed.pathname.includes('/embed/')) return parsed.pathname.split('/embed/')[1]?.split('/')[0] ?? ''
      return parsed.searchParams.get('v') ?? ''
    }
    return ''
  } catch {
    return ''
  }
}

function toThumbnailUrl(url?: string) {
  const id = url ? getYouTubeId(url) : ''
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : ''
}

function getProjectImages(project: ProjectEntry) {
  return [project.coverImage, ...project.galleryImages].filter((img): img is string => Boolean(img))
}

function normalizeImageIndex(index: number, total: number) {
  if (total <= 0) return 0
  return ((index % total) + total) % total
}

function ProjectsPage() {
  const { projects } = Route.useLoaderData()
  const ref = useRef<HTMLDivElement>(null)
  const [carouselById, setCarouselById] = useState<Record<string, number>>({})

  const items: ProjectEntry[] = useMemo(
    () =>
      projects.map((project, index) => ({
        id: `seed-${index}-${project._meta.path}`,
        title: project.title,
        description: project.description,
        tags: project.tags ?? [],
        coverImage: project.coverImage ?? project.image,
        galleryImages: project.gallery ?? [],
        youtubeUrl: project.youtubeUrl,
      })),
    [projects],
  )

  useEffect(() => {
    if (!ref.current) return
    const els = ref.current.querySelectorAll<HTMLElement>('.fade-in:not(.visible)')
    const io = new IntersectionObserver((entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('visible')), { threshold: 0.1 })
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [items])

  const bumpCarousel = (id: string, direction: 1 | -1) => {
    const project = items.find((p) => p.id === id)
    if (!project) return
    const total = getProjectImages(project).length
    if (total <= 1) return
    setCarouselById((prev) => {
      const cur = prev[id] ?? 0
      return { ...prev, [id]: normalizeImageIndex(cur + direction, total) }
    })
  }

  const displayImage = (project: ProjectEntry) => {
    const imgs = getProjectImages(project)
    if (!imgs.length) return undefined
    const idx = normalizeImageIndex(carouselById[project.id] ?? 0, imgs.length)
    return imgs[idx]
  }

  return (
    <div ref={ref} style={{ minHeight: '100vh', padding: '5rem 1.5rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div className="fade-in" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
          <div>
            <p style={{ color: 'var(--accent-cyan)', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Portfolio</p>
            <h1 className="section-title" style={{ marginBottom: '0.25rem' }}>Projects</h1>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
          {items.map((project, i) => {
            const shown = displayImage(project)
            const videoThumb = toThumbnailUrl(project.youtubeUrl)
            const totalImages = getProjectImages(project).length
            const activeIndex = normalizeImageIndex(carouselById[project.id] ?? 0, totalImages)
            return (
              <div key={project.id} className={`glass-card fade-in fade-in-delay-${Math.min(i + 1, 5)}`} style={{ overflow: 'hidden' }}>
                <div style={{ height: '190px', background: 'rgba(255,255,255,0.04)', position: 'relative' }}>
                  {shown ? (
                    <img src={shown} alt={project.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : videoThumb ? (
                    <img src={videoThumb} alt={`${project.title} preview`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div className="img-placeholder" style={{ width: '100%', height: '100%' }}><span>No cover image</span></div>
                  )}
                  {totalImages > 1 && (
                    <>
                      <div
                        style={{
                          position: 'absolute',
                          left: '50%',
                          top: '0.65rem',
                          transform: 'translateX(-50%)',
                          padding: '0.22rem 0.55rem',
                          borderRadius: '999px',
                          border: '1px solid rgba(255,255,255,0.2)',
                          background: 'rgba(0,0,0,0.55)',
                          color: '#e2e8f0',
                          fontSize: '0.72rem',
                          fontWeight: 600,
                          letterSpacing: '0.02em',
                          pointerEvents: 'none',
                        }}
                      >
                        {activeIndex + 1} / {totalImages}
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          bumpCarousel(project.id, -1)
                        }}
                        style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', width: '38px', height: '38px', borderRadius: '999px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.55)', color: '#fff', cursor: 'pointer', fontSize: '1.15rem', lineHeight: 1, transition: 'transform 0.15s ease, background 0.15s ease, box-shadow 0.15s ease' }}
                        onMouseDown={(e) => { e.currentTarget.style.transform = 'translateY(-50%) scale(0.92)' }}
                        onMouseUp={(e) => { e.currentTarget.style.transform = 'translateY(-50%) scale(1)' }}
                        onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(-50%) scale(1)' }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.background = 'rgba(0,0,0,0.7)'
                          e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.35)'
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.background = 'rgba(0,0,0,0.55)'
                          e.currentTarget.style.boxShadow = 'none'
                        }}
                      >
                        ‹
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          bumpCarousel(project.id, 1)
                        }}
                        style={{ position: 'absolute', right: '0.9rem', top: '50%', transform: 'translateY(-50%)', width: '38px', height: '38px', borderRadius: '999px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.55)', color: '#fff', cursor: 'pointer', fontSize: '1.15rem', lineHeight: 1, transition: 'transform 0.15s ease, background 0.15s ease, box-shadow 0.15s ease' }}
                        onMouseDown={(e) => { e.currentTarget.style.transform = 'translateY(-50%) scale(0.92)' }}
                        onMouseUp={(e) => { e.currentTarget.style.transform = 'translateY(-50%) scale(1)' }}
                        onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(-50%) scale(1)' }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.background = 'rgba(0,0,0,0.7)'
                          e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.35)'
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.background = 'rgba(0,0,0,0.55)'
                          e.currentTarget.style.boxShadow = 'none'
                        }}
                      >
                        ›
                      </button>
                    </>
                  )}
                </div>
                <div style={{ padding: '1rem' }}>
                  <h3 style={{ marginTop: 0, marginBottom: '0.4rem', fontSize: '1.05rem' }}>{project.title || 'Untitled'}</h3>
                  <p style={{ marginTop: 0, marginBottom: '0.75rem', fontSize: '0.87rem' }}>{project.description || 'No description.'}</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                    {project.tags.map((tag, idx) => (
                      <span key={`${project.id}-${idx}`} className="tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
