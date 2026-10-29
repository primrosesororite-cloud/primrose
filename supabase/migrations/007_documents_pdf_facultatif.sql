-- =====================================================================
-- PrimROSE – PDF facultatif pour les documents
-- Une fiche peut n'être qu'une affiche (image de couverture) : un clic
-- l'affiche en grand. Il faut au moins un PDF ou une couverture.
-- Inclut la colonne de la migration 006, pour fonctionner même si elle
-- n'a pas été exécutée.
-- =====================================================================

alter table public.documents
  add column if not exists couverture_url text;

alter table public.documents
  alter column fichier_url drop not null,
  alter column chemin drop not null;

alter table public.documents
  drop constraint if exists documents_pdf_ou_couverture;

alter table public.documents
  add constraint documents_pdf_ou_couverture
  check (fichier_url is not null or couverture_url is not null);
