"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { Plus, Minus } from "lucide-react"

const FAQS = [
  {
    q: "Est-ce que ca tient vraiment sur une surface courbe ?",
    a: "Oui — c'est precisement ce pour quoi il a ete concu. Le feutre acoustique de 5mm au dos du panneau lui permet de se plier jusqu'a un rayon de courbure de 30cm sans se fissurer ni perdre ses proprietes acoustiques. Nous avons des installations sur des colonnes de 20cm de diametre.",
  },
  {
    q: "De quoi ai-je besoin pour l'installation ?",
    a: "Un cutter, de la colle de contact (fournie dans le kit), et une regle. Pas de scie, pas de visseuse, pas de cheville. 90% de nos clients installent seuls, sans experience prealable.",
  },
  {
    q: "Que se passe-t-il si je commande trop ?",
    a: "Les retours sont gratuits sous 30 jours pour les panneaux non decoupes. Vous pouvez aussi garder les surplus — le bois se conserve parfaitement pour de futurs projets.",
  },
  {
    q: "Est-ce que c'est du vrai bois ?",
    a: "Oui. Chaque panneau est compose de lames de chene veine massif, non plaque. Vous pouvez le poncer, le teindre, le traiter exactement comme n'importe quel bois massif.",
  },
  {
    q: "Combien de temps pour recevoir ma commande ?",
    a: "3 a 5 jours ouvres pour toute la France metropolitaine. Les commandes passees avant 14h sont expediees le jour meme. Vous recevez un numero de suivi par email des l'expedition.",
  },
  {
    q: "Est-ce que le prix inclut la livraison ?",
    a: "La livraison est offerte a partir de 199EUR d'achat — ce qui represente environ 6 panneaux. La grande majorite des commandes sont eligibles.",
  },
]

function FaqItem({ faq, isOpen, onToggle }: { faq: typeof FAQS[0]; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className="border-b border-[var(--color-border-wood)] last:border-b-0">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 py-5 text-left"
      >
        <span className="font-medium text-[var(--color-wood-dark)]">{faq.q}</span>
        <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-[var(--color-cream-dark)]">
          {isOpen ? (
            <Minus className="h-4 w-4 text-[var(--color-wood-mid)]" />
          ) : (
            <Plus className="h-4 w-4 text-[var(--color-wood-mid)]" />
          )}
        </span>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-[var(--color-muted-wood)] leading-relaxed">{faq.a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function FaqSectionFr() {
  const { ref, inView } = useInView({ threshold: 0.2, triggerOnce: true })
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section ref={ref} className="bg-[var(--color-cream)] py-16 lg:py-24">
      <div className="container mx-auto max-w-7xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <span className="text-xs font-medium tracking-[0.15em] uppercase text-[var(--color-wood-mid)] mb-3 block">
            Questions frequentes
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[var(--color-wood-dark)]">
            Tout ce que vous devez savoir
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-3xl mx-auto bg-white rounded-2xl p-6 lg:p-8 shadow-lg border border-[var(--color-border-wood)]"
        >
          {FAQS.map((faq, index) => (
            <FaqItem
              key={index}
              faq={faq}
              isOpen={openIndex === index}
              onToggle={() => setOpenIndex(openIndex === index ? null : index)}
            />
          ))}
        </motion.div>
      </div>
    </section>
  )
}
