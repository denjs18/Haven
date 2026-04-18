// Types pour les entités PocketBase

export interface Project {
  id: string
  name: string
  status: 'online' | 'stopped' | 'starting'
  domain?: string
  storageUsed: number // en octets
  storageLimit: number // en octets
  pocketbaseUrl: string
  createdAt: string
  updatedAt: string
}

export interface User {
  id: string
  email: string
  name?: string
  avatar?: string
}
