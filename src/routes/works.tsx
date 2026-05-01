import { Navigate, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/works')({
  component: WorksRedirectPage,
})

function WorksRedirectPage() {
  return <Navigate to="/projects" replace />
}
