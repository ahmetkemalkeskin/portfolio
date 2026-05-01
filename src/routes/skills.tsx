import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useRef, useState } from 'react'
import { useEditMode } from '../hooks/useEditMode'

export const Route = createFileRoute('/skills')({
  component: SkillsPage,
})

const LEVELS = ['Beginner', 'Normal', 'Good', 'Very Good', 'Expert'] as const
type SkillLevel = (typeof LEVELS)[number]
type SkillItem = { id: string; name: string; icon: string; level: SkillLevel; showOnHome: boolean }

const DEFAULT_SKILLS: SkillItem[] = [
  { id: 's1', name: 'Blender', icon: '🎨', level: 'Expert', showOnHome: true },
  { id: 's2', name: 'Unity', icon: '🎮', level: 'Very Good', showOnHome: true },
  { id: 's3', name: 'C#', icon: '💻', level: 'Good', showOnHome: true },
  { id: 's4', name: '3D Modeling', icon: '🗿', level: 'Expert', showOnHome: true },
  { id: 's5', name: 'Texturing', icon: '🖌️', level: 'Very Good', showOnHome: true },
  { id: 's6', name: 'Lighting', icon: '💡', level: 'Good', showOnHome: true },
  { id: 's7', name: 'Game Design', icon: '🕹️', level: 'Good', showOnHome: true },
  { id: 's8', name: 'Animation', icon: '🎬', level: 'Normal', showOnHome: true },
  { id: 's9', name: 'Graphic Design', icon: '✨', level: 'Very Good', showOnHome: true },
]

function normalizeSkill(raw: Partial<SkillItem>): SkillItem | null {
  if (!raw.id || !raw.name || !raw.level) return null
  if (!LEVELS.includes(raw.level)) return null
  return {
    id: raw.id,
    name: raw.name,
    icon: (raw.icon ?? '✨').trim() || '✨',
    level: raw.level,
    showOnHome: raw.showOnHome ?? true,
  }
}

function isImageIcon(icon: string) {
  return icon.startsWith('data:image/') || icon.startsWith('http://') || icon.startsWith('https://')
}

function fileToBase64(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result ?? ''))
    reader.onerror = () => reject(new Error('Failed to read icon file'))
    reader.readAsDataURL(file)
  })
}

function compressIcon(file: File, size = 96, quality = 0.8) {
  return new Promise<string>(async (resolve, reject) => {
    try {
      const source = await fileToBase64(file)
      const image = new Image()
      image.onload = () => {
        const canvas = document.createElement('canvas')
        canvas.width = size
        canvas.height = size
        const ctx = canvas.getContext('2d')
        if (!ctx) return reject(new Error('Canvas context not available'))
        ctx.clearRect(0, 0, size, size)
        ctx.drawImage(image, 0, 0, size, size)
        resolve(canvas.toDataURL('image/png', quality))
      }
      image.onerror = () => reject(new Error('Icon decode failed'))
      image.src = source
    } catch (error) {
      reject(error)
    }
  })
}

