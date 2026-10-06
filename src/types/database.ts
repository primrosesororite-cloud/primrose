/**
 * Types Supabase pour Primrose – La Sororité Active.
 * Écrits à la main pour correspondre à supabase/migrations/001_schema_primrose.sql.
 * À régénérer avec `supabase gen types typescript --project-id <id> > src/types/database.ts`
 * dès que le projet Supabase est provisionné, pour rester la source de vérité.
 */

export type UserRole = "super_admin" | "admin" | "editor";
export type RequestStatus = "nouveau" | "en_cours" | "traite" | "archive";
export type MemberType = "membre" | "benevole" | "partenaire" | "donateur";
export type UrgencyLevel = "normal" | "important" | "urgent";
export type FormationStatut = "brouillon" | "ouverte" | "complete" | "terminee";
export type MoyenContact = "telephone" | "whatsapp" | "email";
export type Plateforme =
  | "instagram"
  | "x"
  | "facebook"
  | "youtube"
  | "tiktok"
  | "whatsapp"
  | "linkedin";

type NoRelationships = { Relationships: [] };

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string;
          role: UserRole;
          avatar_url: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name?: string;
          role?: UserRole;
          avatar_url?: string | null;
          is_active?: boolean;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
      } & NoRelationships;
      pages_content: {
        Row: {
          key: string;
          title: string | null;
          content: Record<string, unknown>;
          updated_by: string | null;
          updated_at: string;
        };
        Insert: {
          key: string;
          title?: string | null;
          content?: Record<string, unknown>;
          updated_by?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["pages_content"]["Insert"]>;
      } & NoRelationships;
      missions: {
        Row: {
          id: string;
          slug: string;
          titre: string;
          description: string;
          icone: string | null;
          ordre: number;
          actif: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          titre: string;
          description: string;
          icone?: string | null;
          ordre?: number;
          actif?: boolean;
        };
        Update: Partial<Database["public"]["Tables"]["missions"]["Insert"]>;
      } & NoRelationships;
      valeurs: {
        Row: {
          id: string;
          mission_id: string | null;
          libelle: string;
          ordre: number;
        };
        Insert: {
          id?: string;
          mission_id?: string | null;
          libelle: string;
          ordre?: number;
        };
        Update: Partial<Database["public"]["Tables"]["valeurs"]["Insert"]>;
      } & NoRelationships;
      chiffres_cles: {
        Row: {
          id: string;
          libelle: string;
          valeur: number;
          suffixe: string;
          ordre: number;
          actif: boolean;
        };
        Insert: {
          id?: string;
          libelle: string;
          valeur?: number;
          suffixe?: string;
          ordre?: number;
          actif?: boolean;
        };
        Update: Partial<Database["public"]["Tables"]["chiffres_cles"]["Insert"]>;
      } & NoRelationships;
      formations: {
        Row: {
          id: string;
          slug: string;
          titre: string;
          description: string | null;
          public_cible: string | null;
          date_debut: string | null;
          lieu: string | null;
          places: number | null;
          statut: FormationStatut;
          image_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          titre: string;
          description?: string | null;
          public_cible?: string | null;
          date_debut?: string | null;
          lieu?: string | null;
          places?: number | null;
          statut?: FormationStatut;
          image_url?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["formations"]["Insert"]>;
      } & NoRelationships;
      actualites: {
        Row: {
          id: string;
          slug: string;
          titre: string;
          resume: string | null;
          contenu: Record<string, unknown> | null;
          image_url: string | null;
          publie: boolean;
          date_publication: string | null;
          auteur_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          titre: string;
          resume?: string | null;
          contenu?: Record<string, unknown> | null;
          image_url?: string | null;
          publie?: boolean;
          date_publication?: string | null;
          auteur_id?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["actualites"]["Insert"]>;
      } & NoRelationships;
      evenements: {
        Row: {
          id: string;
          titre: string;
          description: string | null;
          date_evenement: string;
          lieu: string | null;
          image_url: string | null;
          publie: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          titre: string;
          description?: string | null;
          date_evenement: string;
          lieu?: string | null;
          image_url?: string | null;
          publie?: boolean;
        };
        Update: Partial<Database["public"]["Tables"]["evenements"]["Insert"]>;
      } & NoRelationships;
      equipe: {
        Row: {
          id: string;
          nom: string;
          fonction: string | null;
          bio: string | null;
          photo_url: string | null;
          ordre: number;
          actif: boolean;
        };
        Insert: {
          id?: string;
          nom: string;
          fonction?: string | null;
          bio?: string | null;
          photo_url?: string | null;
          ordre?: number;
          actif?: boolean;
        };
        Update: Partial<Database["public"]["Tables"]["equipe"]["Insert"]>;
      } & NoRelationships;
      partenaires: {
        Row: {
          id: string;
          nom: string;
          logo_url: string | null;
          lien: string | null;
          ordre: number;
          actif: boolean;
        };
        Insert: {
          id?: string;
          nom: string;
          logo_url?: string | null;
          lien?: string | null;
          ordre?: number;
          actif?: boolean;
        };
        Update: Partial<Database["public"]["Tables"]["partenaires"]["Insert"]>;
      } & NoRelationships;
      medias: {
        Row: {
          id: string;
          url: string;
          chemin: string;
          alt: string;
          taille_octets: number | null;
          uploaded_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          url: string;
          chemin: string;
          alt: string;
          taille_octets?: number | null;
          uploaded_by?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["medias"]["Insert"]>;
      } & NoRelationships;
      reseaux_sociaux: {
        Row: {
          id: string;
          plateforme: Plateforme;
          url: string;
          actif: boolean;
        };
        Insert: {
          id?: string;
          plateforme: Plateforme;
          url: string;
          actif?: boolean;
        };
        Update: Partial<Database["public"]["Tables"]["reseaux_sociaux"]["Insert"]>;
      } & NoRelationships;
      parametres_site: {
        Row: {
          id: number;
          nom: string;
          slogan: string | null;
          email: string | null;
          telephone: string | null;
          adresse: string | null;
          numeros_urgence: unknown[];
          updated_at: string;
        };
        Insert: {
          id?: number;
          nom?: string;
          slogan?: string | null;
          email?: string | null;
          telephone?: string | null;
          adresse?: string | null;
          numeros_urgence?: unknown[];
        };
        Update: Partial<Database["public"]["Tables"]["parametres_site"]["Insert"]>;
      } & NoRelationships;
      formation_inscriptions: {
        Row: {
          id: string;
          formation_id: string;
          nom: string;
          email: string;
          telephone: string | null;
          message: string | null;
          statut: "en_attente" | "acceptee" | "refusee";
          created_at: string;
        };
        Insert: {
          id?: string;
          formation_id: string;
          nom: string;
          email: string;
          telephone?: string | null;
          message?: string | null;
          statut?: "en_attente" | "acceptee" | "refusee";
        };
        Update: Partial<Database["public"]["Tables"]["formation_inscriptions"]["Insert"]>;
      } & NoRelationships;
      membres_demandes: {
        Row: {
          id: string;
          type: MemberType;
          nom: string;
          email: string;
          telephone: string | null;
          ville: string | null;
          motivation: string | null;
          statut: RequestStatus;
          created_at: string;
        };
        Insert: {
          id?: string;
          type: MemberType;
          nom: string;
          email: string;
          telephone?: string | null;
          ville?: string | null;
          motivation?: string | null;
          statut?: RequestStatus;
        };
        Update: Partial<Database["public"]["Tables"]["membres_demandes"]["Insert"]>;
      } & NoRelationships;
      messages_contact: {
        Row: {
          id: string;
          nom: string;
          email: string;
          telephone: string | null;
          sujet: string | null;
          message: string;
          lu: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          nom: string;
          email: string;
          telephone?: string | null;
          sujet?: string | null;
          message: string;
          lu?: boolean;
        };
        Update: Partial<Database["public"]["Tables"]["messages_contact"]["Insert"]>;
      } & NoRelationships;
      demandes_aide: {
        Row: {
          id: string;
          moyen_contact: MoyenContact;
          coordonnee: string;
          message: string | null;
          urgence: UrgencyLevel;
          ne_pas_recontacter_avant: string | null;
          statut: RequestStatus;
          notes_internes: string | null;
          assignee_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          moyen_contact: MoyenContact;
          coordonnee: string;
          message?: string | null;
          urgence?: UrgencyLevel;
          ne_pas_recontacter_avant?: string | null;
          statut?: RequestStatus;
        };
        Update: Partial<
          Database["public"]["Tables"]["demandes_aide"]["Insert"] & {
            notes_internes: string | null;
            assignee_id: string | null;
          }
        >;
      } & NoRelationships;
      audit_logs: {
        Row: {
          id: number;
          user_id: string | null;
          action: string;
          table_name: string;
          record_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: number;
          user_id?: string | null;
          action: string;
          table_name: string;
          record_id?: string | null;
        };
        Update: never;
      } & NoRelationships;
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      user_role: UserRole;
      request_status: RequestStatus;
      member_type: MemberType;
      urgency_level: UrgencyLevel;
    };
    CompositeTypes: Record<string, never>;
  };
}
