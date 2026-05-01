import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { allAbouts } from 'content-collections'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useEditMode } from '../hooks/useEditMode'

const getAboutData = createServerFn({ method: 'GET' }).handler(async () => {
  const about = allAbouts[0] ?? null
  return { about }
})

export const Route = createFileRoute('/about')({
  loader: () => getAboutData(),
  component: AboutPage,
})

type SocialKey = 'github' | 'linkedin' | 'behance'
type SocialEntry = { key: SocialKey; label: string; icon: string; url: string }
type InfoRow = { id: string; label: string; value: string }
type StatItem = { id: string; value: string; label: string }

type AboutEditableState = {
  profileImage: string
  title: string
  bio: string
  infoRows: InfoRow[]
  stats: StatItem[]
}

const SOCIAL_STORAGE = 'portfolio.socials'
const ABOUT_STORAGE = 'portfolio.about.editable'

const SOCIAL_DEFAULTS: SocialEntry[] = [
  { key: 'github', label: 'GitHub', icon: 'GH', url: 'https://github.com/' },
  { key: 'linkedin', label: 'LinkedIn', icon: 'in', url: 'https://linkedin.com/' },
  { key: 'behance', label: 'Behance', icon: 'Be', url: 'https://behance.net/' },
]

function fileToBase64(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result ?? ''))
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsDataURL(file)
  })
}

function compressImage(file: File, maxWidth: number, quality = 0.74) {
  return new Promise<string>(async (resolve, reject) => {
    try {
      const source = await fileToBase64(file)
      const img = new Image()
      img.onload = () => {
        const ratio = img.width > maxWidth ? maxWidth / img.width : 1
        const width = Math.max(1, Math.round(img.width * ratio))
        const height = Math.max(1, Math.round(img.height * ratio))
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        if (!ctx) {
          reject(new Error('Canvas context not available'))
          return
        }
        ctx.drawImage(img, 0, 0, width, height)
        resolve(canvas.toDataURL('image/jpeg', quality))
      }
      img.onerror = () => reject(new Error('Image decode failed'))
      img.src = source
    } catch (error) {
      reject(error)
    }
  })
}

