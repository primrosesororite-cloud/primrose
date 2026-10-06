-- =====================================================================
-- Primrose : compte super_admin par défaut — DÉVELOPPEMENT LOCAL UNIQUEMENT
-- =====================================================================
-- ⚠️ Ne JAMAIS exécuter ce script sur un projet Supabase de production.
-- Il crée un compte avec un mot de passe connu et documenté en clair dans
-- le dépôt Git — acceptable uniquement pour un environnement de dev jetable.
--
-- En production, créez le premier compte via /connexion (inscription
-- normale) puis promouvez-le manuellement avec la requête donnée à la fin
-- de 001_schema_primrose.sql. Voir aussi docs/deploiement.md, section 1.
--
-- Identifiants créés ici :
--   email    : admin@primrose.local
--   mot de passe : ChangeMe123!
-- À exécuter une fois, après 001_schema_primrose.sql, dans le SQL Editor
-- d'un projet Supabase de développement/test.
--
-- Si une version précédente de ce script a déjà créé le compte (connexion
-- en erreur 500), supprimez-le d'abord :
--   delete from auth.users where email = 'admin@primrose.local';
-- =====================================================================

create extension if not exists pgcrypto;

do $$
declare
  v_admin_id uuid := gen_random_uuid();
  v_email text := 'admin@primrose.local';
  v_password text := 'ChangeMe123!';
begin
  if exists (select 1 from auth.users where email = v_email) then
    raise notice 'Le compte % existe déjà, aucune action.', v_email;
    return;
  end if;

  -- Les colonnes de jetons doivent être '' et non NULL : GoTrue échoue en 500
  -- à la connexion si elles sont NULL.
  insert into auth.users (
    instance_id, id, aud, role, email, encrypted_password,
    email_confirmed_at, created_at, updated_at,
    raw_app_meta_data, raw_user_meta_data, is_sso_user,
    confirmation_token, recovery_token, email_change_token_new,
    email_change, email_change_token_current, reauthentication_token
  ) values (
    '00000000-0000-0000-0000-000000000000', v_admin_id, 'authenticated', 'authenticated',
    v_email, crypt(v_password, gen_salt('bf')),
    now(), now(), now(),
    '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb, false,
    '', '', '', '', '', ''
  );

  insert into auth.identities (
    id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
  ) values (
    gen_random_uuid(), v_admin_id, v_admin_id::text,
    jsonb_build_object('sub', v_admin_id::text, 'email', v_email),
    'email', now(), now(), now()
  );

  -- Le trigger on_auth_user_created a déjà créé le profil (rôle editor
  -- par défaut) ; on le promeut ici en super_admin.
  update public.profiles
  set role = 'super_admin', full_name = 'Administrateur (dev)'
  where id = v_admin_id;

  raise notice 'Compte super_admin créé : % / %', v_email, v_password;
end $$;
