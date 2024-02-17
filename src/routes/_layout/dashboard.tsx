import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_layout/dashboard')({
  component: () => <div>Hello /_layout/dashboard!</div>
})

export default function Dashboard() {
  return (
    <div>Dashboard</div>
  )
}
