"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { ProfilePicker } from "@/components/forms/profile-picker";
import { AdhesionForm } from "@/components/forms/adhesion-form";
import { fadeIn, reducedMotionVariant } from "@/lib/motion";

type ProfileType = "membre" | "benevole" | "partenaire" | "donateur";

export function RejoindreFlow() {
  const t = useTranslations("rejoindre");
  const shouldReduceMotion = useReducedMotion();
  const [profile, setProfile] = useState<ProfileType | null>(null);

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={profile ?? "picker"}
        initial="hidden"
        animate="visible"
        exit="hidden"
        variants={shouldReduceMotion ? reducedMotionVariant : fadeIn}
      >
        {profile === null ? (
          <>
            <p className="mb-4 text-center text-sm font-medium text-primrose-ink/70">
              {t("choisirProfil")}
            </p>
            <ProfilePicker onSelect={setProfile} />
          </>
        ) : (
          <AdhesionForm defaultType={profile} onChangeProfile={() => setProfile(null)} />
        )}
      </motion.div>
    </AnimatePresence>
  );
}
