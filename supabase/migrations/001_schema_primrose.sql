-- =====================================================================
-- Primrose – La Sororité Active : schéma initial Supabase
-- À exécuter dans le SQL Editor ou via `supabase db push`
-- =====================================================================

-- ---------- Types ----------
create type public.user_role as enum ('super_admin', 'admin', 'editor');
create type public.request_status as enum ('nouveau', 'en_cours', 'traite', 'archive');
create type public.member_type as enum ('membre', 'benevole', 'partenaire', 'donateur');
create type public.urgency_level as enum ('normal', 'important', 'urgent');

-- ---------- Fonction updated_at ----------
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

-- ---------- Profiles ----------
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  role public.user_role not null default 'editor',
  avatar_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_profiles_updated before update on public.profiles
  for each row execute function public.set_updated_at();

-- Création automatique du profil (rôle editor par défaut, promu manuellement)
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', ''));
  return new;
end $$;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------- Fonctions de rôle (utilisées par les policies) ----------
create or replace function public.current_role_name()
returns public.user_role language sql stable security definer set search_path = public as $$
  select role from public.profiles where id = auth.uid() and is_active = true
$$;

create or replace function public.is_staff()      -- super_admin, admin, editor
returns boolean language sql stable security definer set search_path = public as $$
  select coalesce(public.current_role_name() in ('super_admin','admin','editor'), false)
$$;

create or replace function public.is_admin()      -- super_admin, admin
returns boolean language sql stable security definer set search_path = public as $$
  select coalesce(public.current_role_name() in ('super_admin','admin'), false)
$$;

create or replace function public.is_super_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select coalesce(public.current_role_name() = 'super_admin', false)
$$;

-- ---------- Contenus éditables ----------
create table public.pages_content (
  key text primary key,                 -- ex. 'home.vision'
  title text,
  content jsonb not null default '{}',
  updated_by uuid references public.profiles(id),
  updated_at timestamptz not null default now()
);
create trigger trg_pages_content_updated before update on public.pages_content
  for each row execute function public.set_updated_at();

