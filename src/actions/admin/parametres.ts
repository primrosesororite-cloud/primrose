"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { parametresSchema, numeroUrgenceSchema } from "@/lib/validations/admin/parametres";

type ActionResult = { error?: string } | void;

export async function updateParametres(formData: FormData): Promise<ActionResult> {
  const parsed = parametresSchema.safeParse({
    nom: formData.get("nom"),
    slogan: formData.get("slogan"),
    email: formData.get("email"),
    telephone: formData.get("telephone"),
    adresse: formData.get("adresse"),
  });
  if (!parsed.success) return { error: "Champs invalides." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("parametres_site")
    .update({
      nom: parsed.data.nom,
      slogan: parsed.data.slogan || null,
      email: parsed.data.email || null,
      telephone: parsed.data.telephone || null,
      adresse: parsed.data.adresse || null,
    })
    .eq("id", 1);

  if (error) return { error: "La sauvegarde a échoué." };
  revalidatePath("/admin/parametres");
  revalidatePath("/");
}

export async function updateNumerosUrgence(
  numeros: { label: string; numero: string }[]
): Promise<ActionResult> {
  const parsed = numeroUrgenceSchema.array().safeParse(numeros);
  if (!parsed.success) return { error: "Numéros invalides." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("parametres_site")
    .update({ numeros_urgence: parsed.data })
    .eq("id", 1);

  if (error) return { error: "La sauvegarde a échoué." };
  revalidatePath("/admin/parametres");
  revalidatePath("/besoin-d-aide");
}
