import { HeadContent, Outlet, Scripts, createRootRoute } from '@tanstack/react-router'
import { Nav } from '../components/Nav'
import { BackToTop } from '../components/BackToTop'
import '../styles.css'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'Ahmet Kemal Keskin — AK.dev' },
      { name: 'description', content: 'Portfolio of Ahmet Kemal Keskin: projects, skills, and contact details.' },
      { name: 'theme-color', content: '#0a0a0a' },
    ],
    links: [
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
    ],
    scripts: [
      { src: 'https://identity.netlify.com/v1/netlify-identity-widget.js' },
    ],
  }),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <Nav />
        <main style={{ paddingTop: '64px' }}>
          {children}
        </main>
        <BackToTop />
        <Scripts />
        <script dangerouslySetInnerHTML={{
          __html: `
            if (window.netlifyIdentity) {
              window.netlifyIdentity.on("init", function(user) {
                if (!user) {
                  window.netlifyIdentity.on("login", function() {
                    document.location.href = "/admin/";
                  });
                }
              });
            }
          `
        }} />
      </body>
    </html>
  )
}
