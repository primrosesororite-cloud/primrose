"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { contactSchema, type ContactInput } from "@/lib/validations/contact";
import { submitContact, type ActionState } from "@/actions/contact";
import { TurnstileWidget } from "@/components/forms/turnstile-widget";
import { SubmitButton } from "@/components/motion/submit-button";

type FormValues = Omit<ContactInput, "turnstileToken">;

export function ContactForm() {
  const t = useTranslations("contact.formulaire");
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
    resolver: zodResolver(contactSchema.omit({ turnstileToken: true })),
    defaultValues: { nom: "", email: "", telephone: "", sujet: "", message: "", website: "" },
  });

  async function onSubmit(values: FormValues) {
    setPending(true);
    const fd = new FormData();
    Object.entries(values).forEach(([key, value]) => fd.set(key, value ?? ""));
    fd.set("turnstileToken", token);

    const res = await submitContact({ status: "idle" }, fd);
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

      <div>
        <label htmlFor="nom" className="field-label">
          {t("nom")}
        </label>
        <input
          id="nom"
          className="field-input mt-2"
          {...register("nom")}
        />
        {errors.nom && (
          <p className="field-error">{tValidation("requis")}</p>
        )}
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
        <label htmlFor="sujet" className="field-label">
          {t("sujet")}
        </label>
        <input
          id="sujet"
          className="field-input mt-2"
          {...register("sujet")}
        />
      </div>

      <div>
        <label htmlFor="message" className="field-label">
          {t("message")}
        </label>
        <textarea
          id="message"
          rows={5}
          className="field-input mt-2"
          {...register("message")}
        />
        {errors.message && (
          <p className="field-error">{tValidation("trop_court")}</p>
        )}
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
