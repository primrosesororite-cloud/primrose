# Primrose – La Sororité Active

Site officiel de l'association Primrose – La Sororité Active (Congo-Brazzaville), engagée contre les violences de genre selon quatre axes : **Prévenir, Soutenir, Plaider, Former**.

## Stack

- **Next.js 16** (App Router, TypeScript strict)
- **Tailwind CSS v4** + shadcn/ui (config CSS-first via `@theme`, palette dans `tailwind.config.ts`)
- **Framer Motion** pour les animations (système centralisé dans `src/lib/motion.ts`)
- **Supabase** (Postgres, Auth, Storage, Row Level Security)
- **next-intl** (FR par défaut, EN disponible)
- **react-hook-form + Zod**, **TanStack Table v9**, **Tiptap**, **Resend**, **Cloudflare Turnstile**

## Démarrage local

```bash
npm install
cp .env.local.example .env.local   # puis renseigner les variables (voir ci-dessous)
npm run dev
```

Le site fonctionne en mode dégradé sans Supabase configuré (pages publiques statiques/vides, `/admin/*` renvoie une erreur contrôlée). Pour un environnement complet, voir [docs/deploiement.md](docs/deploiement.md).

## Scripts

| Commande | Description |
|---|---|
| `npm run dev` | Serveur de développement |
| `npm run build` | Build de production |
| `npm run start` | Sert le build de production |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm test` | Tests unitaires (Vitest) |
| `npm run test:e2e` | Tests bout-en-bout (Playwright) |
| `npm run analyze` | Build avec analyse de bundle (ouvre un rapport) |

## Base de données

Le schéma complet (tables, RLS, seed) vit dans [`supabase/migrations/001_schema_primrose.sql`](supabase/migrations/001_schema_primrose.sql). L'appliquer via `supabase db push` ou le SQL Editor du dashboard Supabase. Régénérer les types TypeScript après toute modification :

```bash
supabase gen types typescript --project-id <id> > src/types/database.ts
```

**Compte admin de développement** : [`supabase/seed-admin-dev.sql`](supabase/seed-admin-dev.sql) crée un compte `super_admin` prêt à l'emploi (`admin@primrose.local` / `ChangeMe123!`) — à exécuter une fois après la migration, **uniquement sur un projet Supabase de dev/test**. En production, créez le premier compte via `/connexion` puis promouvez-le manuellement (requête donnée en fin de fichier de migration) — voir [docs/deploiement.md](docs/deploiement.md).

## Structure

```
src/
  app/[locale]/       pages publiques + /admin (back-office)
  components/         admin/, forms/, layout/, sections/, motion/, ui/
  actions/            Server Actions (mutations, validées Zod)
  lib/                supabase/, validations/, data/ (lecture publique ISR-safe), crypto, email, csv…
  messages/           fr.json, en.json
  types/database.ts   Types Supabase (à régénérer, voir ci-dessus)
supabase/migrations/  Schéma SQL, RLS, seed
e2e/                  Tests Playwright (+ axe-core pour l'accessibilité)
docs/                 Guide d'administration, procédures de sauvegarde, checklist de mise en ligne
```

## Points d'attention pour qui reprend ce projet

- **`/besoin-d-aide` est une page sensible** : aucun tracking, aucun cookie tiers, aucun `localStorage`. Les coordonnées et messages du formulaire sont chiffrés côté application (AES-256-GCM, voir `src/lib/crypto.ts`) avant écriture en base — sans `DEMANDES_AIDE_ENCRYPTION_KEY`, ce formulaire refuse volontairement les envois.
- **Les données publiques (formations, actualités, équipe…) utilisent un client Supabase sans cookies** (`src/lib/supabase/public.ts`) pour permettre l'ISR. Le client avec cookies (`src/lib/supabase/server.ts`) est réservé à tout ce qui dépend de la session utilisateur (admin).
- **Toute demande d'aide consultée dans l'admin est journalisée** (table `audit_logs`) — c'est fait côté application, pas par un trigger SQL, car un `SELECT` ne déclenche pas de trigger Postgres.
- Les tables `missions` / `valeurs` existent en base et sont gérables depuis l'admin, mais **le site public affiche encore ce contenu depuis `src/messages/*.json`**, pas depuis ces tables — à connecter si l'association veut éditer ces textes sans redéploiement.
- Contenu de `/mentions-legales` et `/politique-de-confidentialite` : les champs `[à compléter]` doivent être renseignés par l'association avant mise en ligne (raison sociale, adresse, DPO…) — volontairement non inventés.
