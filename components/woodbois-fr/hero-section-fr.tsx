"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { Star, Truck, RotateCcw } from "lucide-react"

const HERO_COPY = {
  eyebrow: "Panneau acoustique flexible",
  headline: "Transformez n'importe quel mur en silence et en elegance",
  subheadline:
    "Le seul panneau en chene qui epouse vos courbes — sans artisan, sans outils electriques. Installation en 30 minutes.",
  cta_primary: "Choisir mes panneaux",
  cta_secondary: "Voir l'installation en video",
  trust_signals: [
    { icon: Star, text: "4.9/5 — 847 avis verifies" },
    { icon: Truck, text: "Livraison 3–5 jours ouvres" },
    { icon: RotateCcw, text: "Retours gratuits 30 jours" },
  ],
}

const heroVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
}

export function HeroSectionFr() {
  const scrollToCalculator = () => {
    const calculator = document.getElementById("calculator-section")
    if (calculator) {
      calculator.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  return (
    <section id="hero-section" className="relative min-h-[90vh] bg-[var(--color-cream)]">
      <div className="container mx-auto max-w-7xl px-4 py-12 lg:py-20">
        <div className="grid lg:grid-cols-[55fr_45fr] gap-8 lg:gap-12 items-center">
          {/* Image — Left */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative aspect-[4/3] lg:aspect-square rounded-2xl overflow-hidden order-1 lg:order-1"
          >
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/FAP004-ZDLxcKZNaH78vc8NDClQsY6xZCHYuM.jpg"
              alt="Panneau acoustique flexible en chene sur mur courbe"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 55vw"
              className="object-cover"
            />
          </motion.div>

          {/* Copy — Right */}
          <div className="flex flex-col justify-center order-2 lg:order-2">
            <motion.span
              custom={0}
              initial="hidden"
              animate="visible"
              variants={heroVariants}
              className="text-xs font-medium tracking-[0.15em] uppercase text-[var(--color-wood-mid)] mb-3"
            >
              {HERO_COPY.eyebrow}
            </motion.span>

            <motion.h1
              custom={1}
              initial="hidden"
              animate="visible"
              variants={heroVariants}
              className="font-serif text-3xl sm:text-4xl lg:text-5xl xl:text-[3.5rem] font-bold leading-[1.1] text-[var(--color-wood-dark)] mb-4"
            >
              {HERO_COPY.headline}
            </motion.h1>

            <motion.p
              custom={2}
              initial="hidden"
              animate="visible"
              variants={heroVariants}
              className="text-base lg:text-lg text-[var(--color-muted-wood)] leading-relaxed mb-8 max-w-lg"
            >
              {HERO_COPY.subheadline}
            </motion.p>

            <motion.div
              custom={3}
              initial="hidden"
              animate="visible"
              variants={heroVariants}
              className="flex flex-col sm:flex-row gap-3 mb-8"
            >
              <button
                type="button"
                onClick={scrollToCalculator}
                className="px-8 py-4 rounded-lg bg-[var(--color-cta)] hover:bg-[var(--color-cta-hover)] text-white font-medium text-base transition-colors shadow-lg"
              >
                {HERO_COPY.cta_primary}
              </button>
              <button
                type="button"
                className="px-8 py-4 rounded-lg border-2 border-[var(--color-wood-dark)] text-[var(--color-wood-dark)] font-medium text-base hover:bg-[var(--color-wood-dark)] hover:text-white transition-colors"
              >
                {HERO_COPY.cta_secondary}
              </button>
            </motion.div>

            {/* Trust Signals */}
            <motion.div
              custom={4}
              initial="hidden"
              animate="visible"
              variants={heroVariants}
              className="flex flex-wrap gap-4 lg:gap-6"
            >
              {HERO_COPY.trust_signals.map((signal, index) => (
                <div key={index} className="flex items-center gap-2 text-sm text-[var(--color-muted-wood)]">
                  <signal.icon className="h-4 w-4 text-[var(--color-success)]" />
                  <span>{signal.text}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
