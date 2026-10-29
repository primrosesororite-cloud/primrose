-- =====================================================================
-- PrimROSE – Image de couverture des documents
-- Affiche (ou première page) montrée dans la liste ; un clic ouvre le PDF
-- dans le lecteur. Facultative : sans couverture, l'icône PDF reste.
-- L'image est stockée dans le bucket public « images-public » (comme les
-- images des actualités).
-- =====================================================================

alter table public.documents
  add column if not exists couverture_url text;
