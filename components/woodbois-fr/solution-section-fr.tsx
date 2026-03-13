"use client"

import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { Volume2, Ruler, MoveVertical, Map, TreeDeciduous, Wrench, Check, X } from "lucide-react"

const SOLUTION_COPY = {
  eyebrow: "Notre difference",
  headline: "Un feutre acoustique 5mm qui change tout",
  body: "Derriere chaque lame de chene, un feutre acoustique haute densite de 5mm. C'est lui qui absorbe les sons ET qui permet la flexibilite totale — deux fonctions dans un seul produit. Aucun autre panneau sur le marche ne fait les deux.",
  specs: [
    { label: "Absorption acoustique", value: "Classe A", icon: Volume2 },
    { label: "Epaisseur totale", value: "15mm", icon: Ruler },
    { label: "Hauteur du panneau", value: "2,8m", icon: MoveVertical },
    { label: "Surface couverte", value: "1,68 m²", icon: Map },
    { label: "Matiere principale", value: "Chene veine", icon: TreeDeciduous },
    { label: "Installation", value: "Sans outil electrique", icon: Wrench },
  ],
  comparison: {
    them: [
      "Se fissure sur les courbes",
      "Necessite un professionnel",
      "Acoustique ou esthetique — pas les deux",
      "Decoupe difficile",
    ],
    us: [
      "S'adapte a toutes les surfaces",
      "Pose autonome en 30 min",
      "Acoustique ET design en un panneau",
      "Decoupe au cutter simple",
    ],
  },
}

export function SolutionSectionFr() {
  const { ref, inView } = useInView({ threshold: 0.2, triggerOnce: true })

  return (
    <section ref={ref} className="bg-[var(--color-cream)] py-16 lg:py-24">
      <div className="container mx-auto max-w-7xl px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-12 max-w-3xl mx-auto"
        >
          <span className="text-xs font-medium tracking-[0.15em] uppercase text-[var(--color-wood-mid)] mb-3 block">
            {SOLUTION_COPY.eyebrow}
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[var(--color-wood-dark)] mb-4">
            {SOLUTION_COPY.headline}
          </h2>
          <p className="text-[var(--color-muted-wood)] leading-relaxed">{SOLUTION_COPY.body}</p>
        </motion.div>

        {/* Specs Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-16"
        >
          {SOLUTION_COPY.specs.map((spec, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-4 text-center border border-[var(--color-border-wood)] shadow-sm"
            >
              <spec.icon className="h-6 w-6 mx-auto mb-2 text-[var(--color-wood-mid)]" />
              <p className="text-lg font-semibold text-[var(--color-wood-dark)]">{spec.value}</p>
              <p className="text-xs text-[var(--color-muted-wood)]">{spec.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Comparison Table */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="max-w-4xl mx-auto"
        >
          <div className="grid md:grid-cols-2 gap-6">
            {/* Them */}
            <div className="bg-[var(--color-cream-dark)] rounded-xl p-6 border border-[var(--color-border-wood)]">
              <h3 className="text-sm font-medium uppercase tracking-wider text-[var(--color-muted-wood)] mb-4">
                Panneaux classiques
              </h3>
              <ul className="space-y-3">
                {SOLUTION_COPY.comparison.them.map((item, index) => (
                  <li key={index} className="flex items-start gap-3 text-[var(--color-muted-wood)]">
                    <X className="h-5 w-5 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Us */}
            <div className="bg-white rounded-xl p-6 border-2 border-[var(--color-success)] shadow-lg">
              <h3 className="text-sm font-medium uppercase tracking-wider text-[var(--color-success)] mb-4">
                Woodbois Flexible
              </h3>
              <ul className="space-y-3">
                {SOLUTION_COPY.comparison.us.map((item, index) => (
                  <li key={index} className="flex items-start gap-3 text-[var(--color-wood-dark)]">
                    <Check className="h-5 w-5 flex-shrink-0 mt-0.5 text-[var(--color-success)]" />
                    <span className="text-sm font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
