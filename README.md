# Haven

**Haven** est un dashboard SaaS pour indie hackers et développeurs solo qui veulent gérer plusieurs projets [PocketBase](https://pocketbase.io) sur leur propre VPS — base de données, authentification et stockage de fichiers inclus, sans limite de projets et pour un coût minimal.

## Fonctionnalités (MVP)

- Page d'accueil publique
- Authentification via PocketBase
- Liste des projets avec statut (en ligne / arrêté), stockage utilisé
- Lien direct vers l'admin PocketBase de chaque projet
- Page paramètres (nom du projet, domaine personnalisé)

## Stack technique

| Technologie | Rôle |
|---|---|
| [Next.js 14](https://nextjs.org) (App Router) | Framework frontend |
| [TypeScript](https://www.typescriptlang.org) | Typage strict |
| [Tailwind CSS](https://tailwindcss.com) | Styles |
| [Shadcn/ui](https://ui.shadcn.com) | Composants UI |
| [PocketBase](https://pocketbase.io) | Backend (BDD, auth, storage) |

## Lancer le projet en local

### Prérequis

- Node.js 18+
- Une instance [PocketBase](https://pocketbase.io/docs/) en cours d'exécution

### 1. Cloner le repo

```bash
git clone https://github.com/denjs18/haven.git
cd haven
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Configurer les variables d'environnement

```bash
cp .env.example .env.local
```

Éditez `.env.local` et renseignez l'URL de votre instance PocketBase :

```env
NEXT_PUBLIC_POCKETBASE_URL=http://127.0.0.1:8090
```

### 4. Démarrer PocketBase

Téléchargez PocketBase depuis [pocketbase.io](https://pocketbase.io/docs/) et lancez-le :

```bash
./pocketbase serve
```

L'interface admin sera disponible sur `http://127.0.0.1:8090/_/`

### 5. Démarrer l'app

```bash
npm run dev
```

L'application sera disponible sur [http://localhost:3000](http://localhost:3000).

## Structure du projet

```
haven/
├── app/
│   ├── (auth)/
│   │   └── login/          # Page de connexion
│   ├── (dashboard)/
│   │   ├── projects/       # Liste des projets
│   │   ├── settings/       # Paramètres du projet
│   │   └── layout.tsx      # Layout avec navigation
│   ├── layout.tsx          # Layout racine
│   └── page.tsx            # Page d'accueil publique
├── components/
│   └── ui/                 # Composants Shadcn/ui
├── lib/
│   ├── pocketbase.ts       # Client PocketBase singleton
│   ├── types.ts            # Types TypeScript
│   └── utils.ts            # Utilitaires (cn)
└── public/                 # Assets statiques
```

## Roadmap

- [ ] Création de nouvelles instances PocketBase via l'UI
- [ ] Démarrage / arrêt des instances
- [ ] Métriques en temps réel (CPU, mémoire, stockage)
- [ ] Domaines personnalisés avec certificats SSL automatiques
- [ ] Sauvegardes automatiques
- [ ] Multi-utilisateurs / équipes

## Licence

MIT
