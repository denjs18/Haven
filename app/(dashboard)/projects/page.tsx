'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Plus, ExternalLink, Settings, HardDrive } from 'lucide-react'
import type { Project } from '@/lib/types'

// Données d'exemple pour le MVP
const MOCK_PROJECTS: Project[] = [
  {
    id: '1',
    name: 'Mon Blog',
    status: 'online',
    domain: 'blog.exemple.com',
    storageUsed: 52428800, // 50 Mo
    storageLimit: 1073741824, // 1 Go
    pocketbaseUrl: 'http://localhost:8091',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-20T14:30:00Z',
  },
  {
    id: '2',
    name: 'App Todo',
    status: 'stopped',
    storageUsed: 10485760, // 10 Mo
    storageLimit: 1073741824,
    pocketbaseUrl: 'http://localhost:8092',
    createdAt: '2024-02-01T09:00:00Z',
    updatedAt: '2024-02-10T16:00:00Z',
  },
]

function formatStorage(bytes: number): string {
  if (bytes < 1048576) return `${Math.round(bytes / 1024)} Ko`
  return `${(bytes / 1048576).toFixed(1)} Mo`
}

function statusBadge(status: Project['status']) {
  if (status === 'online') return <Badge className="bg-green-500/15 text-green-700 border-green-200">En ligne</Badge>
  if (status === 'starting') return <Badge className="bg-yellow-500/15 text-yellow-700 border-yellow-200">Démarrage…</Badge>
  return <Badge variant="secondary">Arrêté</Badge>
}

export default function ProjectsPage() {
  const [projects] = useState<Project[]>(MOCK_PROJECTS)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Mes projets</h1>
          <p className="text-sm text-muted-foreground">
            {projects.length} projet{projects.length > 1 ? 's' : ''}
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Nouveau projet
        </Button>
      </div>

      {projects.length === 0 ? (
        <Card className="flex flex-col items-center justify-center py-16 text-center">
          <CardContent className="space-y-3">
            <HardDrive className="h-10 w-10 text-muted-foreground mx-auto" />
            <p className="font-medium">Aucun projet pour l&apos;instant</p>
            <p className="text-sm text-muted-foreground">
              Créez votre premier projet PocketBase en un clic.
            </p>
            <Button className="gap-2 mt-2">
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
                  {statusBadge(project.status)}
                </div>
                {project.domain && (
                  <p className="text-xs text-muted-foreground">{project.domain}</p>
                )}
              </CardHeader>

              <CardContent className="flex-1 space-y-4">
                {/* Stockage */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Stockage</span>
                    <span>
                      {formatStorage(project.storageUsed)} / {formatStorage(project.storageLimit)}
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary transition-all"
                      style={{
                        width: `${Math.min((project.storageUsed / project.storageLimit) * 100, 100)}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <a
                    href={`${project.pocketbaseUrl}/_/`}
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
    </div>
  )
}
