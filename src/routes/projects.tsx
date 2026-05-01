import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { allProjects } from 'content-collections'
import { useEffect, useRef, useState } from 'react'
import { useEditMode } from '../hooks/useEditMode'

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
  currentImageIndex?: number
}

type ProjectFormState = {
  title: string
  description: string
  tags: string
  coverImage?: string
  galleryImages: string[]
  youtubeUrl: string
}

const STORAGE_KEY = 'portfolio.projects'

function fileToBase64(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result ?? ''))
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsDataURL(file)
  })
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

function toEmbedUrl(url?: string) {
  if (!url) return ''
  const id = getYouTubeId(url)
  return id ? `https://www.youtube.com/embed/${id}` : url
}

function toThumbnailUrl(url?: string) {
  const id = url ? getYouTubeId(url) : ''
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : ''
}

function compressImage(file: File, maxWidth: number, quality = 0.72) {
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
        if (!ctx) return reject(new Error('Canvas context not available'))
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

function ProjectEditorModal({
  project,
  onClose,
  onSave,
}: {
  project: ProjectEntry
  onClose: () => void
  onSave: (next: ProjectEntry) => void
}) {
  const [form, setForm] = useState<ProjectFormState>({
    title: project.title,
    description: project.description,
    tags: project.tags.join(', '),
    coverImage: project.coverImage,
    galleryImages: project.galleryImages,
    youtubeUrl: project.youtubeUrl ?? '',
  })
  const [uploadError, setUploadError] = useState('')

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  const save = () => {
    if (!form.title.trim() || !form.description.trim()) return
    onSave({
      ...project,
      title: form.title.trim(),
      description: form.description.trim(),
      tags: form.tags.split(',').map((v) => v.trim()).filter(Boolean),
      coverImage: form.coverImage,
      galleryImages: form.galleryImages,
      youtubeUrl: form.youtubeUrl.trim(),
    })
    onClose()
  }

  const embedUrl = toEmbedUrl(form.youtubeUrl)

  return (
    <div className="lightbox-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="glass-card" style={{ width: '100%', maxWidth: '820px', maxHeight: '90vh', overflow: 'auto', padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 style={{ margin: 0, fontSize: '1.3rem' }}>Edit Project</h2>
          <button type="button" className="btn-outline" onClick={onClose} style={{ width: '36px', height: '36px', padding: 0, justifyContent: 'center' }}>X</button>
        </div>

        <div style={{ display: 'grid', gap: '0.75rem' }}>
          <input className="form-input" placeholder="Title" value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} />
          <textarea className="form-input" placeholder="Description" rows={3} value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} />

          <label style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Cover Image</label>
          <input
            type="file"
            accept="image/*"
            className="form-input"
            onChange={async (e) => {
              try {
                const file = e.target.files?.[0]
                if (!file) return
                const encoded = await compressImage(file, 1200, 0.74)
                setForm((p) => ({ ...p, coverImage: encoded }))
                setUploadError('')
              } catch {
                setUploadError('Cover image could not be processed.')
              }
            }}
          />

          <label style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Gallery Images</label>
          <input
            type="file"
            multiple
            accept="image/*"
            className="form-input"
            onChange={async (e) => {
              try {
                const files = Array.from(e.target.files ?? [])
                if (!files.length) return
                const encoded = await Promise.all(files.slice(0, 6).map((file) => compressImage(file, 960, 0.68)))
                setForm((p) => ({ ...p, galleryImages: encoded }))
                setUploadError('')
              } catch {
                setUploadError('Gallery images could not be processed.')
              }
            }}
          />

          <input className="form-input" placeholder="YouTube URL" value={form.youtubeUrl} onChange={(e) => setForm((p) => ({ ...p, youtubeUrl: e.target.value }))} />
          <input className="form-input" placeholder="Tags (comma separated)" value={form.tags} onChange={(e) => setForm((p) => ({ ...p, tags: e.target.value }))} />

          {uploadError && <p style={{ margin: 0, color: '#fca5a5', fontSize: '0.85rem' }}>{uploadError}</p>}

          {(form.coverImage || embedUrl) && (
            <div className="glass-card" style={{ padding: '0.75rem' }}>
              {form.coverImage ? (
                <img src={form.coverImage} alt="preview" style={{ width: '100%', maxHeight: '220px', objectFit: 'cover', borderRadius: 'var(--radius)' }} />
              ) : embedUrl ? (
                <iframe src={embedUrl} title="video preview" style={{ width: '100%', height: '220px', border: 'none', borderRadius: 'var(--radius)' }} allowFullScreen />
              ) : null}
            </div>
          )}

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button type="button" className="btn-primary" onClick={save}>Save</button>
            <button type="button" className="btn-outline" onClick={onClose}>Cancel</button>
          </div>
        </div>
      </div>
    </div>
  )
}

function createEmptyProject(): ProjectEntry {
  return {
    id: `project-${Date.now()}`,
    title: '',
    description: '',
    tags: [],
    coverImage: '',
    galleryImages: [],
    youtubeUrl: '',
    currentImageIndex: 0,
  }
}

function getProjectImages(project: ProjectEntry) {
  return [project.coverImage, ...project.galleryImages].filter((img): img is string => Boolean(img))
}

function normalizeImageIndex(index: number, total: number) {
  if (total <= 0) return 0
  return ((index % total) + total) % total
}

