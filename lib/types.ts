// Types alignés sur les champs PocketBase (snake_case)

export interface Project {
  id: string
  name: string
  status: 'online' | 'stopped' | 'starting'
  domain: string
  port: number
  pocketbase_url: string
  storage_used: number
  storage_limit: number
  owner: string
  created: string
  updated: string
}

export interface User {
  id: string
  email: string
  name: string
  avatar: string
}
