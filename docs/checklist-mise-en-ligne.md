# Checklist avant mise en ligne

À valider intégralement avant d'annoncer le site publiquement.

## Contenu et conformité

- [ ] Tous les `[à compléter]` de `/mentions-legales` sont renseignés (raison sociale, adresse, directeur de publication, hébergeur, contact).
- [ ] `/politique-de-confidentialite` relue et validée par l'association (finalités, durées de conservation, destinataires réels des données).
- [ ] **Numéros d'urgence sur `/besoin-d-aide` vérifiés et corrects** — ce sont les seules informations du site où une erreur peut avoir des conséquences graves. Tester chaque numéro.
- [ ] Aucun témoignage fictif publié — les témoignages réels ne sont mis en ligne qu'avec le consentement explicite et éclairé des personnes concernées.
- [ ] Relecture orthographique/grammaticale complète en français (accents, accords).
- [ ] Coordonnées de contact (adresse, téléphone, e-mail) à jour dans `/admin/parametres`.

## Comptes et accès

- [ ] Au moins un compte `super_admin` créé et testé.
- [ ] Rôles (`admin`, `editor`) attribués aux bonnes personnes, pas plus large que nécessaire.
- [ ] Mots de passe des comptes admin forts et uniques (pas de mot de passe partagé).
- [ ] Ancien(s) compte(s) de test supprimé(s) ou désactivé(s).

## Sécurité

- [ ] `DEMANDES_AIDE_ENCRYPTION_KEY` généré aléatoirement (32 octets), renseigné en production, sauvegardé séparément (voir [sauvegarde-restauration.md](sauvegarde-restauration.md)).
- [ ] `SUPABASE_SERVICE_ROLE_KEY` présent uniquement dans les variables d'environnement serveur (Vercel), jamais dans le code ni exposé côté client.
- [ ] RLS activée et vérifiée sur toutes les tables (`select * from pg_policies`).
- [ ] Turnstile actif sur tous les formulaires publics (aide, contact, adhésion, inscription formation).
- [ ] En-têtes de sécurité vérifiés via [securityheaders.com](https://securityheaders.com) (CSP, HSTS, X-Frame-Options).
- [ ] HTTPS forcé (automatique sur Vercel avec domaine personnalisé — vérifier le certificat actif).

## Performance et accessibilité

- [ ] Audit Lighthouse mobile sur la page d'accueil et `/besoin-d-aide` — objectif > 90 (Performance, Accessibilité, Bonnes pratiques, SEO).
- [ ] Navigation complète au clavier testée (Tab, Entrée, Échap) sur le parcours principal et le bouton « Quitter rapidement ».
- [ ] Double appui sur Échap testé sur mobile et desktop — redirige immédiatement.
- [ ] Test sur écran 375 px (mobile) : pas de débordement horizontal, boutons atteignables au pouce.
- [ ] `npm run test:e2e` passe intégralement en local avant déploiement.

## Fonctionnel

- [ ] Formulaire `/besoin-d-aide` testé de bout en bout : soumission → chiffrement en base → e-mail d'alerte reçu (sans donnée personnelle) → visible et déchiffrable dans l'admin.
- [ ] Formulaire `/contact` testé : soumission → réception dans l'admin → réponse par e-mail fonctionnelle.
- [ ] Inscription à une formation testée de bout en bout, export CSV vérifié.
- [ ] Adhésion testée de bout en bout.
- [ ] Publication d'une actualité et d'un événement testée (y compris programmation différée si utilisée).
- [ ] Sitemap (`/sitemap.xml`) et `robots.txt` accessibles et corrects.

## Infrastructure

- [ ] Domaine personnalisé configuré et propagé (DNS).
- [ ] Domaine d'envoi Resend vérifié (SPF/DKIM) — tester qu'un e-mail envoyé n'atterrit pas en spam.
- [ ] Sauvegarde Supabase automatique activée ; premier dump manuel effectué et vérifié restaurable.
- [ ] CI (GitHub Actions) verte sur la branche principale.

## Après la mise en ligne

- [ ] Suivre les premières soumissions de `/besoin-d-aide` de près les premiers jours (sans compromettre la confidentialité).
- [ ] Planifier une revue de sécurité/RLS périodique (voir README, section « Points d'attention »).
- [ ] Former l'équipe de l'association avec [guide-administration.pdf](guide-administration.pdf) (ou `.md`) avant de leur transférer la gestion quotidienne.
