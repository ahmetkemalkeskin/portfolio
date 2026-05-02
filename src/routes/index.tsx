import { createFileRoute, Link } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { allProjects, allSiteSettings, allSkillCategories } from 'content-collections'
import { useEffect, useMemo, useRef, useState } from 'react'

const getHomeData = createServerFn({ method: 'GET' }).handler(async () => {
  const featured = allProjects
    .filter((p) => p.featured)
    .sort((a, b) => a.order - b.order)
    .slice(0, 6)
  const settings = allSiteSettings[0] ?? null
  const skillCategories = [...allSkillCategories].sort((a, b) => a.order - b.order)
  return { featured, settings, skillCategories }
})

export const Route = createFileRoute('/')({
  loader: () => getHomeData(),
  component: HomePage,
})

function useFadeIn(dep?: unknown) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!ref.current) return
    const els = ref.current.querySelectorAll<HTMLElement>('.fade-in')
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('visible')),
      { threshold: 0.1 },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dep])
  return ref
}

type HomeProject = {
  id: string
  title: string
  description: string
  tags: string[]
  category?: string
  coverImage?: string
  galleryImages?: string[]
  youtubeUrl?: string
}

function isImageIcon(icon: string) {
  return icon.startsWith('data:image/') || icon.startsWith('http://') || icon.startsWith('https://')
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

function getProjectImages(project: HomeProject) {
  return [project.coverImage, ...(project.galleryImages ?? [])].filter((img): img is string => Boolean(img))
}

function normalizeImageIndex(index: number, total: number) {
  if (total <= 0) return 0
  return ((index % total) + total) % total
}

function HomePage() {
  const { featured, settings, skillCategories } = Route.useLoaderData()
  const pageRef = useFadeIn()
  const [carouselById, setCarouselById] = useState<Record<string, number>>({})

  const siteName = settings?.siteName?.trim() || 'Ahmet Kemal Keskin'
  const siteTagline = settings?.siteTitle?.trim() || '3D Artist | Game Developer | Graphic Designer'

  const featuredProjects = useMemo<HomeProject[]>(
    () =>
      featured.map((project, index) => ({
        id: `seed-${index}-${project._meta.path}`,
        title: project.title,
        description: project.description ?? '',
        tags: project.tags ?? [],
        category: project.category,
        coverImage: project.coverImage ?? project.image,
        galleryImages: project.gallery ?? [],
        youtubeUrl: project.youtubeUrl,
      })),
    [featured],
  )

  const quickSkills = useMemo(() => {
    const flat = skillCategories.flatMap((cat) => (cat.items ?? []).map((item) => ({
      name: item.name,
      icon: '✨' as const,
    })))
    const names = flat.map((s) => s.name)
    const unique = [...new Set(names)].map((name) => ({ name, icon: '✨' as string }))
    return unique.slice(0, 16)
  }, [skillCategories])

  const bumpCarousel = (id: string, direction: 1 | -1) => {
    const project = featuredProjects.find((p) => p.id === id)
    if (!project) return
    const total = getProjectImages(project).length
    if (total <= 1) return
    setCarouselById((prev) => {
      const cur = prev[id] ?? 0
      return { ...prev, [id]: normalizeImageIndex(cur + direction, total) }
    })
  }

  const displayImage = (project: HomeProject) => {
    const imgs = getProjectImages(project)
    if (!imgs.length) {
      return project.youtubeUrl ? toThumbnailUrl(project.youtubeUrl) : undefined
    }
    const idx = normalizeImageIndex(carouselById[project.id] ?? 0, imgs.length)
    return imgs[idx]
  }

  return (
    <div ref={pageRef} style={{ minHeight: '100vh' }}>
      <section
        style={{
          position: 'relative',
          minHeight: 'calc(100vh - 64px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          overflow: 'hidden',
          padding: '4rem 1.5rem',
        }}
      >
        <div className="ambient-glow ambient-glow-cyan" style={{ top: '-100px', left: '20%', position: 'absolute' }} />
        <div className="ambient-glow ambient-glow-purple" style={{ bottom: '0', right: '10%', position: 'absolute' }} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '820px' }}>
          <p className="hero-title" style={{ color: 'var(--accent-cyan)', fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '1rem' }}>
            Welcome to my portfolio
          </p>
          <h1 className="hero-title" style={{ fontSize: 'clamp(2.5rem, 7vw, 5rem)', fontWeight: 700, lineHeight: 1.08, marginBottom: '1.5rem' }}>
            {siteName}
            <br />
            <span className="gradient-text">{siteTagline}</span>
          </h1>
          <p className="hero-subtitle" style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', maxWidth: '560px', margin: '0 auto 2.5rem', lineHeight: 1.7 }}>
            Creating immersive 3D worlds, games, and visual experiences with Blender & Unity
          </p>
          <div className="hero-cta" style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/projects" className="btn-primary">View Projects</Link>
            <Link to="/contact" className="btn-outline">Get in Touch</Link>
          </div>
          <div style={{ marginTop: '4rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            <span>Scroll</span>
            <div style={{ width: '1px', height: '40px', background: 'linear-gradient(to bottom, var(--accent-cyan), transparent)' }} />
          </div>
        </div>
      </section>

      <hr className="glow-line" />

      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '6rem 1.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <p className="fade-in" style={{ color: 'var(--accent-cyan)', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            Selected Work
          </p>
          <h2 className="section-title fade-in fade-in-delay-1">Featured Projects</h2>
          <p className="section-subtitle fade-in fade-in-delay-2">A curated selection of my latest work</p>
        </div>

        <div className="home-project-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '1.5rem', alignItems: 'stretch' }}>
          {featuredProjects.map((project) => {
            const shown = displayImage(project)
            const totalImages = getProjectImages(project).length
            const activeIndex = normalizeImageIndex(carouselById[project.id] ?? 0, Math.max(totalImages, 1))
            return (
              <div key={project.id} className="glass-card fade-in home-project-card" style={{ overflow: 'hidden' }}>
                <div className="img-placeholder" style={{ height: '200px', borderRadius: 'var(--radius) var(--radius) 0 0', position: 'relative' }}>
                  {shown ? (
                    <img src={shown} alt={project.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <span style={{ fontSize: '0.85rem' }}>📸 {project.title}</span>
                  )}
                  {totalImages > 1 && (
                    <>
                      <div
                        style={{
                          position: 'absolute',
                          left: '50%',
                          top: '0.55rem',
                          transform: 'translateX(-50%)',
                          padding: '0.2rem 0.5rem',
                          borderRadius: '999px',
                          border: '1px solid rgba(255,255,255,0.2)',
                          background: 'rgba(0,0,0,0.55)',
                          color: '#e2e8f0',
                          fontSize: '0.7rem',
                          fontWeight: 600,
                          pointerEvents: 'none',
                        }}
                      >
                        {activeIndex + 1}
                        {' '}
                        /
                        {' '}
                        {totalImages}
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          bumpCarousel(project.id, -1)
                        }}
                        style={{ position: 'absolute', left: '0.7rem', top: '50%', transform: 'translateY(-50%)', width: '34px', height: '34px', borderRadius: '999px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.55)', color: '#fff', cursor: 'pointer', fontSize: '1.05rem', lineHeight: 1 }}
                      >
                        ‹
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          bumpCarousel(project.id, 1)
                        }}
                        style={{ position: 'absolute', right: '0.7rem', top: '50%', transform: 'translateY(-50%)', width: '34px', height: '34px', borderRadius: '999px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.55)', color: '#fff', cursor: 'pointer', fontSize: '1.05rem', lineHeight: 1 }}
                      >
                        ›
                      </button>
                    </>
                  )}
                </div>
                <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.7rem', minHeight: '170px' }}>
                  {project.category && (
                    <span className="tag tag-purple" style={{ marginBottom: '0.6rem', display: 'inline-block' }}>{project.category}</span>
                  )}
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 600, margin: 0, color: 'var(--text-primary)' }}>{project.title}</h3>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>
                    {project.description?.slice(0, 110)}…
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: 'auto' }}>
                    {project.tags?.slice(0, 3).map((tag) => (
                      <span key={tag} className="tag">{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
          <Link to="/projects" className="btn-outline">View All Projects →</Link>
        </div>
      </section>

      <hr className="glow-line" />

      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '6rem 1.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <p className="fade-in" style={{ color: 'var(--accent-cyan)', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            Expertise
          </p>
          <h2 className="section-title fade-in fade-in-delay-1">Skills & Tools</h2>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center' }}>
          {quickSkills.map((s, i) => (
            <div key={s.name} className={`glass-card fade-in fade-in-delay-${Math.min(i + 1, 5)}`} style={{ padding: '0.9rem 1.4rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              {isImageIcon(s.icon) ? (
                <img src={s.icon} alt={`${s.name} icon`} style={{ width: '28px', height: '28px', borderRadius: '8px', objectFit: 'cover' }} />
              ) : (
                <span style={{ fontSize: '1.3rem' }}>{s.icon}</span>
              )}
              <span style={{ fontWeight: 500, fontSize: '0.9rem' }}>{s.name}</span>
            </div>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
          <Link to="/skills" className="btn-outline">See Full Skills →</Link>
        </div>
      </section>

      <style>{`
        @media (max-width: 1080px) {
          .home-project-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          }
        }
        @media (max-width: 720px) {
          .home-project-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  )
}
