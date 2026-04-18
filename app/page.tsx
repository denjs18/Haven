import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Database, Lock, HardDrive, ArrowRight } from 'lucide-react'

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="border-b px-6 py-4 flex items-center justify-between">
        <span className="font-bold text-xl tracking-tight">Haven</span>
        <Link href="/login">
          <Button variant="outline" size="sm">
            Se connecter
          </Button>
        </Link>
      </nav>

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 py-24 gap-8">
        <div className="space-y-4 max-w-2xl">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
            Tous vos projets.
            <br />
            <span className="text-muted-foreground">Un seul dashboard.</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Haven vous permet de déployer et gérer plusieurs instances PocketBase
            sur votre propre VPS — base de données, auth et stockage inclus,
            sans limite de projets.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link href="/login">
            <Button size="lg" className="gap-2">
              Commencer gratuitement
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        {/* Fonctionnalités */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12 max-w-3xl w-full text-left">
          <div className="rounded-xl border p-5 space-y-2">
            <Database className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Base de données</h3>
            <p className="text-sm text-muted-foreground">
              SQLite intégré, performant et sans configuration.
            </p>
          </div>
          <div className="rounded-xl border p-5 space-y-2">
            <Lock className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Authentification</h3>
            <p className="text-sm text-muted-foreground">
              Emails, OAuth, tokens — tout est géré nativement.
            </p>
          </div>
          <div className="rounded-xl border p-5 space-y-2">
            <HardDrive className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Stockage de fichiers</h3>
            <p className="text-sm text-muted-foreground">
              Upload et gestion de fichiers directement sur votre VPS.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t px-6 py-4 text-center text-sm text-muted-foreground">
        Haven — Votre infrastructure, vos règles.
      </footer>
    </main>
  )
}
