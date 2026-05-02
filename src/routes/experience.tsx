import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { allExperiences } from 'content-collections'
import { useEffect, useMemo, useRef } from 'react'

const getExperienceData = createServerFn({ method: 'GET' }).handler(async () => {
  const entries = allExperiences.sort((a, b) => a.order - b.order)
  return { entries }
})

export const Route = createFileRoute('/experience')({
  loader: () => getExperienceData(),
  component: ExperiencePage,
})

type ExperienceRow = {
  id: string
  date: string
  title: string
  company?: string
  description?: string
  image?: string
}

function ExperiencePage() {
  const { entries } = Route.useLoaderData()
  const ref = useRef<HTMLDivElement>(null)

  const items: ExperienceRow[] = useMemo(
    () =>
      entries.map((entry, index) => ({
        id: `exp-${index}-${entry._meta.path}`,
        date: entry.date,
        title: entry.title,
        company: entry.company ?? '',
        description: entry.description ?? '',
        image: entry.image,
      })),
    [entries],
  )

  useEffect(() => {
    if (!ref.current) return
    const els = ref.current.querySelectorAll<HTMLElement>('.fade-in')
    const io = new IntersectionObserver(
      (observerEntries) => observerEntries.forEach((entry) => entry.isIntersecting && entry.target.classList.add('visible')),
      { threshold: 0.15 },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [items])

  return (
    <div ref={ref} style={{ minHeight: '100vh', padding: '5rem 1.5rem' }}>
      <div style={{ maxWidth: '820px', margin: '0 auto' }}>
        <div className="fade-in" style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <p style={{ color: 'var(--accent-cyan)', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Career</p>
          <h1 className="section-title">Experience</h1>
          <p className="section-subtitle">Timeline from CMS (commit + deploy updates for everyone)</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {items.map((entry, i) => (
            <div key={entry.id} className={`glass-card fade-in fade-in-delay-${Math.min(i + 1, 5)}`} style={{ padding: '1.2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.5rem', alignItems: 'start', marginBottom: '0.4rem' }}>
                <h3 style={{ margin: 0, fontSize: '1.05rem' }}>{entry.title}</h3>
                <span className="tag">{entry.date}</span>
              </div>
              {entry.company && <p style={{ marginTop: 0, marginBottom: '0.4rem', color: 'var(--accent-cyan)', fontSize: '0.9rem' }}>{entry.company}</p>}
              {entry.description && <p style={{ margin: 0, fontSize: '0.9rem' }}>{entry.description}</p>}
            </div>
          ))}
        </div>

        {items.length === 0 && (
          <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem 0 1rem' }}>
            No experience entries yet. Add Markdown files under <code style={{ color: 'var(--accent-cyan)' }}>content/experience/</code>.
          </div>
        )}
      </div>
    </div>
  )
}
