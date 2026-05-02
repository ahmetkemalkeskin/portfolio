import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { allSkillCategories } from 'content-collections'
import { useEffect, useMemo, useRef } from 'react'

const getSkillsData = createServerFn({ method: 'GET' }).handler(async () => {
  const categories = [...allSkillCategories].sort((a, b) => a.order - b.order)
  return { categories }
})

export const Route = createFileRoute('/skills')({
  loader: () => getSkillsData(),
  component: SkillsPage,
})

function SkillsPage() {
  const { categories } = Route.useLoaderData()
  const ref = useRef<HTMLDivElement>(null)

  const flatCount = useMemo(
    () => categories.reduce((acc, c) => acc + (c.items?.length ?? 0), 0),
    [categories],
  )

  useEffect(() => {
    if (!ref.current) return
    const els = ref.current.querySelectorAll<HTMLElement>('.fade-in')
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('visible')
        }
      }),
      { threshold: 0.1 },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [categories])

  return (
    <div ref={ref} style={{ minHeight: '100vh', padding: '5rem 1.5rem' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <div className="fade-in" style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <p style={{ color: 'var(--accent-cyan)', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Capabilities</p>
          <h1 className="section-title">Skills</h1>
          <p className="section-subtitle">Edit categories in Decap CMS → <code style={{ color: 'var(--accent-cyan)' }}>content/skills/</code></p>
        </div>

        {categories.map((cat, ci) => (
          <div key={cat._meta.path} className="glass-card fade-in" style={{ padding: '1.2rem', marginBottom: ci < categories.length - 1 ? '1.25rem' : 0 }}>
            <h2 style={{ margin: '0 0 1rem', fontSize: '1.05rem', color: 'var(--accent-cyan)' }}>{cat.category}</h2>
            {(cat.items ?? []).map((skill, si) => (
              <div
                key={`${cat._meta.path}-${si}-${skill.name}`}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr auto',
                  gap: '0.75rem',
                  alignItems: 'center',
                  padding: '0.75rem',
                  borderBottom: si < (cat.items?.length ?? 0) - 1 ? '1px solid var(--border-color)' : 'none',
                }}
              >
                <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{skill.name}</span>
                <span className="tag">{skill.level}</span>
              </div>
            ))}
          </div>
        ))}

        {flatCount === 0 && (
          <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '4rem' }}>
            No skills in CMS yet. Add markdown under <code style={{ color: 'var(--accent-cyan)' }}>content/skills/</code>.
          </div>
        )}
      </div>
    </div>
  )
}
