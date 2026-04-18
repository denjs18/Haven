import PocketBase from 'pocketbase'

// URL de l'instance PocketBase principale (gestion des utilisateurs et projets)
const POCKETBASE_URL = process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://127.0.0.1:8090'

// Instance singleton côté client
let clientInstance: PocketBase | null = null

export function getPocketBase(): PocketBase {
  if (typeof window === 'undefined') {
    // Côté serveur : nouvelle instance à chaque appel
    return new PocketBase(POCKETBASE_URL)
  }

  // Côté client : réutiliser l'instance existante
  if (!clientInstance) {
    clientInstance = new PocketBase(POCKETBASE_URL)
    // Activer la mise à jour automatique du token
    clientInstance.autoCancellation(false)
  }

  return clientInstance
}

export default getPocketBase
