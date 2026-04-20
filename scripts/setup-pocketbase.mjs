/**
 * Script d'initialisation PocketBase pour Haven.
 * Crée la collection `projects` avec tous les champs et règles d'accès.
 *
 * Usage :
 *   npm run setup
 *
 * Prérequis :
 *   - PocketBase en cours d'exécution (./pocketbase serve)
 *   - Variables dans .env.local :
 *       NEXT_PUBLIC_POCKETBASE_URL
 *       PB_ADMIN_EMAIL
 *       PB_ADMIN_PASSWORD
 */

import PocketBase from 'pocketbase'
import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

// Charger .env.local manuellement (pas de dotenv requis)
const __dirname = dirname(fileURLToPath(import.meta.url))
const envPath = resolve(__dirname, '../.env.local')

try {
  const envContent = readFileSync(envPath, 'utf-8')
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const [key, ...rest] = trimmed.split('=')
    if (key && rest.length) process.env[key.trim()] = rest.join('=').trim()
  }
} catch {
  // .env.local absent — on utilise les variables d'environnement système
}

const PB_URL = process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://127.0.0.1:8090'
const ADMIN_EMAIL = process.env.PB_ADMIN_EMAIL
const ADMIN_PASSWORD = process.env.PB_ADMIN_PASSWORD

if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
  console.error('\n❌ Variables manquantes dans .env.local :')
  console.error('   PB_ADMIN_EMAIL=votre@email.com')
  console.error('   PB_ADMIN_PASSWORD=votre_mot_de_passe\n')
  process.exit(1)
}

const pb = new PocketBase(PB_URL)

async function main() {
  console.log(`\n🔗 Connexion à PocketBase : ${PB_URL}`)

  // Authentification admin
  await pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASSWORD)
  console.log('✅ Authentifié en tant qu\'admin')

  // Vérifier si la collection existe déjà
  const collections = await pb.collections.getFullList()
  const exists = collections.some((c) => c.name === 'projects')

  if (exists) {
    console.log('ℹ️  La collection "projects" existe déjà — rien à faire.')
    process.exit(0)
  }

  // Créer la collection projects
  await pb.collections.create({
    name: 'projects',
    type: 'base',
    fields: [
      { name: 'name',          type: 'text',   required: true },
      { name: 'status',        type: 'text',   required: true, options: { min: null, max: null, pattern: '' } },
      { name: 'domain',        type: 'text',   required: false },
      { name: 'port',          type: 'number', required: false },
      { name: 'pocketbase_url',type: 'url',    required: false, options: { exceptDomains: [], onlyDomains: [] } },
      { name: 'storage_used',  type: 'number', required: false },
      { name: 'storage_limit', type: 'number', required: false },
      {
        name: 'owner',
        type: 'relation',
        required: true,
        options: {
          collectionId: '_pb_users_auth_',
          cascadeDelete: true,
          minSelect: null,
          maxSelect: 1,
          displayFields: ['email'],
        },
      },
    ],
    // Règles : chaque utilisateur ne voit et ne modifie que ses propres projets
    listRule:   '@request.auth.id != "" && owner = @request.auth.id',
    viewRule:   '@request.auth.id != "" && owner = @request.auth.id',
    createRule: '@request.auth.id != ""',
    updateRule: '@request.auth.id != "" && owner = @request.auth.id',
    deleteRule: '@request.auth.id != "" && owner = @request.auth.id',
  })

  console.log('✅ Collection "projects" créée avec succès')
  console.log('\n🎉 Setup terminé ! Tu peux lancer : npm run dev\n')
}

main().catch((err) => {
  console.error('\n❌ Erreur :', err?.message || err)
  process.exit(1)
})
