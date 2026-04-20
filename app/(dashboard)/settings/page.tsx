'use client'

import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Loader2 } from 'lucide-react'
import { getPocketBase } from '@/lib/pocketbase'
import { updateProject, deleteProject } from '@/lib/projects'
import type { Project } from '@/lib/types'

function SettingsContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const projectId = searchParams.get('project')

  const [project, setProject] = useState<Project | null>(null)
  const [name, setName] = useState('')
  const [domain, setDomain] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      if (!projectId) {
        setLoading(false)
        return
      }
      try {
        const pb = getPocketBase()
        const record = await pb.collection('projects').getOne(projectId)
        const p = record as unknown as Project
        setProject(p)
        setName(p.name)
        setDomain(p.domain ?? '')
      } catch {
        setError('Projet introuvable.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [projectId])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!project) return
    setSaving(true)
    setError(null)
    try {
      const pb = getPocketBase()
      const updated = await updateProject(pb, project.id, { name, domain })
      setProject(updated)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch {
      setError('Erreur lors de la sauvegarde.')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!project) return
    if (!confirm(`Supprimer "${project.name}" ? Cette action est irréversible.`)) return
    try {
      const pb = getPocketBase()
      await deleteProject(pb, project.id)
      router.push('/projects')
    } catch {
      setError('Erreur lors de la suppression.')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!projectId || !project) {
    return (
      <div className="space-y-2 max-w-xl">
        <h1 className="text-2xl font-bold">Paramètres</h1>
        <p className="text-muted-foreground text-sm">
          Sélectionnez un projet depuis le{' '}
          <a href="/projects" className="underline underline-offset-2">
            dashboard
          </a>{' '}
          pour accéder à ses paramètres.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-xl">
      <div>
        <h1 className="text-2xl font-bold">Paramètres — {project.name}</h1>
        <p className="text-sm text-muted-foreground">
          Port : {project.port} · {project.pocketbase_url}
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
                value={name}
                onChange={(e) => setName(e.target.value)}
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

            {error && <p className="text-sm text-destructive">{error}</p>}

            <Button type="submit" disabled={saving}>
              {saving ? 'Sauvegarde…' : saved ? 'Sauvegardé ✓' : 'Sauvegarder'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Separator />

      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="text-destructive">Zone dangereuse</CardTitle>
          <CardDescription>Ces actions sont irréversibles. Procédez avec prudence.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="destructive" onClick={handleDelete}>
            Supprimer le projet
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

export default function SettingsPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center py-24"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>}>
      <SettingsContent />
    </Suspense>
  )
}
