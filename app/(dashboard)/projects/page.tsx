'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Plus, ExternalLink, Settings, HardDrive, Loader2 } from 'lucide-react'
import { getPocketBase } from '@/lib/pocketbase'
import { listProjects } from '@/lib/projects'
import { CreateProjectDialog } from '@/components/create-project-dialog'
import type { Project } from '@/lib/types'

function formatStorage(bytes: number): string {
  if (bytes < 1048576) return `${Math.round(bytes / 1024)} Ko`
  if (bytes < 1073741824) return `${(bytes / 1048576).toFixed(1)} Mo`
  return `${(bytes / 1073741824).toFixed(2)} Go`
}

function StatusBadge({ status }: { status: Project['status'] }) {
  if (status === 'online')
    return <Badge className="bg-green-500/15 text-green-700 border-green-200">En ligne</Badge>
  if (status === 'starting')
    return <Badge className="bg-yellow-500/15 text-yellow-700 border-yellow-200">Démarrage…</Badge>
  return <Badge variant="secondary">Arrêté</Badge>
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  useEffect(() => {
    async function load() {
      try {
        const pb = getPocketBase()
        const data = await listProjects(pb)
        setProjects(data)
      } catch {
        setError('Impossible de charger les projets.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  function handleProjectCreated(project: Project) {
    setProjects((prev) => [project, ...prev])
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Mes projets</h1>
          <p className="text-sm text-muted-foreground">
            {projects.length} projet{projects.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Button className="gap-2" onClick={() => setDialogOpen(true)}>
          <Plus className="h-4 w-4" />
          Nouveau projet
        </Button>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {projects.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center space-y-3">
            <HardDrive className="h-10 w-10 text-muted-foreground" />
            <p className="font-medium">Aucun projet pour l&apos;instant</p>
            <p className="text-sm text-muted-foreground">
              Créez votre premier projet PocketBase en un clic.
            </p>
            <Button className="gap-2 mt-2" onClick={() => setDialogOpen(true)}>
              <Plus className="h-4 w-4" />
              Créer un projet
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <Card key={project.id} className="flex flex-col">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-base">{project.name}</CardTitle>
                  <StatusBadge status={project.status} />
                </div>
                {project.domain && (
                  <p className="text-xs text-muted-foreground">{project.domain}</p>
                )}
              </CardHeader>

              <CardContent className="flex-1 space-y-4">
                {/* Barre de stockage */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Stockage</span>
                    <span>
                      {formatStorage(project.storage_used)} / {formatStorage(project.storage_limit)}
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary transition-all"
                      style={{
                        width: `${Math.min((project.storage_used / project.storage_limit) * 100, 100)}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <a
                    href={`${project.pocketbase_url}/_/`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1"
                  >
                    <Button variant="outline" size="sm" className="w-full gap-1.5 text-xs">
                      <ExternalLink className="h-3 w-3" />
                      Admin PocketBase
                    </Button>
                  </a>
                  <Link href={`/settings?project=${project.id}`}>
                    <Button variant="ghost" size="sm" className="gap-1.5 text-xs">
                      <Settings className="h-3 w-3" />
                      Config
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <CreateProjectDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onCreated={handleProjectCreated}
      />
    </div>
  )
}
