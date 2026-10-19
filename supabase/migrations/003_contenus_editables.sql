-- =====================================================================
-- Primrose – Contenus du site modifiables depuis l'admin
-- Missions (détail + actions), valeurs, vision. Les textes ci-dessous
-- reprennent à l'identique ce que le site affichait via fr.json : rien ne
-- change visuellement tant que l'équipe n'a pas modifié ces contenus.
-- Rejouable sans écraser une modification déjà faite par l'équipe.
-- =====================================================================

alter table public.missions
  add column if not exists detail text check (char_length(detail) <= 2000),
  add column if not exists actions jsonb not null default '[]'::jsonb;

-- Détail et actions des quatre axes (seulement s'ils ne sont pas déjà renseignés)
update public.missions
  set detail = 'Nous allons à la rencontre du grand public — écoles, quartiers, médias — pour faire reculer les violences de genre avant qu''elles ne surviennent, par l''information et le dialogue.',
      actions = '["Campagnes de sensibilisation","Ateliers dans les écoles et les quartiers","Conférences et interventions dans les médias"]'::jsonb
  where slug = 'prevenir' and detail is null;

update public.missions
  set detail = 'Chaque victime accompagnée reçoit une écoute confidentielle et une orientation vers les ressources psychologiques, médicales et juridiques adaptées à sa situation.',
      actions = '["Écoute confidentielle","Orientation vers un soutien psychologique et médical","Accompagnement dans les démarches juridiques"]'::jsonb
  where slug = 'soutenir' and detail is null;

update public.missions
  set detail = 'Nous portons la voix des victimes auprès des institutions pour faire évoluer les lois et les politiques publiques congolaises contre les violences de genre.',
      actions = '["Dialogue avec les institutions","Propositions de réformes législatives","Suivi des politiques publiques"]'::jsonb
  where slug = 'plaider' and detail is null;

update public.missions
  set detail = 'Médecins, policiers et travailleurs sociaux sont formés à un accueil digne et adapté des victimes, pour que chaque prise en charge soit à la hauteur de ce qu''elles traversent.',
      actions = '["Formation des personnels de santé","Formation des forces de l''ordre","Formation des travailleurs sociaux"]'::jsonb
  where slug = 'former' and detail is null;

-- Valeurs manquantes : le schéma initial n'en avait que pour « soutenir » et « former »
insert into public.valeurs (mission_id, libelle, ordre)
  select ms.id, v.libelle, v.ordre
  from public.missions ms
  cross join (values ('Information', 1), ('Dialogue', 2), ('Proximité', 3)) as v(libelle, ordre)
  where ms.slug = 'prevenir'
    and not exists (select 1 from public.valeurs x where x.mission_id = ms.id);

insert into public.valeurs (mission_id, libelle, ordre)
  select ms.id, v.libelle, v.ordre
  from public.missions ms
  cross join (values ('Justice', 1), ('Engagement', 2), ('Persévérance', 3)) as v(libelle, ordre)
  where ms.slug = 'plaider'
    and not exists (select 1 from public.valeurs x where x.mission_id = ms.id);

-- Vision de l'accueil. Le schéma initial contenait un texte de départ qui n'est
-- pas celui affiché par le site : on le remplace par le texte actuel du site,
-- sans toucher à une vision déjà modifiée par l'équipe.
update public.pages_content
  set content = '{"titre":"Personne ne devrait affronter la violence seule.","texte":"Une femme qui ose parler doit trouver une écoute digne à chaque porte où elle frappe : sa famille, l''hôpital, le commissariat, le tribunal. C''est ce que nous construisons, avec nos valeurs pour boussole.","valeurs":["Confiance","Solidarité","Bienveillance","Tolérance","Respect civique de tous"]}'::jsonb
  where key = 'home.vision'
    and content->>'titre' = 'Un monde sans violences de genre. Ensemble, pour le rétablissement.';

insert into public.pages_content (key, title, content)
values ('home.vision', 'Notre vision', '{"titre":"Personne ne devrait affronter la violence seule.","texte":"Une femme qui ose parler doit trouver une écoute digne à chaque porte où elle frappe : sa famille, l''hôpital, le commissariat, le tribunal. C''est ce que nous construisons, avec nos valeurs pour boussole.","valeurs":["Confiance","Solidarité","Bienveillance","Tolérance","Respect civique de tous"]}'::jsonb)
on conflict (key) do update
  set content = public.pages_content.content
    || jsonb_build_object('valeurs', '["Confiance","Solidarité","Bienveillance","Tolérance","Respect civique de tous"]'::jsonb)
  where not (public.pages_content.content ? 'valeurs');
