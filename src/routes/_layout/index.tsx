import { ThemeToggle } from '@/components/theme-toggle'
import { Button } from '@/components/ui/button'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_layout/')({
  component: Index
})

function Index() {
  return (
    <div className="flex justify-between">
      <h1 className="font-">Mugen</h1>
      <ThemeToggle/>
    </div>
  )
}
