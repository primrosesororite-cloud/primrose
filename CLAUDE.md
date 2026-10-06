# CLAUDE.md : Primrose – La Sororité Active

## Contexte
Site officiel de l'association **Primrose – La Sororité Active** (Congo-Brazzaville),
engagée contre les violences de genre. Quatre axes : **Prévenir, Soutenir, Plaider, Former**.
Le public inclut des personnes potentiellement en danger : **sécurité, confidentialité et
ton bienveillant passent avant tout**.

## Stack
- Next.js 15 (App Router) + TypeScript strict
- Tailwind CSS + shadcn/ui
- Framer Motion (animations)
- Supabase (Postgres, Auth, Storage, RLS)
- next-intl (FR par défaut, EN prévu)
- react-hook-form + Zod, TanStack Table, Tiptap, Recharts
- Déploiement : Vercel + Supabase

## Charte graphique (source : maquette, à valider avec le designer)
Valeurs approximatives, à ajuster à la maquette :

| Token | HEX | Usage |
|---|---|---|
| primrose-green | #8BAA85 | Fonds sauge, footer, pastille onglet actif |
| primrose-green-dark | #3F5B45 | Titres, logo, icônes |
| primrose-cream | #F4F7F0 | Fonds de sections |
| primrose-ink | #3A2E2A | Texte courant |
| primrose-alert | #C8383A | Bouton « Contact – Besoin d'aide » uniquement |
| primrose-white | #FFFFFF | Cartes |

- **Titres** : police serif élégante (ex. Playfair Display / Cormorant Garamond).
- **Corps** : sans-serif type Roboto / Inter.
- **Cartes** : fond blanc, rayon 16 px, ombre douce, icône verte.
- **Navbar** : logo rond à gauche, onglet actif = pastille verte arrondie.
- Le rouge est réservé à l'aide/urgence. Ne pas l'utiliser ailleurs.
- Ne jamais introduire de nouvelle couleur sans la déclarer dans `tailwind.config.ts`.

## Règles de code
- TypeScript strict, pas de `any`. Types Supabase générés dans `src/types/database.ts`.
- Server Components par défaut ; `"use client"` seulement si nécessaire.
- Mutations via Server Actions, **validation Zod côté serveur systématique**.
- Aucune clé secrète côté client. `SUPABASE_SERVICE_ROLE_KEY` uniquement côté serveur.
- Composants petits, réutilisables, nommés en PascalCase ; un composant = un fichier.
- Textes dans `src/messages/fr.json`, jamais en dur dans les composants.
- Pas de code mort, pas de `console.log` commité.
- Commits conventionnels (`feat:`, `fix:`, `chore:`).

## Animations
- Variants Framer Motion centralisés dans `src/lib/motion.ts`.
- Durée 0,3 à 0,7 s, easing doux. Ton sobre et sérieux, jamais agressif.
- Toujours respecter `prefers-reduced-motion`.
- Pas d'animation qui dégrade la performance sur mobile bas de gamme.

## Sécurité et confidentialité (non négociable)
- RLS activée sur **toutes** les tables ; toute nouvelle table = nouvelles policies.
- Table `demandes_aide` : accès restreint aux rôles autorisés, consultation journalisée.
- Page `/besoin-d-aide` : **aucun tracking, aucun cookie tiers, aucun localStorage**.
- Bouton « Quitter rapidement » présent sur toutes les pages publiques
  (+ Échap deux fois), utilisant `location.replace`.
- Anti-spam : honeypot + Turnstile + rate limiting sur tous les formulaires publics.
- En-têtes de sécurité (CSP, HSTS, X-Frame-Options) configurés.

## Accessibilité et performance
- WCAG AA : contrastes vérifiés, focus visible, labels, navigation clavier.
- Mobile-first, connexion lente : images `next/image`, lazy loading, ISR.
- Objectif Lighthouse > 90 sur mobile.

## Rôles admin
- `super_admin` : tout, y compris gestion des utilisateurs.
- `admin` : contenus + demandes (adhésions, contact, aide).
- `editor` : contenus uniquement, sans accès aux demandes.

## Langue et ton
- Interface et contenu en français correct (relire les accents et accords).
- Ton : chaleureux, respectueux, non culpabilisant, sans jargon.
- Corriger les fautes présentes dans la maquette : « rétablissement », « violences »,
  « législatifs », « civique », « grand public ».

## Avant de livrer une tâche
1. `pnpm lint && pnpm typecheck && pnpm build` passent.
2. Le rendu est comparé à la maquette (couleurs, espacements, typographie).
3. Test mobile (375 px) et clavier.
4. Nouvelles tables : RLS + policies + types régénérés.
