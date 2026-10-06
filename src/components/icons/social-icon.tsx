import { siInstagram, siX, siFacebook, siYoutube, siTiktok, siWhatsapp } from "simple-icons";
import { Link as LinkIcon } from "lucide-react";
import type { Plateforme } from "@/types/database";

const ICONS: Partial<Record<Plateforme, { path: string; hex: string; title: string }>> = {
  instagram: siInstagram,
  x: siX,
  facebook: siFacebook,
  youtube: siYoutube,
  tiktok: siTiktok,
  whatsapp: siWhatsapp,
};

export function SocialIcon({
  plateforme,
  className,
}: {
  plateforme: Plateforme;
  className?: string;
}) {
  const icon = ICONS[plateforme];

  if (!icon) {
    return <LinkIcon aria-hidden className={className} />;
  }

  return (
    <span
      className={className}
      style={{ backgroundColor: `#${icon.hex}` }}
      aria-hidden
    >
      <svg viewBox="0 0 24 24" fill="#FFFFFF" className="h-full w-full p-2">
        <path d={icon.path} />
      </svg>
    </span>
  );
}
