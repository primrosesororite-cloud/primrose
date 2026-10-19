-- =====================================================================
-- Primrose – Documents publics (rapports, guides, plaidoyers…)
-- Fichiers PDF ajoutés par l'équipe et lisibles sur le site.
-- =====================================================================

create table public.documents (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  titre text not null check (char_length(titre) between 1 and 200),
  description text check (char_length(description) <= 1000),
  categorie text not null default 'autre'
    check (categorie in ('rapport','guide','plaidoyer','formation','juridique','autre')),
  fichier_url text not null,
  chemin text not null,              -- chemin dans le bucket Storage (pour suppression)
  taille_octets int check (taille_octets >= 0),
  publie boolean not null default false,
  date_publication date,
  uploaded_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index documents_publie_idx on public.documents (publie, date_publication desc);
create trigger trg_documents_updated before update on public.documents
  for each row execute function public.set_updated_at();
create trigger audit_documents after insert or update or delete on public.documents
  for each row execute function public.log_audit();

alter table public.documents enable row level security;

create policy "documents: lecture publique" on public.documents
  for select using (publie or public.is_staff());
create policy "documents: écriture staff" on public.documents
  for all using (public.is_staff()) with check (public.is_staff());

-- ---------- Storage : PDF publics, 20 Mo max ----------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types) values
  ('documents-public', 'documents-public', true, 20971520, array['application/pdf'])
on conflict (id) do nothing;

create policy "documents publics: lecture publique" on storage.objects
  for select using (bucket_id = 'documents-public');
create policy "documents publics: upload staff" on storage.objects
  for insert with check (bucket_id = 'documents-public' and public.is_staff());
create policy "documents publics: modification staff" on storage.objects
  for update using (bucket_id = 'documents-public' and public.is_staff());
create policy "documents publics: suppression staff" on storage.objects
  for delete using (bucket_id = 'documents-public' and public.is_staff());