function AboutPage() {
  const { about } = Route.useLoaderData()
  const { isEditMode } = useEditMode()
  const ref = useRef<HTMLDivElement>(null)
  const [socials, setSocials] = useState<SocialEntry[]>(SOCIAL_DEFAULTS)

  const defaultAbout: AboutEditableState = useMemo(() => ({
    profileImage: about?.profileImage ?? '',
    title: about?.title ?? '3D Artist & Game Developer',
    bio: about?.bio ?? 'Passionate 3D artist and game developer creating immersive worlds, game environments, and visual storytelling experiences with Blender and Unity.',
    infoRows: [
      { id: 'name', label: 'Name', value: about?.name ?? 'Ahmet Kemal Keskin' },
      { id: 'email', label: 'Email', value: about?.email ?? 'ahmetkemal608@gmail.com' },
      { id: 'location', label: 'Location', value: about?.location ?? 'Turkey' },
      { id: 'languages', label: 'Languages', value: 'Turkish, English' },
    ],
    stats: [
      { id: 's1', value: '1+', label: 'Years of Experience' },
      { id: 's2', value: '5+', label: 'Completed Projects' },
      { id: 's3', value: '8+', label: 'Tools Used' },
      { id: 's4', value: '100%', label: 'Passion' },
    ],
  }), [about])

  const [aboutState, setAboutState] = useState<AboutEditableState>(defaultAbout)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const rawSocials = localStorage.getItem(SOCIAL_STORAGE)
      if (rawSocials) {
        const parsed = JSON.parse(rawSocials) as SocialEntry[]
        if (Array.isArray(parsed)) setSocials(parsed)
      }

      const rawAbout = localStorage.getItem(ABOUT_STORAGE)
      if (rawAbout) {
        const parsed = JSON.parse(rawAbout) as AboutEditableState
        if (parsed && Array.isArray(parsed.infoRows) && Array.isArray(parsed.stats)) {
          setAboutState(parsed)
        }
      }
    } catch {
      // fallback defaults
    } finally {
      setHydrated(true)
    }
  }, [])

  useEffect(() => {
    if (!hydrated) return
    try {
      localStorage.setItem(SOCIAL_STORAGE, JSON.stringify(socials))
      localStorage.setItem(ABOUT_STORAGE, JSON.stringify(aboutState))
    } catch {
      window.alert('Could not save about data: local storage is full.')
    }
  }, [socials, aboutState, hydrated])

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

  const editSocial = (key: SocialKey) => {
    const current = socials.find((entry) => entry.key === key)
    const next = window.prompt(`Update ${current?.label} URL:`, current?.url ?? '')
    if (!next) return
    setSocials((prev) => prev.map((entry) => (entry.key === key ? { ...entry, url: next.trim() } : entry)))
  }

  const editInfoRow = (id: string) => {
    const row = aboutState.infoRows.find((item) => item.id === id)
    if (!row) return
    const nextLabel = window.prompt('Field label:', row.label)
    if (!nextLabel) return
    const nextValue = window.prompt('Field value:', row.value)
    if (nextValue == null) return
    setAboutState((prev) => ({
      ...prev,
      infoRows: prev.infoRows.map((item) => (item.id === id ? { ...item, label: nextLabel.trim(), value: nextValue.trim() } : item)),
    }))
  }

  const addInfoRow = () => {
    const label = window.prompt('New field label:')
    if (!label) return
    const value = window.prompt('New field value:')
    if (value == null) return
    setAboutState((prev) => ({
      ...prev,
      infoRows: [...prev.infoRows, { id: `row-${Date.now()}`, label: label.trim(), value: value.trim() }],
    }))
  }

  const removeInfoRow = (id: string) => {
    setAboutState((prev) => ({ ...prev, infoRows: prev.infoRows.filter((item) => item.id !== id) }))
  }

  const editStat = (id: string) => {
    const stat = aboutState.stats.find((item) => item.id === id)
    if (!stat) return
    const nextValue = window.prompt('Stat value:', stat.value)
    if (!nextValue) return
    const nextLabel = window.prompt('Stat label:', stat.label)
    if (!nextLabel) return
    setAboutState((prev) => ({
      ...prev,
      stats: prev.stats.map((item) => (item.id === id ? { ...item, value: nextValue.trim(), label: nextLabel.trim() } : item)),
    }))
  }

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
                {aboutState.profileImage
                  ? <img src={aboutState.profileImage} alt={about?.name ?? 'Profile'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <span style={{ fontSize: '4rem' }}>??</span>
                }
              </div>
            </div>

            {isEditMode && (
              <label className="btn-outline" style={{ marginBottom: '1.5rem', display: 'inline-flex', cursor: 'pointer' }}>
                Upload Profile Image
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={async (e) => {
                    const file = e.target.files?.[0]
                    if (!file) return
                    const encoded = await compressImage(file, 1200, 0.75)
                    setAboutState((prev) => ({ ...prev, profileImage: encoded }))
                  }}
                />
              </label>
            )}

            <div className="glass-card fade-in fade-in-delay-1" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--accent-cyan)', margin: 0 }}>Personal Info</h3>
                {isEditMode && <button type="button" className="btn-outline" style={{ padding: '0.35rem 0.7rem', fontSize: '0.82rem' }} onClick={addInfoRow}>+ Add</button>}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {aboutState.infoRows.map((row) => (
                  <div key={row.id} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '0.6rem', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                    {isEditMode ? (
                      <button type="button" onClick={() => editInfoRow(row.id)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.85rem', textAlign: 'left', cursor: 'pointer' }}>{row.label}</button>
                    ) : (
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textAlign: 'left' }}>{row.label}</span>
                    )}
                    {isEditMode ? (
                      <button type="button" onClick={() => editInfoRow(row.id)} style={{ background: 'none', border: 'none', color: 'var(--text-primary)', fontSize: '0.9rem', fontWeight: 500, textAlign: 'left', cursor: 'pointer' }}>{row.value}</button>
                    ) : (
                      <span style={{ color: 'var(--text-primary)', fontSize: '0.9rem', fontWeight: 500, textAlign: 'left' }}>{row.value}</span>
                    )}
                    {isEditMode && <button type="button" className="btn-outline" onClick={() => removeInfoRow(row.id)} style={{ width: '28px', height: '28px', padding: 0, justifyContent: 'center' }}>X</button>}
                  </div>
                ))}
              </div>

              {about?.cvFile && (
                <a href={about.cvFile} download className="btn-primary" style={{ display: 'flex', justifyContent: 'center', marginTop: '1.5rem', textAlign: 'center' }}>
                  Download CV
                </a>
              )}
            </div>

            <div className="glass-card fade-in fade-in-delay-2" style={{ padding: '1.5rem', marginTop: '1.5rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--accent-cyan)' }}>Social Profiles</h3>
              <div style={{ display: 'grid', gap: '0.75rem' }}>
                {socials.map((social) => (
                  <div key={social.key} style={{ display: 'grid', gridTemplateColumns: '40px 1fr auto', gap: '0.5rem', alignItems: 'center' }}>
                    <a href={social.url} target="_blank" rel="noopener noreferrer" className="social-btn" title={social.label} style={{ width: '40px', height: '40px', borderRadius: '10px', fontWeight: 700, fontSize: '0.9rem' }}>
                      {social.icon}
                    </a>
                    {isEditMode ? (
                      <button
                        type="button"
                        onClick={() => editSocial(social.key)}
                        style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.85rem', overflowWrap: 'anywhere', textAlign: 'left', cursor: 'pointer' }}
                      >
                        {social.url}
                      </button>
                    ) : (
                      <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', overflowWrap: 'anywhere' }}>{social.url}</span>
                    )}
                    {isEditMode && <button type="button" className="btn-outline" onClick={() => editSocial(social.key)} style={{ padding: '0.4rem 0.7rem', fontSize: '0.8rem' }}>Edit</button>}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <div className="glass-card fade-in fade-in-delay-1" style={{ padding: '2.5rem' }}>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '1rem' }}>
                Hi, I am <span className="gradient-text">{about?.name ?? 'Ahmet Kemal Keskin'}</span>
              </h2>

              {isEditMode ? (
                <button
                  type="button"
                  onClick={() => {
                    const next = window.prompt('Job title:', aboutState.title)
                    if (!next) return
                    setAboutState((prev) => ({ ...prev, title: next.trim() }))
                  }}
                  style={{ background: 'none', border: 'none', color: 'var(--accent-purple)', fontWeight: 600, marginBottom: '1.2rem', fontSize: '1rem', cursor: 'pointer', padding: 0 }}
                >
                  {aboutState.title}
                </button>
              ) : (
                <p style={{ color: 'var(--accent-purple)', fontWeight: 600, marginBottom: '1.2rem', fontSize: '1rem' }}>{aboutState.title}</p>
              )}

              {isEditMode ? (
                <button
                  type="button"
                  onClick={() => {
                    const next = window.prompt('Bio text:', aboutState.bio)
                    if (!next) return
                    setAboutState((prev) => ({ ...prev, bio: next.trim() }))
                  }}
                  style={{ background: 'none', border: 'none', fontSize: '1.05rem', lineHeight: 1.8, color: 'var(--text-secondary)', cursor: 'pointer', padding: 0, textAlign: 'left' }}
                >
                  {aboutState.bio}
                </button>
              ) : (
                <p style={{ fontSize: '1.05rem', lineHeight: 1.8, color: 'var(--text-secondary)', margin: 0 }}>{aboutState.bio}</p>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '2.5rem' }}>
                {aboutState.stats.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => isEditMode && editStat(item.id)}
                    style={{ textAlign: 'center', padding: '1.25rem', background: 'rgba(0,212,255,0.04)', borderRadius: 'var(--radius)', border: '1px solid rgba(0,212,255,0.1)', cursor: isEditMode ? 'pointer' : 'default' }}
                  >
                    <div className="gradient-text" style={{ fontSize: '1.8rem', fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif" }}>{item.value}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>{item.label}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
