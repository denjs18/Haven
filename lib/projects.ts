import PocketBase from 'pocketbase'
import type { Project } from './types'

export async function listProjects(pb: PocketBase): Promise<Project[]> {
  const userId = pb.authStore.model?.id
  if (!userId) return []

  const records = await pb.collection('projects').getFullList({
    filter: `owner = "${userId}"`,
    sort: '-created',
  })

  return records as unknown as Project[]
}

export async function deleteProject(pb: PocketBase, projectId: string): Promise<void> {
  await pb.collection('projects').delete(projectId)
}

export async function updateProject(
  pb: PocketBase,
  projectId: string,
  data: Partial<Pick<Project, 'name' | 'domain'>>
): Promise<Project> {
  const record = await pb.collection('projects').update(projectId, data)
  return record as unknown as Project
}
