import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { allAbouts, allSiteSettings } from 'content-collections'
import { useEffect, useMemo, useRef } from 'react'

const STAT_ITEMS = [
  { id: 's1', value: '1+', label: 'Years of Experience' },
  { id: 's2', value: '5+', label: 'Completed Projects' },
  { id: 's3', value: '8+', label: 'Tools Used' },
  { id: 's4', value: '100%', label: 'Passion' },
] as const

const getAboutData = createServerFn({ method: 'GET' }).handler(async () => {
  const about = allAbouts[0] ?? null
  const settings = allSiteSettings[0] ?? null
  return { about, settings }
})

export const Route = createFileRoute('/about')({
  loader: () => getAboutData(),
  component: AboutPage,
})

type SocialEntry = { key: string; label: string; icon: string; url: string }

function AboutPage() {
  const { about, settings } = Route.useLoaderData()
  const ref = useRef<HTMLDivElement>(null)

  const socials = useMemo((): SocialEntry[] => {
    const rows: { key: string; label: string; icon: string; url?: string }[] = [
      { key: 'github', label: 'GitHub', icon: 'GH', url: settings?.github },
      { key: 'linkedin', label: 'LinkedIn', icon: 'in', url: settings?.linkedin },
      { key: 'youtube', label: 'YouTube', icon: '▶', url: settings?.youtube },
      { key: 'instagram', label: 'Instagram', icon: '◎', url: settings?.instagram },
    ]
    return rows.filter((r): r is SocialEntry => Boolean(r.url?.trim()))
  }, [settings])

  const infoRows = useMemo(
    () =>
      [
        { id: 'name', label: 'Name', value: about?.name ?? '' },
        { id: 'email', label: 'Email', value: about?.email ?? '' },
        { id: 'location', label: 'Location', value: about?.location ?? '' },
        { id: 'languages', label: 'Languages', value: about?.languages ?? '' },
      ].filter((row) => row.value),
    [about],
  )

  const title = about?.title ?? '3D Artist & Game Developer'
  const bio =
    about?.bio
    ?? 'Passionate 3D artist and game developer creating immersive worlds, game environments, and visual storytelling experiences with Blender and Unity.'

  useEffect(() => {
    if (!ref.current) return
    const els = ref.current.querySelectorAll<HTMLElement>('.fade-in')
    const io = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add('visible')),
      { threshold: 0.1 },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  return (
    <div ref={ref} style={{ minHeight: '100vh', padding: '5rem 1.5rem' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <div className="fade-in" style={{ marginBottom: '4rem', textAlign: 'center' }}>
          <p style={{ color: 'var(--accent-cyan)', fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            Get to know me
          </p>
          <h1 className="section-title">About</h1>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', alignItems: 'start' }}>
          <div>
            <div className="fade-in glass-card" style={{ overflow: 'hidden', marginBottom: '1rem' }}>
              <div className="img-placeholder" style={{ height: '360px', position: 'relative' }}>
                {about?.profileImage ? (
                  <img src={about.profileImage} alt={about?.name ?? 'Profile'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <span style={{ fontSize: '4rem' }}>??</span>
                )}
              </div>
            </div>

            <div className="glass-card fade-in fade-in-delay-1" style={{ padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--accent-cyan)', marginBottom: '1rem' }}>Personal Info</h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {infoRows.map((row) => (
                  <div key={row.id} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textAlign: 'left' }}>{row.label}</span>
                    <span style={{ color: 'var(--text-primary)', fontSize: '0.9rem', fontWeight: 500, textAlign: 'left' }}>{row.value}</span>
                  </div>
                ))}
              </div>

              {about?.cvFile && (
                <a href={about.cvFile} download className="btn-primary" style={{ display: 'flex', justifyContent: 'center', marginTop: '1.5rem', textAlign: 'center' }}>
                  Download CV
                </a>
              )}
            </div>

            {socials.length > 0 && (
              <div className="glass-card fade-in fade-in-delay-2" style={{ padding: '1.5rem', marginTop: '1.5rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--accent-cyan)' }}>Social Profiles</h3>
                <div style={{ display: 'grid', gap: '0.75rem' }}>
                  {socials.map((social) => (
                    <div key={social.key} style={{ display: 'grid', gridTemplateColumns: '40px 1fr', gap: '0.5rem', alignItems: 'center' }}>
                      <a href={social.url} target="_blank" rel="noopener noreferrer" className="social-btn" title={social.label} style={{ width: '40px', height: '40px', borderRadius: '10px', fontWeight: 700, fontSize: '0.9rem' }}>
                        {social.icon}
                      </a>
                      <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', overflowWrap: 'anywhere' }}>{social.url}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div>
            <div className="glass-card fade-in fade-in-delay-1" style={{ padding: '2.5rem' }}>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '1rem' }}>
                Hi, I am <span className="gradient-text">{about?.name ?? 'Creator'}</span>
              </h2>

              <p style={{ color: 'var(--accent-purple)', fontWeight: 600, marginBottom: '1.2rem', fontSize: '1rem' }}>{title}</p>

              <p style={{ fontSize: '1.05rem', lineHeight: 1.8, color: 'var(--text-secondary)', margin: 0 }}>{bio}</p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '2.5rem' }}>
                {STAT_ITEMS.map((item) => (
                  <div
                    key={item.id}
                    style={{ textAlign: 'center', padding: '1.25rem', background: 'rgba(0,212,255,0.04)', borderRadius: 'var(--radius)', border: '1px solid rgba(0,212,255,0.1)' }}
                  >
                    <div className="gradient-text" style={{ fontSize: '1.8rem', fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif" }}>{item.value}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>{item.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
