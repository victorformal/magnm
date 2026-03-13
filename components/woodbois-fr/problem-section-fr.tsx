"use client"

import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"

const PROBLEM_COPY = {
  eyebrow: "Le probleme habituel",
  headline: "Les panneaux rigides ne suivent pas vos murs",
  problems: [
    {
      title: "Les courbes deviennent un calvaire",
      body: "Colonnes, arches, murs cintres — les panneaux classiques se fissurent ou refusent de tenir. Resultat : vous abandonnez le projet ou payez un artisan.",
    },
    {
      title: "La pose prend une journee entiere",
      body: "Entre la decoupe, les colles speciales et les finitions, ce qui devait etre simple devient un chantier de weekend.",
    },
    {
      title: "Vous commandez trop ou pas assez",
      body: "Calculer les m² necessaires sans guide, c'est le meilleur moyen de manquer de stock ou de jeter de l'argent.",
    },
  ],
}

export function ProblemSectionFr() {
  const { ref, inView } = useInView({ threshold: 0.2, triggerOnce: true })

  return (
    <section ref={ref} className="bg-[var(--color-wood-dark)] py-16 lg:py-24">
      <div className="container mx-auto max-w-7xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <span className="text-xs font-medium tracking-[0.15em] uppercase text-[var(--color-wood-warm)] mb-3 block">
            {PROBLEM_COPY.eyebrow}
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-white">{PROBLEM_COPY.headline}</h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {PROBLEM_COPY.problems.map((problem, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="bg-[var(--color-charcoal)]/50 rounded-xl p-6 border-l-4 border-[var(--color-wood-warm)]"
            >
              <h3 className="text-lg font-semibold text-white mb-3">{problem.title}</h3>
              <p className="text-[var(--color-wood-warm)]/80 leading-relaxed text-sm">{problem.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
