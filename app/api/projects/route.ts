import { NextRequest, NextResponse } from 'next/server'
import { spawn } from 'child_process'
import path from 'path'
import fs from 'fs'
import PocketBase from 'pocketbase'

const PB_BINARY = process.env.PB_BINARY_PATH || '/usr/local/bin/pocketbase'
const PB_DATA_DIR = process.env.PB_DATA_DIR || '/var/haven/projects'
const PB_HOST = process.env.PB_BIND_HOST || '0.0.0.0'
const PB_PUBLIC_HOST = process.env.PB_PUBLIC_HOST || 'localhost'
const BASE_PORT = 8091

async function findNextPort(pb: PocketBase): Promise<number> {
  const records = await pb.collection('projects').getFullList()
  const usedPorts = records.map((r) => r['port'] as number).filter(Boolean)
  let port = BASE_PORT
  while (usedPorts.includes(port)) port++
  return port
}

function buildPb(authCookie: string): PocketBase {
  const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://127.0.0.1:8090')
  pb.authStore.loadFromCookie(`pb_auth=${authCookie}`)
  return pb
}

export async function POST(req: NextRequest) {
  const authCookie = req.cookies.get('pb_auth')?.value
  if (!authCookie) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

  const pb = buildPb(authCookie)
  if (!pb.authStore.isValid) return NextResponse.json({ error: 'Session expirée' }, { status: 401 })

  let body: { name?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Corps de requête invalide' }, { status: 400 })
  }

  const name = body.name?.trim()
  if (!name) return NextResponse.json({ error: 'Le nom du projet est requis' }, { status: 400 })

  const port = await findNextPort(pb)
  const pbUrl = `http://${PB_PUBLIC_HOST}:${port}`
  const dataDir = path.join(PB_DATA_DIR, `project_${port}`)

  fs.mkdirSync(dataDir, { recursive: true })

  const binaryExists = fs.existsSync(PB_BINARY)

  const record = await pb.collection('projects').create({
    name,
    status: binaryExists ? 'starting' : 'stopped',
    domain: '',
    port,
    pocketbase_url: pbUrl,
    storage_limit: 1073741824,
    storage_used: 0,
    owner: pb.authStore.model?.id,
  })

  if (binaryExists) {
    const child = spawn(PB_BINARY, ['serve', '--http', `${PB_HOST}:${port}`, '--dir', dataDir], {
      detached: true,
      stdio: 'ignore',
    })
    child.unref()

    // Marquer online après délai de démarrage
    setTimeout(async () => {
      try {
        await pb.collection('projects').update(record.id, { status: 'online' })
      } catch { /* silencieux */ }
    }, 3000)
  }

  return NextResponse.json(record, { status: 201 })
}

export async function DELETE(req: NextRequest) {
  const authCookie = req.cookies.get('pb_auth')?.value
  if (!authCookie) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

  const pb = buildPb(authCookie)
  if (!pb.authStore.isValid) return NextResponse.json({ error: 'Session expirée' }, { status: 401 })

  const projectId = new URL(req.url).searchParams.get('id')
  if (!projectId) return NextResponse.json({ error: 'ID requis' }, { status: 400 })

  const record = await pb.collection('projects').getOne(projectId)
  if (record['owner'] !== pb.authStore.model?.id) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 403 })
  }

  await pb.collection('projects').delete(projectId)
  return NextResponse.json({ success: true })
}
