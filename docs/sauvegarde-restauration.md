# Sauvegarde et restauration

## Ce qui doit être sauvegardé

1. **Base de données Supabase** (Postgres) : tout le contenu (formations, actualités, adhésions, demandes d'aide chiffrées, utilisateurs, journal d'audit…).
2. **Stockage Supabase** (Storage) : images de la médiathèque, logo, visuels d'actualités.
3. **`DEMANDES_AIDE_ENCRYPTION_KEY`** : sans cette clé, les colonnes chiffrées de `demandes_aide` (coordonnées, message) sont irrécupérables, même avec une sauvegarde de la base intacte. Elle doit être sauvegardée **séparément** de la base (coffre-fort de mots de passe de l'association, jamais dans le même endroit que le dump SQL).
4. Le code source (`Git`) et les variables d'environnement de production (Vercel).

## Sauvegardes automatiques Supabase

Les projets Supabase (plans payants) incluent des sauvegardes quotidiennes automatiques avec restauration ponctuelle (*Point-in-Time Recovery* selon le plan). À vérifier et activer dans *Project Settings → Database → Backups*.

⚠️ Le plan gratuit ne conserve les sauvegardes automatiques que quelques jours — insuffisant seul pour une association gérant des données sensibles. Une sauvegarde manuelle régulière (ci-dessous) est recommandée en complément, quel que soit le plan.

## Sauvegarde manuelle (recommandée mensuellement, ou avant toute migration)

```bash
# Dump complet de la base (structure + données)
supabase db dump --db-url "<connection-string-production>" -f backup-$(date +%Y%m%d).sql

# Ou via pg_dump directement
pg_dump "<connection-string-production>" -F c -f backup-$(date +%Y%m%d).dump
```

La chaîne de connexion se trouve dans *Project Settings → Database → Connection string*.

**Stockage du fichier de sauvegarde** : chiffré au repos (le dump contient les colonnes déjà chiffrées de `demandes_aide`, mais aussi des données en clair comme les adhésions et messages de contact), dans un espace à accès restreint (ex. coffre-fort cloud de l'association), jamais sur un poste personnel non chiffré ni par e-mail.

## Restauration

```bash
# Depuis un dump pg_dump (-F c)
pg_restore --clean --if-exists -d "<connection-string-cible>" backup-YYYYMMDD.dump

# Depuis un dump SQL simple
psql "<connection-string-cible>" -f backup-YYYYMMDD.sql
```

Après restauration :
1. Vérifier que `DEMANDES_AIDE_ENCRYPTION_KEY` en production correspond bien à la clé utilisée au moment de la sauvegarde (sinon les demandes d'aide restaurées sont illisibles).
2. Vérifier que les policies RLS sont toujours actives (`select * from pg_policies;`) — un `pg_restore --clean` restaure aussi les policies si elles étaient incluses dans le dump.
3. Régénérer les types TypeScript si le schéma a changé (`supabase gen types typescript ...`).
4. Tester une connexion admin et une soumission de formulaire avant de rouvrir le site au public.

## Stockage (fichiers médias)

```bash
# Lister et télécharger un bucket via la CLI Supabase, ou utiliser le dashboard
# Project → Storage → (bucket) → Download
```

Les fichiers de la médiathèque sont référencés par URL dans la base ; une restauration de la base sans restauration du Storage laisse des images cassées. Sauvegarder les deux ensemble.

## Fréquence recommandée

| Élément | Fréquence |
|---|---|
| Sauvegarde automatique Supabase | Continue (selon plan) |
| Dump manuel complet | Mensuelle, + avant toute migration de schéma |
| Export `DEMANDES_AIDE_ENCRYPTION_KEY` | À chaque rotation de la clé (rare, planifiée) |
| Test de restauration (sur un projet de test) | Semestrielle, pour vérifier que la procédure fonctionne réellement |