function normalizeProjectEntry(project: ProjectEntry): ProjectEntry {
  const total = getProjectImages(project).length
  return {
    ...project,
    currentImageIndex: normalizeImageIndex(project.currentImageIndex ?? 0, total),
  }
}

function rotateProjectCover(project: ProjectEntry, direction: 1 | -1): ProjectEntry {
  const cover = project.coverImage ?? ''
  const gallery = [...project.galleryImages]
  const total = getProjectImages(project).length
  const nextIndex = normalizeImageIndex((project.currentImageIndex ?? 0) + direction, total)
  if (!cover && gallery.length === 0) return project

  if (direction === 1) {
    if (gallery.length === 0) return project
    const [nextCover, ...rest] = gallery
    return {
      ...project,
      coverImage: nextCover,
      galleryImages: cover ? [...rest, cover] : rest,
      currentImageIndex: nextIndex,
    }
  }

  if (gallery.length === 0) return project
  const nextCover = gallery[gallery.length - 1]
  const withoutLast = gallery.slice(0, -1)
  return {
    ...project,
    coverImage: nextCover,
    galleryImages: cover ? [cover, ...withoutLast] : withoutLast,
    currentImageIndex: nextIndex,
  }
}

function ProjectsPage() {
  const { projects } = Route.useLoaderData()
  const { isEditMode } = useEditMode()
  const initialProjects: ProjectEntry[] = projects.map((project, index) => ({
    id: `seed-${index}-${project._meta.path}`,
    title: project.title,
    description: project.description,
    tags: project.tags ?? [],
    coverImage: project.coverImage ?? project.image,
    galleryImages: project.gallery ?? [],
    youtubeUrl: project.youtubeUrl,
    currentImageIndex: 0,
  }))

  const [items, setItems] = useState<ProjectEntry[]>(initialProjects)
  const [editing, setEditing] = useState<ProjectEntry | null>(null)
  const [hydrated, setHydrated] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as ProjectEntry[]
        if (Array.isArray(parsed)) setItems(parsed.map(normalizeProjectEntry))
      }
    } finally {
      setHydrated(true)
    }
  }, [])

  useEffect(() => {
    if (!hydrated) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch {
      window.alert('Could not save projects: storage is full. Please remove some images or use smaller files.')
    }
    window.dispatchEvent(new Event('portfolio:projects-updated'))
  }, [items, hydrated])

  useEffect(() => {
    if (!ref.current) return
    const els = ref.current.querySelectorAll<HTMLElement>('.fade-in:not(.visible)')
    const io = new IntersectionObserver((entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('visible')), { threshold: 0.1 })
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [items])

  return (
    <div ref={ref} style={{ minHeight: '100vh', padding: '5rem 1.5rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div className="fade-in" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
          <div>
            <p style={{ color: 'var(--accent-cyan)', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Portfolio</p>
            <h1 className="section-title" style={{ marginBottom: '0.25rem' }}>Projects</h1>
          </div>
          {isEditMode && <button type="button" className="btn-primary" onClick={() => setEditing(createEmptyProject())}>+ Add Project</button>}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
          {items.map((project, i) => {
            const videoThumb = toThumbnailUrl(project.youtubeUrl)
            const totalImages = getProjectImages(project).length
            const activeIndex = normalizeImageIndex(project.currentImageIndex ?? 0, totalImages)
            return (
              <div key={project.id} className={`glass-card fade-in fade-in-delay-${Math.min(i + 1, 5)}`} style={{ overflow: 'hidden', cursor: isEditMode ? 'pointer' : 'default' }} onClick={() => isEditMode && setEditing(project)}>
                <div style={{ height: '190px', background: 'rgba(255,255,255,0.04)', position: 'relative' }}>
                  {project.coverImage ? (
                    <img src={project.coverImage} alt={project.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
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
                          setItems((prev) => prev.map((p) => (p.id === project.id ? rotateProjectCover(p, -1) : p)))
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
                          setItems((prev) => prev.map((p) => (p.id === project.id ? rotateProjectCover(p, 1) : p)))
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
                  {isEditMode && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        setItems((prev) => prev.filter((item) => item.id !== project.id))
                      }}
                      style={{ position: 'absolute', top: '0.6rem', right: '0.6rem', width: '34px', height: '34px', borderRadius: '999px', border: '1px solid rgba(239,68,68,0.65)', background: 'rgba(239,68,68,0.15)', color: '#fca5a5', fontWeight: 700, cursor: 'pointer' }}
                    >X</button>
                  )}
                </div>
                <div style={{ padding: '1rem' }}>
                  <h3 style={{ marginTop: 0, marginBottom: '0.4rem', fontSize: '1.05rem' }}>{project.title || 'Untitled'}</h3>
                  <p style={{ marginTop: 0, marginBottom: '0.75rem', fontSize: '0.87rem' }}>{project.description || 'Click to edit project details.'}</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                    {project.tags.map((tag, idx) => <span key={`${project.id}-${idx}`} className="tag">{tag}</span>)}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {isEditMode && editing && (
        <ProjectEditorModal
          project={editing}
          onClose={() => setEditing(null)}
          onSave={(next) => {
            setItems((prev) => {
              const normalized = normalizeProjectEntry(next)
              const exists = prev.some((item) => item.id === next.id)
              return exists
                ? prev.map((item) => (item.id === next.id ? normalized : item))
                : [normalized, ...prev]
            })
          }}
        />
      )}
    </div>
  )
}
