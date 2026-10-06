import { useTranslations } from "next-intl";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { AnimateIn } from "@/components/motion/animate-in";
import { SectionHeading } from "@/components/sections/section-heading";

type FaqItem = { question: string; reponse: string };

export function FaqSection() {
  const t = useTranslations("rejoindre.faq");
  const items = t.raw("items") as FaqItem[];

  return (
    <section className="mx-auto max-w-3xl px-4 py-16 md:px-6 md:py-24">
      <AnimateIn>
        <SectionHeading title={t("titre")} align="center" />

        <Accordion type="single" collapsible className="mt-10 rounded-card border border-primrose-ink/10 bg-primrose-white px-6">
          {items.map((item, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger>{item.question}</AccordionTrigger>
              <AccordionContent>{item.reponse}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </AnimateIn>
    </section>
  );
}
