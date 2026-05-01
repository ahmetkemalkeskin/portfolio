import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { allExperiences } from 'content-collections'
import { useEffect, useRef, useState } from 'react'
import { useEditMode } from '../hooks/useEditMode'

const getExperienceData = createServerFn({ method: 'GET' }).handler(async () => {
  const entries = allExperiences.sort((a, b) => a.order - b.order)
  return { entries }
})

export const Route = createFileRoute('/experience')({
  loader: () => getExperienceData(),
  component: ExperiencePage,
})

type ExperienceItem = {
  id: string
  date: string
  title: string
  company?: string
  description?: string
  image?: string
}

const STORAGE_KEY = 'portfolio.experience'

function ExperiencePage() {
  const { entries } = Route.useLoaderData()
  const { isEditMode } = useEditMode()
  const initialEntries: ExperienceItem[] = entries.map((entry, index) => ({
    id: `exp-${index}-${entry._meta.path}`,
    date: entry.date,
    title: entry.title,
    company: entry.company ?? '',
    description: entry.description ?? '',
    image: entry.image,
  }))

  const [items, setItems] = useState<ExperienceItem[]>(initialEntries)
  const [showAdd, setShowAdd] = useState(false)
  const [newItem, setNewItem] = useState<ExperienceItem>({ id: '', date: '', title: '', company: '', description: '', image: '' })
  const [hydrated, setHydrated] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as ExperienceItem[]
        if (Array.isArray(parsed)) setItems(parsed)
      }
    } finally {
      setHydrated(true)
    }
  }, [])

  useEffect(() => {
    if (!hydrated) return
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items, hydrated])

  useEffect(() => {
    if (!ref.current) return
    const els = ref.current.querySelectorAll<HTMLElement>('.fade-in')
    const io = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add('visible')),
      { threshold: 0.15 },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [items, showAdd])

  const addItem = () => {
    if (!newItem.title.trim() || !newItem.date.trim()) return
    setItems((prev) => [
      ...prev,
      {
        id: `exp-${Date.now()}`,
        title: newItem.title.trim(),
        date: newItem.date.trim(),
        company: newItem.company?.trim(),
        description: newItem.description?.trim(),
        image: newItem.image?.trim(),
      },
    ])
    setNewItem({ id: '', date: '', title: '', company: '', description: '', image: '' })
    setShowAdd(false)
  }

  return (
    <div ref={ref} style={{ minHeight: '100vh', padding: '5rem 1.5rem' }}>
      <div style={{ maxWidth: '820px', margin: '0 auto' }}>
        <div className="fade-in" style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <p style={{ color: 'var(--accent-cyan)', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Career</p>
          <h1 className="section-title">Experience</h1>
          <p className="section-subtitle">Editable timeline entries in English</p>
          {isEditMode && <button type="button" className="btn-primary" onClick={() => setShowAdd(true)}>+ Add Experience</button>}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {items.map((entry, i) => (
            <div key={entry.id} className={`glass-card fade-in fade-in-delay-${Math.min(i + 1, 5)}`} style={{ padding: '1.2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.5rem', alignItems: 'start', marginBottom: '0.4rem' }}>
                <h3 style={{ margin: 0, fontSize: '1.05rem' }}>{entry.title}</h3>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <span className="tag">{entry.date}</span>
                  {isEditMode && <button type="button" className="btn-outline" style={{ width: '30px', height: '30px', padding: 0, justifyContent: 'center' }} onClick={() => setItems((prev) => prev.filter((item) => item.id !== entry.id))}>X</button>}
                </div>
              </div>
              {entry.company && <p style={{ marginTop: 0, marginBottom: '0.4rem', color: 'var(--accent-cyan)', fontSize: '0.9rem' }}>{entry.company}</p>}
              {entry.description && <p style={{ margin: 0, fontSize: '0.9rem' }}>{entry.description}</p>}
            </div>
          ))}
        </div>

        {items.length === 0 && (
          <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem 0 1rem' }}>
            No experience entries yet.
          </div>
        )}
      </div>

      {isEditMode && showAdd && (
        <div className="lightbox-overlay" onClick={(e) => e.target === e.currentTarget && setShowAdd(false)}>
          <div className="glass-card" style={{ width: '100%', maxWidth: '700px', padding: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <h3 style={{ margin: 0 }}>Add Experience</h3>
              <button type="button" className="btn-outline" style={{ width: '34px', height: '34px', padding: 0, justifyContent: 'center' }} onClick={() => setShowAdd(false)}>X</button>
            </div>
            <div style={{ display: 'grid', gap: '0.75rem' }}>
              <input className="form-input" placeholder="Date (e.g. 2024 - Present)" value={newItem.date} onChange={(e) => setNewItem((p) => ({ ...p, date: e.target.value }))} />
              <input className="form-input" placeholder="Role title" value={newItem.title} onChange={(e) => setNewItem((p) => ({ ...p, title: e.target.value }))} />
              <input className="form-input" placeholder="Company (optional)" value={newItem.company} onChange={(e) => setNewItem((p) => ({ ...p, company: e.target.value }))} />
              <textarea className="form-input" placeholder="Description (optional)" rows={3} value={newItem.description} onChange={(e) => setNewItem((p) => ({ ...p, description: e.target.value }))} />
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button type="button" className="btn-primary" onClick={addItem}>Add</button>
                <button type="button" className="btn-outline" onClick={() => setShowAdd(false)}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
