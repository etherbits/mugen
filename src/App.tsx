import { ThemeProvider } from "@/components/theme-provider"
import { ThemeToggle } from "./components/theme-toggle"

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="px-6 py-4">
        <h1>Hello Vite + React!</h1>
        <ThemeToggle />
      </div>
    </ThemeProvider>
  )
}

export default App
