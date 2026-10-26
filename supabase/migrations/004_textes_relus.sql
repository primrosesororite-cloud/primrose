-- =====================================================================
-- Primrose – Relecture des textes (octobre 2026)
-- Aligne la base sur les textes corrigés du site. Chaque mise à jour ne
-- s'applique que si le texte n'a pas déjà été modifié par l'équipe depuis
-- l'admin : rejouable et sans écrasement.
-- =====================================================================

-- Axe « Prévenir » : accroche et présentation
update public.missions
  set description = 'Mener des campagnes, des ateliers et des conférences pour sensibiliser le plus grand nombre.'
  where slug = 'prevenir'
    and description = 'Organiser des campagnes, ateliers et conférences de grande envergure pour éduquer le grand public.';

update public.missions
  set detail = 'Nous allons à la rencontre de la population, dans les écoles, les quartiers et les médias, pour agir en amont des violences de genre, grâce à l''information et au dialogue.'
  where slug = 'prevenir'
    and detail = 'Nous allons à la rencontre du grand public — écoles, quartiers, médias — pour faire reculer les violences de genre avant qu''elles ne surviennent, par l''information et le dialogue.';

-- Valeur « Respect civique de tous » → « Respect de toutes et de tous »
update public.valeurs
  set libelle = 'Respect de toutes et de tous'
  where libelle = 'Respect civique de tous';

-- Même correction dans la liste des valeurs de la vision (accueil)
update public.pages_content
  set content = jsonb_set(
    content,
    '{valeurs}',
    (select coalesce(jsonb_agg(
        case when v = '"Respect civique de tous"'::jsonb
             then '"Respect de toutes et de tous"'::jsonb else v end
        order by ord), '[]'::jsonb)
     from jsonb_array_elements(content->'valeurs') with ordinality as t(v, ord))
  )
  where key = 'home.vision'
    and jsonb_typeof(content->'valeurs') = 'array'
    and content->'valeurs' @> '["Respect civique de tous"]'::jsonb;

-- Adresse de contact : le site est en « sororiteprimrose.org », l'adresse
-- affichée était encore sur l'ancien domaine « primrose-sororite.org ».
-- « accueil@ » est l'adresse publiée sur les réseaux de l'association.
update public.parametres_site
  set email = 'accueil@sororiteprimrose.org'
  where id = 1
    and email ilike '%@primrose-sororite.org';

-- Orthographe officielle du nom : « PrimROSE »
update public.parametres_site
  set nom = 'PrimROSE – La Sororité Active'
  where id = 1
    and nom = 'Primrose – La Sororité Active';
