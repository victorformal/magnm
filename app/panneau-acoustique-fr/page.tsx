import type { Metadata } from "next"
import { HeroSectionFr } from "@/components/woodbois-fr/hero-section-fr"
import { SocialProofBarFr } from "@/components/woodbois-fr/social-proof-bar-fr"
import { ProblemSectionFr } from "@/components/woodbois-fr/problem-section-fr"
import { SolutionSectionFr } from "@/components/woodbois-fr/solution-section-fr"
import { DemoSectionFr } from "@/components/woodbois-fr/demo-section-fr"
import { CalculatorSectionFr } from "@/components/woodbois-fr/calculator-section-fr"
import { TestimonialsSectionFr } from "@/components/woodbois-fr/testimonials-section-fr"
import { FaqSectionFr } from "@/components/woodbois-fr/faq-section-fr"
import { CtaSectionFr } from "@/components/woodbois-fr/cta-section-fr"
import { StickyCartFr } from "@/components/woodbois-fr/sticky-cart-fr"

export const metadata: Metadata = {
  title: "Panneau Acoustique Flexible Chene | Woodbois FR",
  description:
    "Le seul panneau acoustique en chene qui s'adapte a vos murs courbes. Installation en 30 min, sans artisan. Livraison 3-5 jours. Retours gratuits 30 jours.",
  openGraph: {
    title: "Panneau Acoustique Flexible - Pose en 30 min sur n'importe quel mur",
    description: "Chene massif + feutre acoustique 5mm. La flexibilite que les autres n'ont pas.",
    images: [{ url: "/og-woodbois-fr.jpg", width: 1200, height: 630 }],
  },
}

export default function PanneauAcoustiqueFrPage() {
  return (
    <div className="min-h-screen bg-[var(--color-cream)]">
      <HeroSectionFr />
      <SocialProofBarFr />
      <ProblemSectionFr />
      <SolutionSectionFr />
      <DemoSectionFr />
      <CalculatorSectionFr />
      <TestimonialsSectionFr />
      <FaqSectionFr />
      <CtaSectionFr />
      <StickyCartFr />
    </div>
  )
}
