# Guide de déploiement

## 1. Provisionner Supabase (production)

1. Créer un projet sur [supabase.com](https://supabase.com) (choisir une région proche du public visé, ex. Europe).
2. Dans le SQL Editor, exécuter le contenu de `supabase/migrations/001_schema_primrose.sql`.
3. Récupérer dans *Project Settings → API* : `Project URL`, `anon public key`, `service_role key` (⚠️ secret, jamais côté client).
4. Créer le premier compte admin :
   - S'inscrire normalement via `/connexion` (ou créer l'utilisateur depuis *Authentication* dans le dashboard Supabase).
   - Dans le SQL Editor, exécuter :
     ```sql
     update public.profiles set role = 'super_admin' where id = '<UUID_DU_COMPTE>';
     ```
5. Vérifier que Row Level Security est bien activée sur toutes les tables (la migration le fait, mais un contrôle visuel dans *Table Editor* est recommandé).
6. Renseigner les vrais numéros d'urgence et coordonnées via `/admin/parametres` — **ne jamais publier un numéro non vérifié**.

## 2. Cloudflare Turnstile (anti-spam)

1. Créer un site sur [dash.cloudflare.com/turnstile](https://dash.cloudflare.com/?to=/:account/turnstile).
2. Récupérer la clé de site (publique) et la clé secrète.

## 3. Resend (e-mails transactionnels)

1. Créer un compte sur [resend.com](https://resend.com).
2. Vérifier le domaine d'envoi (enregistrements DNS SPF/DKIM fournis par Resend) — nécessaire pour que les e-mails n'atterrissent pas en spam.
3. Récupérer la clé API.

## 4. Variables d'environnement

Copier `.env.local.example`, renseigner chaque variable. Pour `DEMANDES_AIDE_ENCRYPTION_KEY` :

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

⚠️ **Conserver cette clé en lieu sûr, hors du dépôt Git.** La perdre rend les demandes d'aide déjà enregistrées définitivement illisibles ; la changer sans migration rend illisibles les demandes chiffrées avec l'ancienne clé.

## 5. Déploiement sur Vercel

1. Importer le dépôt GitHub sur [vercel.com/new](https://vercel.com/new).
2. Renseigner toutes les variables d'environnement de `.env.local.example` dans *Project Settings → Environment Variables* (environnement Production, et Preview si souhaité avec un projet Supabase de test séparé).
3. Déployer. Le premier build valide automatiquement lint + typecheck (voir `next.config.ts`) et échoue si le code ne compile pas.
4. **Domaine personnalisé** : *Project Settings → Domains*, ajouter le domaine de l'association, suivre les instructions DNS (enregistrement A ou CNAME chez le registrar).
5. Mettre à jour `NEXT_PUBLIC_SITE_URL` avec le domaine final (impacte le sitemap, Open Graph, hreflang) et redéployer.

## 6. Vérifications post-déploiement

- `https://<domaine>/sitemap.xml` et `/robots.txt` répondent correctement.
- Se connecter à `/connexion` avec le compte super_admin, vérifier l'accès à `/admin`.
- Soumettre un test sur `/contact` et `/besoin-d-aide`, vérifier la réception (chiffrée, pour la seconde) dans l'admin.
- Lancer un audit Lighthouse mobile (Chrome DevTools ou [PageSpeed Insights](https://pagespeed.web.dev)) sur la page d'accueil — objectif > 90.
- Vérifier les en-têtes de sécurité via [securityheaders.com](https://securityheaders.com).

Voir aussi [checklist-mise-en-ligne.md](checklist-mise-en-ligne.md) pour la liste complète avant annonce publique.
