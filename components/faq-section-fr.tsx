"use client"

import { useState } from "react"
import { Plus } from "lucide-react"

const FAQS = [
  {
    q: "Est-ce que ca tient vraiment sur un mur courbe ou une colonne?",
    a: "Oui — c'est sa conception principale. Le feutre acoustique de 5mm au dos permet une flexibilite jusqu'a un rayon de 20cm. Des clients l'ont installe sur des colonnes de 18cm de diametre et des arches. Photos disponibles dans les avis ci-dessous.",
  },
  {
    q: "De quoi ai-je besoin pour installer? Faut-il un artisan?",
    a: "Un cutter et une regle. C'est tout. L'adhesif est pre-applique et repositionnable pendant 48h. 94% de nos clients posent seuls, sans experience prealable de renovation. Temps moyen : 25 minutes par panneau.",
  },
  {
    q: "Que se passe-t-il si je commande trop de panneaux?",
    a: "Les retours sont gratuits sous 30 jours pour les panneaux non decoupes. Notre calculateur inclut 10% de marge pour les chutes — vous pouvez aussi en commander l'exact minimum et revenir pour completer si besoin.",
  },
  {
    q: "Est-ce du vrai bois ou un revetement plastique?",
    a: "Vrai bois. Les lames sont en MDF massif avec finition bois veritable — vous pouvez le poncer et le teindre comme n'importe quel bois. Aucun film PVC, aucun papier bois.",
  },
  {
    q: "Le panneau tient-il dans les pieces humides (salle de bain, cuisine)?",
    a: "Oui pour une utilisation normale — plusieurs clients l'ont installe en salle de bain et au-dessus de plans de travail. Il ne faut pas l'exposer a de l'eau courante ou a la vapeur directe.",
  },
  {
    q: "Quand vais-je recevoir ma commande?",
    a: "Expedition sous 24-48h, livraison en 5 a 8 jours ouvrables en France metropolitaine. Vous recevez un email de suivi des l'expedition. La livraison est gratuite sur toutes les commandes.",
  },
]

export function FAQSectionFr() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="my-12 sm:my-16">
      <h2 className="text-xl sm:text-2xl font-bold text-[#2C1810] mb-6">Questions frequentes</h2>

      <div className="divide-y divide-[#E8DDD4]">
        {FAQS.map((faq, index) => (
          <div key={index} className="overflow-hidden">
            <button
              type="button"
              onClick={() => toggleFaq(index)}
              className="w-full flex items-center justify-between gap-4 py-4 text-left"
            >
              <span className="font-medium text-[#2C1810] text-sm sm:text-base">{faq.q}</span>
              <span
                className={`w-6 h-6 rounded-full border border-[#E8DDD4] flex items-center justify-center flex-shrink-0 text-[#C8522A] transition-transform duration-200 ${
                  openIndex === index ? "rotate-45 border-[#C8522A]" : ""
                }`}
              >
                <Plus className="w-4 h-4" />
              </span>
            </button>
            <div
              className="grid transition-all duration-300 ease-out"
              style={{
                gridTemplateRows: openIndex === index ? "1fr" : "0fr",
              }}
            >
              <div className="overflow-hidden">
                <p className="text-sm text-[#6B5B4E] leading-relaxed pb-4">{faq.a}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
