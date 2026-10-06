"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { adhesionSchema, type AdhesionInput } from "@/lib/validations/adhesion";
import { submitAdhesion } from "@/actions/adhesion";
import type { ActionState } from "@/actions/contact";
import { TurnstileWidget } from "@/components/forms/turnstile-widget";
import { SubmitButton } from "@/components/motion/submit-button";

type FormValues = Omit<AdhesionInput, "turnstileToken">;
type ProfileType = FormValues["type"];

const TYPES = ["membre", "benevole", "partenaire", "donateur"] as const;

export function AdhesionForm({
  defaultType,
  onChangeProfile,
}: {
  defaultType?: ProfileType;
  onChangeProfile?: () => void;
}) {
  const t = useTranslations("rejoindre.formulaire");
  const tRejoindre = useTranslations("rejoindre");
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
    resolver: zodResolver(adhesionSchema.omit({ turnstileToken: true })),
    defaultValues: {
      type: defaultType ?? "membre",
      nom: "",
      email: "",
      telephone: "",
      ville: "",
      motivation: "",
      website: "",
    },
  });

  async function onSubmit(values: FormValues) {
    setPending(true);
    const fd = new FormData();
    Object.entries(values).forEach(([key, value]) => fd.set(key, value ?? ""));
    fd.set("turnstileToken", token);

    const res = await submitAdhesion({ status: "idle" }, fd);
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

      {defaultType ? (
        <div className="flex items-center justify-between rounded-lg bg-primrose-cream px-3 py-2">
          <div>
            <p className="text-xs text-primrose-ink/75">{t("type")}</p>
            <p className="text-sm font-medium text-primrose-forest">
              {t(`type${defaultType.charAt(0).toUpperCase()}${defaultType.slice(1)}` as "typeMembre")}
            </p>
          </div>
          <input type="hidden" value={defaultType} {...register("type")} />
          {onChangeProfile && (
            <button
              type="button"
              onClick={onChangeProfile}
              className="text-xs font-medium text-primrose-forest underline underline-offset-2"
            >
              {tRejoindre("changerProfil")}
            </button>
          )}
        </div>
      ) : (
        <div>
          <label htmlFor="type" className="field-label">
            {t("type")}
          </label>
          <select
            id="type"
            className="field-input mt-2"
            {...register("type")}
          >
            {TYPES.map((type) => (
              <option key={type} value={type}>
                {t(`type${type.charAt(0).toUpperCase()}${type.slice(1)}` as "typeMembre")}
              </option>
            ))}
          </select>
        </div>
      )}

      <div>
        <label htmlFor="nom" className="field-label">
          {t("nom")}
        </label>
        <input
          id="nom"
          className="field-input mt-2"
          {...register("nom")}
        />
        {errors.nom && <p className="field-error">{tValidation("requis")}</p>}
      </div>

      <div>
        <label htmlFor="email" className="field-label">
          {t("email")}
        </label>
        <input
          id="email"
          type="email"
          className="field-input mt-2"
          {...register("email")}
        />
        {errors.email && (
          <p className="field-error">{tValidation("emailInvalide")}</p>
        )}
      </div>

      <div>
        <label htmlFor="telephone" className="field-label">
          {t("telephone")}
        </label>
        <input
          id="telephone"
          className="field-input mt-2"
          {...register("telephone")}
        />
      </div>

      <div>
        <label htmlFor="ville" className="field-label">
          {t("ville")}
        </label>
        <input
          id="ville"
          className="field-input mt-2"
          {...register("ville")}
        />
      </div>

      <div>
        <label htmlFor="motivation" className="field-label">
          {t("motivation")}
        </label>
        <textarea
          id="motivation"
          rows={4}
          className="field-input mt-2"
          {...register("motivation")}
        />
      </div>

      <TurnstileWidget onVerify={setToken} />

      {result?.status === "error" && (
        <p role="alert" className="text-sm text-primrose-alert">
          {tValidation(result.message as "erreurGenerique")}
        </p>
      )}

      <SubmitButton pending={pending}>
        {pending ? tCommon("envoyerEnCours") : t("envoyer")}
      </SubmitButton>
    </form>
  );
}
