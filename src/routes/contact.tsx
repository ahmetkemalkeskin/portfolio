import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { allSiteSettings } from 'content-collections'
import { useEffect, useRef, useState } from 'react'
import { useEditMode } from '../hooks/useEditMode'

const getContactData = createServerFn({ method: 'GET' }).handler(async () => {
  const settings = allSiteSettings[0] ?? null
  return { settings }
})

export const Route = createFileRoute('/contact')({
  loader: () => getContactData(),
  component: ContactPage,
})

function encode(data: Record<string, string>) {
  return Object.entries(data)
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join('&')
}

function ContactPage() {
  const { settings } = Route.useLoaderData()
  const { toggleEditMode } = useEditMode()
  const [fields, setFields] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const ref = useRef<HTMLDivElement>(null)
  const secretTap = useRef({ count: 0, lastAt: 0 })

  useEffect(() => {
    if (!ref.current) return
    const els = ref.current.querySelectorAll<HTMLElement>('.fade-in')
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('visible')),
      { threshold: 0.1 }
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setFields({ ...fields, [e.target.name]: e.target.value })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('sending')
    try {
      const response = await fetch('/__forms.html', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: encode({ 'form-name': 'contact', ...fields }),
      })
      if (!response.ok) throw new Error('Form submit failed')
      setStatus('sent')
      setFields({ name: '', email: '', message: '' })
    } catch {
      const targetEmail = settings?.email ?? 'ahmetkemal608@gmail.com'
      const subject = encodeURIComponent(`Portfolio Contact - ${fields.name}`)
      const body = encodeURIComponent(`Name: ${fields.name}\nEmail: ${fields.email}\n\n${fields.message}`)
      try {
        window.location.href = `mailto:${targetEmail}?subject=${subject}&body=${body}`
        setStatus('sent')
        setFields({ name: '', email: '', message: '' })
      } catch {
        setStatus('error')
      }
    }
  }

  const socials = [
    { label: 'GitHub', url: settings?.github, icon: '⌨️' },
    { label: 'YouTube', url: settings?.youtube, icon: '▶️' },
    { label: 'Instagram', url: settings?.instagram, icon: '📷' },
    { label: 'LinkedIn', url: settings?.linkedin, icon: '💼' },
  ].filter((s) => s.url)

  const handleSecretToggle = () => {
    const now = Date.now()
    const withinWindow = now - secretTap.current.lastAt < 900
    const nextCount = withinWindow ? secretTap.current.count + 1 : 1
    secretTap.current = { count: nextCount, lastAt: now }
    if (nextCount >= 3) {
      toggleEditMode()
      secretTap.current = { count: 0, lastAt: 0 }
    }
  }

  return (
    <div ref={ref} style={{ minHeight: '100vh', padding: '5rem 1.5rem' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <div className="fade-in" style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <p style={{ color: 'var(--accent-cyan)', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Contact</p>
          <h1 className="section-title" onClick={handleSecretToggle}>Get in Touch</h1>
          <p className="section-subtitle">Have a project idea? Share the details with me.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem' }}>
          {/* Contact info */}
          <div>
            <div className="glass-card fade-in" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--accent-cyan)', marginBottom: '1.5rem' }}>Contact Info</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {settings?.email && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ fontSize: '1.1rem' }}>✉️</span>
                    <a href={`mailto:${settings.email}`} style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem' }} className="nav-link">
                      {settings.email}
                    </a>
                  </div>
                )}
                {settings?.phone && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ fontSize: '1.1rem' }}>📞</span>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{settings.phone}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Socials */}
            {socials.length > 0 && (
              <div className="glass-card fade-in fade-in-delay-1" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--accent-cyan)', marginBottom: '1.25rem' }}>Social Media</h3>
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  {socials.map(({ label, url, icon }) => (
                    <a key={label} href={url!} target="_blank" rel="noopener noreferrer" className="social-btn" title={label}>
                      <span style={{ fontSize: '1.1rem' }}>{icon}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Maps embed placeholder */}
            <div className="glass-card fade-in fade-in-delay-2" style={{ overflow: 'hidden' }}>
              {settings?.mapsEmbed ? (
                <iframe src={settings.mapsEmbed} style={{ width: '100%', height: '220px', border: 'none' }} title="Location" />
              ) : (
                <div className="img-placeholder" style={{ height: '180px', borderRadius: 'var(--radius)' }}>
                  <span>🗺️ Add location from CMS</span>
                </div>
              )}
            </div>
          </div>

          {/* Form */}
          <div className="glass-card fade-in fade-in-delay-1" style={{ padding: '2.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '2rem' }}>Send a Message</h3>

            {status === 'sent' ? (
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>✅</div>
                <h4 style={{ marginBottom: '0.5rem' }}>Message sent!</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Thanks for reaching out. I will get back to you soon.</p>
                <button onClick={() => setStatus('idle')} className="btn-outline" style={{ marginTop: '1.5rem' }}>Send another</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <input type="hidden" name="form-name" value="contact" />
                {/* Honeypot */}
                <input type="text" name="bot-field" style={{ display: 'none' }} aria-hidden="true" />

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>Name</label>
                  <input
                    type="text"
                    name="name"
                    value={fields.name}
                    onChange={handleChange}
                    required
                    placeholder="Your name"
                    className="form-input"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={fields.email}
                    onChange={handleChange}
                    required
                    placeholder="your@email.com"
                    className="form-input"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>Message</label>
                  <textarea
                    name="message"
                    value={fields.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    placeholder="Tell me about your project..."
                    className="form-input"
                    style={{ resize: 'vertical', minHeight: '120px' }}
                  />
                </div>

                {status === 'error' && (
                  <p style={{ color: '#f87171', fontSize: '0.875rem' }}>Something went wrong. Please try again.</p>
                )}

                <button type="submit" disabled={status === 'sending'} className="btn-primary" style={{ justifyContent: 'center' }}>
                  {status === 'sending' ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
