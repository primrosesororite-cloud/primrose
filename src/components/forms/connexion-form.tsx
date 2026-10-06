"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/client";
import { SubmitButton } from "@/components/motion/submit-button";

const schema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(8),
});

type FormValues = z.infer<typeof schema>;

export function ConnexionForm() {
  const t = useTranslations("validation");
  const tAuth = useTranslations("auth");
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  async function onSubmit(values: FormValues) {
    setPending(true);
    setError(null);
    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword(values);
    setPending(false);

    if (signInError) {
      setError(t("erreurGenerique"));
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label htmlFor="email" className="field-label">
          {tAuth("email")}
        </label>
        <input
          id="email"
          type="email"
          className="field-input mt-2"
          {...register("email")}
        />
        {errors.email && (
          <p className="field-error">{t("emailInvalide")}</p>
        )}
      </div>

      <div>
        <label htmlFor="password" className="field-label">
          {tAuth("motDePasse")}
        </label>
        <input
          id="password"
          type="password"
          className="field-input mt-2"
          {...register("password")}
        />
        {errors.password && (
          <p className="field-error">{t("requis")}</p>
        )}
      </div>

      {error && (
        <p role="alert" className="text-sm text-primrose-alert">
          {error}
        </p>
      )}

      <SubmitButton pending={pending}>
        {pending ? tAuth("connexionEnCours") : tAuth("seConnecter")}
      </SubmitButton>
    </form>
  );
}
