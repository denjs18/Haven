'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

export default function SettingsPage() {
  const [projectName, setProjectName] = useState('Mon Blog')
  const [domain, setDomain] = useState('blog.exemple.com')
  const [saved, setSaved] = useState(false)

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    // TODO: sauvegarder via PocketBase
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="space-y-6 max-w-xl">
      <div>
        <h1 className="text-2xl font-bold">Paramètres du projet</h1>
        <p className="text-sm text-muted-foreground">
          Configurez votre projet PocketBase.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informations générales</CardTitle>
          <CardDescription>Nom et domaine de votre projet.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-1">
              <label htmlFor="name" className="text-sm font-medium">
                Nom du projet
              </label>
              <input
                id="name"
                type="text"
                required
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="domain" className="text-sm font-medium">
                Domaine personnalisé
              </label>
              <input
                id="domain"
                type="text"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                placeholder="monapp.exemple.com"
                className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
              <p className="text-xs text-muted-foreground">
                Optionnel — pointez votre DNS vers l&apos;IP de votre VPS.
              </p>
            </div>

            <Button type="submit">
              {saved ? 'Sauvegardé ✓' : 'Sauvegarder'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Separator />

      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="text-destructive">Zone dangereuse</CardTitle>
          <CardDescription>
            Ces actions sont irréversibles. Procédez avec prudence.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            variant="destructive"
            onClick={() => {
              if (confirm('Supprimer ce projet ? Cette action est irréversible.')) {
                // TODO: appel API suppression
              }
            }}
          >
            Supprimer le projet
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
