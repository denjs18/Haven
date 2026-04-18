import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { LayoutDashboard, Settings, LogOut } from 'lucide-react'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b px-6 py-3 flex items-center justify-between">
        <Link href="/projects" className="font-bold text-lg tracking-tight">
          Haven
        </Link>
        <nav className="flex items-center gap-1">
          <Link href="/projects">
            <Button variant="ghost" size="sm" className="gap-1.5 text-sm">
              <LayoutDashboard className="h-4 w-4" />
              <span className="hidden sm:inline">Projets</span>
            </Button>
          </Link>
          <Link href="/settings">
            <Button variant="ghost" size="sm" className="gap-1.5 text-sm">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Paramètres</span>
            </Button>
          </Link>
          <Link href="/login">
            <Button variant="ghost" size="sm" className="gap-1.5 text-sm text-muted-foreground">
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Déconnexion</span>
            </Button>
          </Link>
        </nav>
      </header>

      {/* Contenu principal */}
      <main className="flex-1 px-6 py-8 max-w-5xl mx-auto w-full">
        {children}
      </main>
    </div>
  )
}
