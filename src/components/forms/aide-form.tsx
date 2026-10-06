"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { aideSchema, type AideInput } from "@/lib/validations/aide";
import { submitAide } from "@/actions/aide";
import type { ActionState } from "@/actions/contact";
import { TurnstileWidget } from "@/components/forms/turnstile-widget";
import { SubmitButton } from "@/components/motion/submit-button";

type FormValues = Omit<AideInput, "turnstileToken">;

const MOYENS = ["telephone", "whatsapp", "email"] as const;
const URGENCES = ["normal", "important", "urgent"] as const;

export function AideForm() {
  const t = useTranslations("aide.formulaire");
  const tValidation = useTranslations("validation");
  const tCommon = useTranslations("common");

  const [pending, setPending] = useState(false);
  const [result, setResult] = useState<ActionState | null>(null);
  const [token, setToken] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(aideSchema.omit({ turnstileToken: true })),
    defaultValues: {
      moyenContact: "whatsapp",
      coordonnee: "",
      message: "",
      urgence: "normal",
      nePasRecontacterAvant: "",
      website: "",
    },
  });

  async function onSubmit(values: FormValues) {
    setPending(true);
    const fd = new FormData();
    Object.entries(values).forEach(([key, value]) => fd.set(key, value ?? ""));
    fd.set("turnstileToken", token);

    const res = await submitAide({ status: "idle" }, fd);
    setResult(res);
    setPending(false);
    if (res.status === "success") reset();
  }

  if (result?.status === "success") {
    return (
      <p role="status" className="rounded-2xl bg-primrose-cream p-6 text-primrose-forest">
        {t("confirmation")}
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="hidden" aria-hidden="true">
        <label htmlFor="website">Site web</label>
        <input id="website" type="text" tabIndex={-1} autoComplete="off" {...register("website")} />
      </div>

      <fieldset>
        <legend className="field-label">{t("moyenContact")}</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {MOYENS.map((moyen) => (
            <label key={moyen} className="choice">
              <input type="radio" value={moyen} {...register("moyenContact")} />
              <span>{t(moyen)}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <label htmlFor="coordonnee" className="field-label">
          {t("coordonnee")}
        </label>
        <input
          id="coordonnee"
          className="field-input mt-2"
          aria-invalid={errors.coordonnee ? true : undefined}
          {...register("coordonnee")}
        />
        {errors.coordonnee && (
          <p className="field-error">{tValidation("requis")}</p>
        )}
      </div>

      <div>
        <label htmlFor="message" className="field-label">
          {t("message")}
        </label>
        <textarea
          id="message"
          rows={4}
          className="field-input mt-2"
          {...register("message")}
        />
      </div>

      <fieldset>
        <legend className="field-label">{t("urgence")}</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {URGENCES.map((urgence) => (
            <label key={urgence} className="choice">
              <input type="radio" value={urgence} {...register("urgence")} />
              <span>{t(`urgence${urgence.charAt(0).toUpperCase()}${urgence.slice(1)}` as "urgenceNormal")}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <label htmlFor="nePasRecontacterAvant" className="field-label">
          {t("nePasRecontacterAvant")}
        </label>
        <input
          id="nePasRecontacterAvant"
          type="date"
          min={new Date().toISOString().slice(0, 10)}
          className="field-input mt-2"
          {...register("nePasRecontacterAvant")}
        />
      </div>

      <TurnstileWidget onVerify={setToken} />

      {result?.status === "error" && (
        <p role="alert" className="text-sm text-primrose-alert">
          {tValidation(result.message as "erreurGenerique")}
        </p>
      )}

      <SubmitButton pending={pending} variant="alert">
        {pending ? tCommon("envoyerEnCours") : t("envoyer")}
      </SubmitButton>
    </form>
  );
}
