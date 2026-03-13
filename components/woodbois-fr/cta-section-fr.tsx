"use client"

import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { Check, ArrowRight } from "lucide-react"

const FINAL_CTA = {
  headline: "Pret a transformer votre espace ?",
  subheadline: "Commandez aujourd'hui. Si ce n'est pas parfait, retour gratuit — aucune question.",
  guarantees: [
    "Retours gratuits 30 jours — aucune condition",
    "Livraison suivie 3-5 jours ouvres",
    "Paiement 100% securise",
    "Support reel par email sous 4h",
  ],
  cta: "Choisir mes panneaux maintenant",
  urgency: "Stock disponible : 47 panneaux - Reapprovisionnement dans 3 semaines",
}

export function CtaSectionFr() {
  const { ref, inView } = useInView({ threshold: 0.3, triggerOnce: true })

  const scrollToCalculator = () => {
    const calculator = document.getElementById("calculator-section")
    if (calculator) {
      calculator.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  return (
    <section ref={ref} id="cta-section" className="bg-[var(--color-wood-dark)] py-16 lg:py-24">
      <div className="container mx-auto max-w-7xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto text-center"
        >
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">
            {FINAL_CTA.headline}
          </h2>
          <p className="text-lg text-[var(--color-wood-warm)] mb-8">{FINAL_CTA.subheadline}</p>

          {/* Guarantees */}
          <div className="grid sm:grid-cols-2 gap-3 mb-8 text-left max-w-md mx-auto">
            {FINAL_CTA.guarantees.map((guarantee, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
                className="flex items-center gap-2"
              >
                <Check className="h-4 w-4 text-[var(--color-success)] flex-shrink-0" />
                <span className="text-sm text-white/90">{guarantee}</span>
              </motion.div>
            ))}
          </div>

          {/* CTA Button */}
          <motion.button
            type="button"
            onClick={scrollToCalculator}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.4, delay: 0.6 }}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-[var(--color-cta)] hover:bg-[var(--color-cta-hover)] text-white font-medium text-lg transition-colors shadow-xl"
          >
            {FINAL_CTA.cta}
            <ArrowRight className="h-5 w-5" />
          </motion.button>

          {/* Urgency */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.4, delay: 0.8 }}
            className="mt-6 text-sm text-[var(--color-wood-warm)]"
          >
            {FINAL_CTA.urgency}
          </motion.p>
        </motion.div>
      </div>
    </section>
  )
}
