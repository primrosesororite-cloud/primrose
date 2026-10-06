"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  formationInscriptionSchema,
  type FormationInscriptionInput,
} from "@/lib/validations/formation-inscription";
import { submitFormationInscription } from "@/actions/formation-inscription";
import type { ActionState } from "@/actions/contact";
import { TurnstileWidget } from "@/components/forms/turnstile-widget";
import { fadeInUp, reducedMotionVariant } from "@/lib/motion";
import { SubmitButton } from "@/components/motion/submit-button";

type FormValues = Omit<FormationInscriptionInput, "turnstileToken">;

export function FormationInscriptionForm({ formationId }: { formationId: string }) {
  const t = useTranslations("formations.inscription");
  const tValidation = useTranslations("validation");
  const tCommon = useTranslations("common");
  const shouldReduceMotion = useReducedMotion();

  const [pending, setPending] = useState(false);
  const [result, setResult] = useState<ActionState | null>(null);
  const [token, setToken] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formationInscriptionSchema.omit({ turnstileToken: true })),
    defaultValues: { formationId, nom: "", email: "", telephone: "", message: "", website: "" },
  });

  async function onSubmit(values: FormValues) {
    setPending(true);
    const fd = new FormData();
    Object.entries(values).forEach(([key, value]) => fd.set(key, value ?? ""));
    fd.set("turnstileToken", token);

    const res = await submitFormationInscription({ status: "idle" }, fd);
    setResult(res);
    setPending(false);
    if (res.status === "success") reset();
  }

  return (
    <AnimatePresence mode="wait">
      {result?.status === "success" ? (
        <motion.p
          key="success"
          role="status"
          initial="hidden"
          animate="visible"
          variants={shouldReduceMotion ? reducedMotionVariant : fadeInUp}
          className="rounded-card bg-primrose-cream p-6 text-primrose-forest"
        >
          {t("confirmation")}
        </motion.p>
      ) : (
        <motion.form
          key="form"
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={shouldReduceMotion ? reducedMotionVariant : fadeInUp}
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6"
        >
          <input type="hidden" {...register("formationId")} />
          <div className="hidden" aria-hidden="true">
            <label htmlFor="website">Site web</label>
            <input id="website" type="text" tabIndex={-1} autoComplete="off" {...register("website")} />
          </div>

          <div>
            <label htmlFor="fi-nom" className="field-label">
              {t("nom")}
            </label>
            <input
              id="fi-nom"
              className="field-input mt-2"
              {...register("nom")}
            />
            {errors.nom && (
              <p className="field-error">{tValidation("requis")}</p>
            )}
          </div>

          <div>
            <label htmlFor="fi-email" className="field-label">
              {t("email")}
            </label>
            <input
              id="fi-email"
              type="email"
              className="field-input mt-2"
              {...register("email")}
            />
            {errors.email && (
              <p className="field-error">{tValidation("emailInvalide")}</p>
            )}
          </div>

          <div>
            <label htmlFor="fi-telephone" className="field-label">
              {t("telephone")}
            </label>
            <input
              id="fi-telephone"
              className="field-input mt-2"
              {...register("telephone")}
            />
          </div>

          <div>
            <label htmlFor="fi-message" className="field-label">
              {t("message")}
            </label>
            <textarea
              id="fi-message"
              rows={3}
              className="field-input mt-2"
              {...register("message")}
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
        </motion.form>
      )}
    </AnimatePresence>
  );
}