function SkillsPage() {
  const ref = useRef<HTMLDivElement>(null)
  const { isEditMode } = useEditMode()
  const [skills, setSkills] = useState<SkillItem[]>(DEFAULT_SKILLS)
  const [showAdd, setShowAdd] = useState(false)
  const [newSkillName, setNewSkillName] = useState('')
  const [newSkillIcon, setNewSkillIcon] = useState('')
  const [iconUploadError, setIconUploadError] = useState('')
  const [newSkillLevel, setNewSkillLevel] = useState<SkillLevel>('Normal')
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem('portfolio.skills')
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<SkillItem>[]
        if (Array.isArray(parsed)) {
          const normalized = parsed.map(normalizeSkill).filter((item): item is SkillItem => Boolean(item))
          setSkills(normalized)
        }
      }
    } catch {
      // fallback to defaults
    } finally {
      setHydrated(true)
    }
  }, [])

  useEffect(() => {
    if (!hydrated) return
    try {
      localStorage.setItem('portfolio.skills', JSON.stringify(skills))
    } catch {
      window.alert('Could not save skills: storage is full.')
    }
    window.dispatchEvent(new Event('portfolio:skills-updated'))
  }, [skills, hydrated])

  useEffect(() => {
    if (!ref.current) return
    const els = ref.current.querySelectorAll<HTMLElement>('.fade-in')
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('visible')
        }
      }),
      { threshold: 0.1 }
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  const addSkill = () => {
    const trimmed = newSkillName.trim()
    if (!trimmed) return
    setSkills((prev) => [
      ...prev,
      {
        id: `s-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        name: trimmed,
        icon: newSkillIcon || '✨',
        level: newSkillLevel,
        showOnHome: true,
      },
    ])
    setNewSkillName('')
    setNewSkillIcon('')
    setIconUploadError('')
    setNewSkillLevel('Normal')
    setShowAdd(false)
  }

  const deleteSkill = (id: string) => {
    setSkills((prev) => prev.filter((skill) => skill.id !== id))
  }

  const toggleShowOnHome = (id: string) => {
    setSkills((prev) => prev.map((skill) => (
      skill.id === id ? { ...skill, showOnHome: !skill.showOnHome } : skill
    )))
  }

  return (
    <div ref={ref} style={{ minHeight: '100vh', padding: '5rem 1.5rem' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <div className="fade-in" style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <p style={{ color: 'var(--accent-cyan)', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Capabilities</p>
          <h1 className="section-title">Skills</h1>
          <p className="section-subtitle">Ticked skills appear on Home</p>
        </div>

        <div className="glass-card fade-in" style={{ padding: '1.2rem' }}>
          {skills.map((skill) => (
            <div
              key={skill.id}
              style={{
                display: 'grid',
                gridTemplateColumns: isEditMode ? 'auto 1fr auto auto auto' : 'auto 1fr auto',
                gap: '0.75rem',
                alignItems: 'center',
                padding: '0.75rem',
                borderBottom: '1px solid var(--border-color)',
              }}
            >
              {isImageIcon(skill.icon) ? (
                <img
                  src={skill.icon}
                  alt={`${skill.name} icon`}
                  style={{ width: '28px', height: '28px', borderRadius: '8px', objectFit: 'cover' }}
                />
              ) : (
                <span style={{ fontSize: '1.25rem', lineHeight: 1 }}>{skill.icon || '✨'}</span>
              )}
              <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{skill.name}</span>
              {isEditMode && (
                <button
                  type="button"
                  onClick={() => toggleShowOnHome(skill.id)}
                  className="btn-outline"
                  title={skill.showOnHome ? 'Shown on Home (click to hide)' : 'Hidden from Home (click to show)'}
                  style={{ width: '34px', height: '34px', padding: 0, justifyContent: 'center' }}
                >
                  {skill.showOnHome ? '✓' : '○'}
                </button>
              )}
              <span className="tag">{skill.level}</span>
              {isEditMode && (
                <button
                  type="button"
                  onClick={() => deleteSkill(skill.id)}
                  aria-label={`Delete ${skill.name}`}
                  className="btn-outline"
                  style={{ width: '34px', height: '34px', padding: 0, justifyContent: 'center' }}
                >
                  X
                </button>
              )}
            </div>
          ))}

          {isEditMode && showAdd ? (
            <div style={{ marginTop: '1rem', display: 'grid', gridTemplateColumns: '1fr auto auto auto', gap: '0.75rem', alignItems: 'center' }}>
              <input
                className="form-input"
                value={newSkillName}
                onChange={(e) => setNewSkillName(e.target.value)}
                placeholder="Skill name"
              />
              <label className="btn-outline" style={{ minWidth: '130px', justifyContent: 'center', cursor: 'pointer' }}>
                {newSkillIcon ? 'Icon Ready' : 'Upload Icon'}
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={async (e) => {
                    try {
                      const file = e.target.files?.[0]
                      if (!file) return
                      const encoded = await compressIcon(file, 96, 0.82)
                      setNewSkillIcon(encoded)
                      setIconUploadError('')
                    } catch {
                      setIconUploadError('Icon could not be processed.')
                    }
                  }}
                />
              </label>
              <select
                className="form-input"
                value={newSkillLevel}
                onChange={(e) => setNewSkillLevel(e.target.value as SkillLevel)}
                style={{ minWidth: '150px' }}
              >
                {LEVELS.map((level) => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button type="button" className="btn-primary" onClick={addSkill} style={{ padding: '0.6rem 1rem' }}>
                  Add
                </button>
                <button type="button" className="btn-outline" onClick={() => setShowAdd(false)} style={{ padding: '0.6rem 1rem' }}>
                  Cancel
                </button>
              </div>
            </div>
          ) : null}

          {isEditMode && showAdd && newSkillIcon && (
            <div style={{ marginTop: '0.6rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>Preview:</span>
              <img src={newSkillIcon} alt="Skill icon preview" style={{ width: '28px', height: '28px', borderRadius: '8px', objectFit: 'cover' }} />
            </div>
          )}

          {isEditMode && showAdd && iconUploadError && (
            <p style={{ margin: '0.5rem 0 0', color: '#fca5a5', fontSize: '0.85rem' }}>{iconUploadError}</p>
          )}

          {isEditMode && !showAdd && (
            <div style={{ marginTop: '1rem', textAlign: 'center' }}>
              <button type="button" className="btn-outline" onClick={() => setShowAdd(true)}>
                + Add Skill
              </button>
            </div>
          )}
        </div>

        {skills.length === 0 && (
          <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '4rem' }}>
            No skills yet.
          </div>
        )}
      </div>
    </div>
  )
}
