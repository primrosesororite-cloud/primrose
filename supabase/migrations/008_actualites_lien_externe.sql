-- =====================================================================
-- PrimROSE – Actualités liées à un article externe (revue de presse)
-- Lien vers l'article d'un média partenaire + aperçu (titre, description,
-- image, nom du site) récupéré une seule fois à l'enregistrement. L'image
-- de l'aperçu est copiée dans le bucket images-public : le site n'appelle
-- jamais le site du partenaire à l'affichage.
-- =====================================================================

alter table public.actualites
  add column if not exists lien_externe text,
  add column if not exists apercu jsonb;

alter table public.actualites
  drop constraint if exists actualites_lien_externe_https;

alter table public.actualites
  add constraint actualites_lien_externe_https
  check (lien_externe is null or lien_externe ~ '^https://');