create table public.missions (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  titre text not null,
  description text not null,
  icone text,
  ordre int not null default 0,
  actif boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_missions_updated before update on public.missions
  for each row execute function public.set_updated_at();

create table public.valeurs (
  id uuid primary key default gen_random_uuid(),
  mission_id uuid references public.missions(id) on delete cascade,
  libelle text not null,
  ordre int not null default 0
);

create table public.chiffres_cles (
  id uuid primary key default gen_random_uuid(),
  libelle text not null,
  valeur int not null default 0,
  suffixe text default '',
  ordre int not null default 0,
  actif boolean not null default true
);

create table public.formations (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  titre text not null,
  description text,
  public_cible text,
  date_debut timestamptz,
  lieu text,
  places int,
  statut text not null default 'brouillon' check (statut in ('brouillon','ouverte','complete','terminee')),
  image_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_formations_updated before update on public.formations
  for each row execute function public.set_updated_at();

create table public.actualites (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  titre text not null,
  resume text,
  contenu jsonb,
  image_url text,
  publie boolean not null default false,
  date_publication timestamptz,
  auteur_id uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_actualites_updated before update on public.actualites
  for each row execute function public.set_updated_at();

create table public.evenements (
  id uuid primary key default gen_random_uuid(),
  titre text not null,
  description text,
  date_evenement timestamptz not null,
  lieu text,
  image_url text,
  publie boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.equipe (
  id uuid primary key default gen_random_uuid(),
  nom text not null,
  fonction text,
  bio text,
  photo_url text,
  ordre int not null default 0,
  actif boolean not null default true
);

create table public.partenaires (
  id uuid primary key default gen_random_uuid(),
  nom text not null,
  logo_url text,
  lien text,
  ordre int not null default 0,
  actif boolean not null default true
);

create table public.reseaux_sociaux (
  id uuid primary key default gen_random_uuid(),
  plateforme text not null check (plateforme in ('instagram','x','facebook','youtube','tiktok','whatsapp','linkedin')),
  url text not null,
  actif boolean not null default true
);

create table public.parametres_site (
  id int primary key default 1 check (id = 1),   -- ligne unique
  nom text not null default 'Primrose – La Sororité Active',
  slogan text,
  email text,
  telephone text,
  adresse text,
  numeros_urgence jsonb not null default '[]',
  updated_at timestamptz not null default now()
);
insert into public.parametres_site (id) values (1);

-- ---------- Formulaires publics ----------
create table public.formation_inscriptions (
  id uuid primary key default gen_random_uuid(),
  formation_id uuid not null references public.formations(id) on delete cascade,
  nom text not null check (char_length(nom) between 2 and 120),
  email text not null check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  telephone text,
  message text check (char_length(message) <= 2000),
  statut text not null default 'en_attente' check (statut in ('en_attente','acceptee','refusee')),
  created_at timestamptz not null default now()
);

create table public.membres_demandes (
  id uuid primary key default gen_random_uuid(),
  type public.member_type not null,
  nom text not null check (char_length(nom) between 2 and 120),
  email text not null check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  telephone text,
  ville text,
  motivation text check (char_length(motivation) <= 3000),
  statut public.request_status not null default 'nouveau',
  created_at timestamptz not null default now()
);

create table public.messages_contact (
  id uuid primary key default gen_random_uuid(),
  nom text not null check (char_length(nom) between 2 and 120),
  email text not null check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  telephone text,
  sujet text,
  message text not null check (char_length(message) between 5 and 4000),
  lu boolean not null default false,
  created_at timestamptz not null default now()
);

-- Données sensibles : accès restreint. `coordonnee` et `message` contiennent
-- le texte chiffré (AES-256-GCM applicatif, voir src/lib/crypto.ts), jamais
-- la valeur en clair — d'où une limite de longueur plus large que le texte
-- source (max 4000 caractères) pour absorber le surcoût du chiffrement/base64.
create table public.demandes_aide (
  id uuid primary key default gen_random_uuid(),
  moyen_contact text not null check (moyen_contact in ('telephone','whatsapp','email')),
  coordonnee text not null,
  message text check (char_length(message) <= 24000),
  urgence public.urgency_level not null default 'normal',
  ne_pas_recontacter_avant date,
  statut public.request_status not null default 'nouveau',
  notes_internes text,
  assignee_id uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_demandes_aide_updated before update on public.demandes_aide
  for each row execute function public.set_updated_at();

-- ---------- Médiathèque ----------
create table public.medias (
  id uuid primary key default gen_random_uuid(),
  url text not null,
  chemin text not null,              -- chemin dans le bucket Storage (pour suppression)
  alt text not null check (char_length(alt) >= 1),
  taille_octets int,
  uploaded_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

-- ---------- Audit ----------
create table public.audit_logs (
  id bigint generated always as identity primary key,
  user_id uuid references public.profiles(id),
  action text not null,                 -- INSERT / UPDATE / DELETE / READ
  table_name text not null,
  record_id text,
  created_at timestamptz not null default now()
);

create or replace function public.log_audit()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.audit_logs (user_id, action, table_name, record_id)
  values (auth.uid(), tg_op, tg_table_name,
          coalesce((case when tg_op = 'DELETE' then old.id else new.id end)::text, null));
  return coalesce(new, old);
end $$;

create trigger audit_demandes_aide after insert or update or delete on public.demandes_aide
  for each row execute function public.log_audit();
create trigger audit_membres after update or delete on public.membres_demandes
  for each row execute function public.log_audit();
create trigger audit_formations after insert or update or delete on public.formations
  for each row execute function public.log_audit();
create trigger audit_actualites after insert or update or delete on public.actualites
  for each row execute function public.log_audit();

-- =====================================================================
-- ROW LEVEL SECURITY
-- =====================================================================
alter table public.profiles               enable row level security;
alter table public.pages_content          enable row level security;
alter table public.missions               enable row level security;
alter table public.valeurs                enable row level security;
alter table public.chiffres_cles          enable row level security;
alter table public.formations             enable row level security;
alter table public.actualites             enable row level security;
alter table public.evenements             enable row level security;
alter table public.equipe                 enable row level security;
alter table public.partenaires            enable row level security;
alter table public.reseaux_sociaux        enable row level security;
alter table public.parametres_site        enable row level security;
alter table public.formation_inscriptions enable row level security;
alter table public.membres_demandes       enable row level security;
alter table public.messages_contact       enable row level security;
alter table public.demandes_aide          enable row level security;
alter table public.audit_logs             enable row level security;
alter table public.medias                 enable row level security;

-- Profiles
create policy "profil: lecture soi-même ou admin" on public.profiles
  for select using (id = auth.uid() or public.is_admin());
create policy "profil: modification soi-même (sans changer le rôle)" on public.profiles
  for update using (id = auth.uid())
  with check (id = auth.uid() and role = public.current_role_name());
create policy "profil: gestion super_admin" on public.profiles
  for all using (public.is_super_admin()) with check (public.is_super_admin());

-- Contenus publics : lecture publique (actifs/publiés), écriture staff
create policy "pages_content: lecture publique" on public.pages_content for select using (true);
create policy "pages_content: écriture staff" on public.pages_content
  for all using (public.is_staff()) with check (public.is_staff());

create policy "missions: lecture publique" on public.missions for select using (actif or public.is_staff());
create policy "missions: écriture staff" on public.missions
  for all using (public.is_staff()) with check (public.is_staff());

create policy "valeurs: lecture publique" on public.valeurs for select using (true);
create policy "valeurs: écriture staff" on public.valeurs
  for all using (public.is_staff()) with check (public.is_staff());

create policy "chiffres: lecture publique" on public.chiffres_cles for select using (actif or public.is_staff());
create policy "chiffres: écriture staff" on public.chiffres_cles
  for all using (public.is_staff()) with check (public.is_staff());

create policy "formations: lecture publique" on public.formations
  for select using (statut <> 'brouillon' or public.is_staff());
create policy "formations: écriture staff" on public.formations
  for all using (public.is_staff()) with check (public.is_staff());

create policy "actualites: lecture publique" on public.actualites
  for select using ((publie and date_publication <= now()) or public.is_staff());
create policy "actualites: écriture staff" on public.actualites
  for all using (public.is_staff()) with check (public.is_staff());

create policy "evenements: lecture publique" on public.evenements
  for select using (publie or public.is_staff());
create policy "evenements: écriture staff" on public.evenements
  for all using (public.is_staff()) with check (public.is_staff());

create policy "equipe: lecture publique" on public.equipe for select using (actif or public.is_staff());
create policy "equipe: écriture staff" on public.equipe
  for all using (public.is_staff()) with check (public.is_staff());

create policy "partenaires: lecture publique" on public.partenaires for select using (actif or public.is_staff());
create policy "partenaires: écriture staff" on public.partenaires
  for all using (public.is_staff()) with check (public.is_staff());

create policy "reseaux: lecture publique" on public.reseaux_sociaux for select using (actif or public.is_staff());
create policy "reseaux: écriture staff" on public.reseaux_sociaux
  for all using (public.is_staff()) with check (public.is_staff());

create policy "parametres: lecture publique" on public.parametres_site for select using (true);
create policy "parametres: écriture admin" on public.parametres_site
  for update using (public.is_admin()) with check (public.is_admin());

create policy "medias: lecture publique" on public.medias for select using (true);
create policy "medias: écriture staff" on public.medias
  for all using (public.is_staff()) with check (public.is_staff());

-- Formulaires : insertion publique, lecture/gestion admin uniquement (pas editor)
create policy "inscriptions: insertion publique" on public.formation_inscriptions
  for insert with check (statut = 'en_attente');
create policy "inscriptions: gestion admin" on public.formation_inscriptions
  for all using (public.is_admin()) with check (public.is_admin());

create policy "adhesions: insertion publique" on public.membres_demandes
  for insert with check (statut = 'nouveau');
create policy "adhesions: gestion admin" on public.membres_demandes
  for all using (public.is_admin()) with check (public.is_admin());

create policy "contact: insertion publique" on public.messages_contact
  for insert with check (lu = false);
create policy "contact: gestion admin" on public.messages_contact
  for all using (public.is_admin()) with check (public.is_admin());

-- Demandes d'aide : insertion publique, JAMAIS de lecture publique
create policy "aide: insertion publique" on public.demandes_aide
  for insert with check (statut = 'nouveau' and notes_internes is null and assignee_id is null);
create policy "aide: gestion admin" on public.demandes_aide
  for all using (public.is_admin()) with check (public.is_admin());

-- Audit : lecture super_admin uniquement. Écriture via triggers (INSERT/
-- UPDATE/DELETE) pour la plupart des tables ; les triggers, en tant que
-- fonctions security definer possédées par le rôle propriétaire, contournent
-- RLS. Les CONSULTATIONS (SELECT) ne déclenchent pas de trigger Postgres :
-- l'admin les journalise donc lui-même côté application, d'où cette policy
-- d'insertion restreinte à sa propre identité.
create policy "audit: lecture super_admin" on public.audit_logs
  for select using (public.is_super_admin());
create policy "audit: insertion de sa propre consultation" on public.audit_logs
  for insert with check (public.is_admin() and user_id = auth.uid());

-- =====================================================================
-- STORAGE
-- =====================================================================
insert into storage.buckets (id, name, public) values
  ('images-public', 'images-public', true),
  ('documents-prives', 'documents-prives', false)
on conflict do nothing;

create policy "images: lecture publique" on storage.objects
  for select using (bucket_id = 'images-public');
create policy "images: upload staff" on storage.objects
  for insert with check (bucket_id = 'images-public' and public.is_staff());
create policy "images: modification staff" on storage.objects
  for update using (bucket_id = 'images-public' and public.is_staff());
create policy "images: suppression staff" on storage.objects
  for delete using (bucket_id = 'images-public' and public.is_staff());
create policy "documents: accès admin" on storage.objects
  for all using (bucket_id = 'documents-prives' and public.is_admin())
  with check (bucket_id = 'documents-prives' and public.is_admin());

-- =====================================================================
-- SEED (repris de la maquette, textes corrigés)
-- =====================================================================
insert into public.missions (slug, titre, description, icone, ordre) values
  ('prevenir',  'PRÉVENIR',  'Organiser des campagnes, ateliers et conférences de grande envergure pour éduquer le grand public.', 'megaphone', 1),
  ('soutenir',  'SOUTENIR',  'Apporter un soutien psychologique, médical et légal aux victimes.', 'handshake-heart', 2),
  ('plaider',   'PLAIDER',   'Plaider pour des changements législatifs et des politiques publiques contre les violences.', 'flag', 3),
  ('former',    'FORMER',    'Former les professionnels (médecins, policiers, etc.) en charge des victimes.', 'certificate', 4);

insert into public.valeurs (mission_id, libelle, ordre)
select id, v.libelle, v.ordre
from public.missions m
join (values
  ('soutenir', 'Confiance', 1), ('soutenir', 'Solidarité', 2),
  ('soutenir', 'Bienveillance', 3), ('soutenir', 'Tolérance', 4),
  ('former',   'Confiance', 1), ('former',   'Solidarité', 2),
  ('former',   'Respect civique de tous', 3)
) as v(slug, libelle, ordre) on v.slug = m.slug;

insert into public.pages_content (key, title, content) values
  ('home.vision', 'Notre vision', jsonb_build_object(
    'titre', 'Un monde sans violences de genre. Ensemble, pour le rétablissement.',
    'texte', 'Contribuer à la prévention et à la sensibilisation aux violences de genre, tout en soutenant les victimes dans leur rétablissement.'
  ));

insert into public.chiffres_cles (libelle, valeur, suffixe, ordre) values
  ('Personnes sensibilisées', 0, '+', 1),
  ('Ateliers organisés', 0, '', 2),
  ('Victimes accompagnées', 0, '', 3),
  ('Professionnels formés', 0, '', 4);

insert into public.reseaux_sociaux (plateforme, url, actif) values
  ('instagram', 'https://instagram.com/primrose.sororite', true),
  ('x', 'https://x.com/primrose_sororite', true),
  ('facebook', 'https://facebook.com/primrose.sororite', true),
  ('youtube', 'https://youtube.com/@primrose-sororite', true),
  ('tiktok', 'https://tiktok.com/@primrose.sororite', true);

-- Numéros à faire vérifier et renseigner par l'association avant mise en ligne
-- (ne jamais publier un numéro d'urgence non confirmé sur une page consultée
-- par des personnes en danger).
update public.parametres_site set
  email = 'contact@sororiteprimrose.org',
  numeros_urgence = '[{"label": "Ligne d''écoute Primrose", "numero": "À RENSEIGNER"}]'::jsonb
where id = 1;

-- Promotion du premier super_admin (à exécuter manuellement après création du compte) :
-- update public.profiles set role = 'super_admin' where id = '<UUID_DU_COMPTE>';
