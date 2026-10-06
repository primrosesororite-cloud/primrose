import { Link } from "@/i18n/navigation";
import { ArrowUpRight, ShieldAlert, UserPlus, Mail, GraduationCap, Newspaper } from "lucide-react";
import { requireStaff } from "@/lib/admin/current-admin";
import { createClient } from "@/lib/supabase/server";
import type { LucideIcon } from "lucide-react";
import type { UserRole } from "@/types/database";

type Stat = {
  label: string;
  value: number;
  hint: string;
  href: string;
  Icon: LucideIcon;
  emphasis?: boolean;
};

async function count(
  run: () => PromiseLike<{ count: number | null }>
): Promise<number> {
  const { count: n } = await run();
  return n ?? 0;
}

function greeting() {
  const h = new Date().getHours();
  return h < 12 ? "Bonjour" : h < 18 ? "Bon après-midi" : "Bonsoir";
}

export default async function AdminDashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const { profile } = await requireStaff(locale);
  const supabase = await createClient();
  const role: UserRole = profile.role;
  const canSeeRequests = role !== "editor";

  const [
  aideNouvelles,
  aideUrgentes,
  adhesions,
  messages,
  inscriptions,
  formationsOuvertes,
  actualitesPubliees,
  ] = await Promise.all([
  canSeeRequests
  ? count(() => supabase.from("demandes_aide").select("id", { count: "exact", head: true }).eq("statut", "nouveau"))
  : Promise.resolve(0),
  canSeeRequests
  ? count(() => supabase.from("demandes_aide").select("id", { count: "exact", head: true }).eq("statut", "nouveau").eq("urgence", "urgent"))
  : Promise.resolve(0),
  canSeeRequests
  ? count(() => supabase.from("membres_demandes").select("id", { count: "exact", head: true }).eq("statut", "nouveau"))
  : Promise.resolve(0),
  canSeeRequests
  ? count(() => supabase.from("messages_contact").select("id", { count: "exact", head: true }).eq("lu", false))
  : Promise.resolve(0),
  canSeeRequests
  ? count(() => supabase.from("formation_inscriptions").select("id", { count: "exact", head: true }).eq("statut", "en_attente"))
  : Promise.resolve(0),
  count(() => supabase.from("formations").select("id", { count: "exact", head: true }).eq("statut", "ouverte")),
  count(() => supabase.from("actualites").select("id", { count: "exact", head: true }).eq("publie", true)),
  ]);

  const aTraiter: Stat[] = canSeeRequests
  ? [
  {
  label: "Demandes d'aide nouvelles",
  value: aideNouvelles,
  hint: aideUrgentes > 0 ? `dont ${aideUrgentes} urgente${aideUrgentes > 1 ? "s" : ""}` : "Aucune urgence en attente",
  href: "/admin/demandes-aide",
  Icon: ShieldAlert,
  emphasis: aideUrgentes > 0,
  },
  {
  label: "Adhésions à traiter",
  value: adhesions,
  hint: "Nouvelles candidatures",
  href: "/admin/adhesions",
  Icon: UserPlus,
  },
  {
  label: "Messages non lus",
  value: messages,
  hint: "Formulaire de contact",
  href: "/admin/messages",
  Icon: Mail,
  },
  {
  label: "Inscriptions en attente",
  value: inscriptions,
  hint: "Formations",
  href: "/admin/formations",
  Icon: GraduationCap,
  },
  ]
  : [];

  const contenu: Stat[] = [
  {
  label: "Formations ouvertes",
  value: formationsOuvertes,
  hint: "Visibles sur le site",
  href: "/admin/formations",
  Icon: GraduationCap,
  },
  {
  label: "Actualités publiées",
  value: actualitesPubliees,
  hint: "Articles en ligne",
  href: "/admin/actualites",
  Icon: Newspaper,
  },
  ];

  return (
  <div className="space-y-10">
  <header>
  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primrose-forest/70">
  {greeting()}
  </p>
  <h1 className="mt-1 font-serif text-3xl text-primrose-forest">
  {profile.full_name || "Bienvenue"}
  </h1>
  <p className="mt-2 max-w-2xl text-primrose-ink/75">
  {canSeeRequests
  ? "Voici ce qui demande votre attention aujourd'hui."
  : "Gérez les contenus publiés sur le site de l'association."}
  </p>
  </header>

  {aTraiter.length > 0 && (
  <section aria-labelledby="a-traiter">
  <h2 id="a-traiter" className="text-xs font-semibold uppercase tracking-[0.16em] text-primrose-ink/60">
  À traiter
  </h2>
  <ul className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
  {aTraiter.map((stat) => (
  <StatCard key={stat.label} stat={stat} />
  ))}
  </ul>
  </section>
  )}

  <section aria-labelledby="contenu">
  <h2 id="contenu" className="text-xs font-semibold uppercase tracking-[0.16em] text-primrose-ink/60">
  Contenu du site
  </h2>
  <ul className="mt-4 grid gap-4 sm:grid-cols-2">
  {contenu.map((stat) => (
  <StatCard key={stat.label} stat={stat} />
  ))}
  </ul>
  </section>
  </div>
  );
}

function StatCard({ stat }: { stat: Stat }) {
  const { Icon } = stat;
  return (
  <li>
  <Link
  href={stat.href}
  className="group flex h-full flex-col justify-between rounded-2xl border border-primrose-ink/10 bg-primrose-white p-6 shadow-[0_18px_40px_-30px_rgba(58,46,42,0.4)] transition-[transform,box-shadow,border-color] duration-300 hover:border-primrose-forest/30 hover:shadow-[0_24px_50px_-28px_rgba(52,80,59,0.45)]"
  >
  <div className="flex items-start justify-between">
  <span
  className={
  stat.emphasis
  ? "flex h-11 w-11 items-center justify-center rounded-xl bg-primrose-alert/10 text-primrose-alert"
  : "flex h-11 w-11 items-center justify-center rounded-xl bg-primrose-green/20 text-primrose-forest"
  }
  >
  <Icon aria-hidden className="h-5 w-5" />
  </span>
  <ArrowUpRight
  aria-hidden
  className="h-4 w-4 text-primrose-ink/40 transition-all duration-300 group-hover:text-primrose-forest"
  />
  </div>
  <div className="mt-8">
  <p className="font-serif text-4xl leading-none text-primrose-ink">{stat.value}</p>
  <p className="mt-2 text-sm font-semibold text-primrose-ink">{stat.label}</p>
  <p className={stat.emphasis ? "mt-1 text-xs font-semibold text-primrose-alert" : "mt-1 text-xs text-primrose-ink/65"}>
  {stat.hint}
  </p>
  </div>
  </Link>
  </li>
  );
}
