import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/resume')({
  component: () => (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem', padding: '5rem 1.5rem', textAlign: 'center' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 700 }}>Resume</h1>
      <p style={{ color: 'var(--text-secondary)' }}><Link to="/experience" className="nav-link">Experience</Link> and <Link to="/skills" className="nav-link">Skills</Link> pages include my professional background.</p>
      <Link to="/about" className="btn-primary" style={{ marginTop: '1rem' }}>View About Page</Link>
    </div>
  ),
})
