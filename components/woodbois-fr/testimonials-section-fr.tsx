"use client"

import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import Image from "next/image"
import { Star, BadgeCheck } from "lucide-react"

const TESTIMONIALS = [
  {
    name: "Sophie M.",
    city: "Lyon",
    rating: 5,
    quote:
      "Je n'aurais jamais cru pouvoir habiller ma colonne centrale. En 25 minutes, c'etait fini. Le rendu est incroyable.",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/FAP004-ZDLxcKZNaH78vc8NDClQsY6xZCHYuM.jpg",
    verified: true,
  },
  {
    name: "Marc D.",
    city: "Paris",
    rating: 5,
    quote:
      "La qualite du chene est remarquable. Mes invites pensent tous que j'ai fait appel a un architecte d'interieur.",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/FAP002-fTn7oH4WnVjqFuYJGlXCVQqcgJZV7P.jpg",
    verified: true,
  },
  {
    name: "Claire B.",
    city: "Bordeaux",
    rating: 5,
    quote:
      "On entendait tout de la rue. Maintenant c'est le calme total. Et en plus, c'est magnifique. Double victoire.",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/FAP003-SrhifdKT3wMYFjYLvTIeAJZvgSXEG9.jpg",
    verified: true,
  },
  {
    name: "Thomas L.",
    city: "Marseille",
    rating: 5,
    quote:
      "J'avais peur de la pose sur mon mur arrondi. Au final, c'etait plus simple que monter un meuble IKEA.",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/FAP001-FpU8xR7xnX3VTT0SXU4Zzz8gCYq9Xm.jpg",
    verified: true,
  },
]

export function TestimonialsSectionFr() {
  const { ref, inView } = useInView({ threshold: 0.2, triggerOnce: true })

  return (
    <section ref={ref} className="bg-[var(--color-cream-dark)] py-16 lg:py-24">
      <div className="container mx-auto max-w-7xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <span className="text-xs font-medium tracking-[0.15em] uppercase text-[var(--color-wood-mid)] mb-3 block">
            Temoignages
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[var(--color-wood-dark)]">
            Ils ont transforme leur interieur
          </h2>
          <p className="mt-4 text-[var(--color-muted-wood)] max-w-xl mx-auto">
            Plus de 847 clients satisfaits en France. Voici leurs resultats.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {TESTIMONIALS.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-2xl overflow-hidden shadow-lg border border-[var(--color-border-wood)]"
            >
              {/* Room photo */}
              <div className="relative h-48 lg:h-56">
                <Image src={testimonial.image} alt={`Installation chez ${testimonial.name}`} fill className="object-cover" />
              </div>

              {/* Content */}
              <div className="p-5 lg:p-6">
                {/* Rating */}
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-[var(--color-wood-dark)] leading-relaxed mb-4">"{testimonial.quote}"</p>

                {/* Author */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-[var(--color-wood-dark)]">{testimonial.name}</p>
                    <p className="text-sm text-[var(--color-muted-wood)]">{testimonial.city}</p>
                  </div>
                  {testimonial.verified && (
                    <span className="flex items-center gap-1 text-xs text-[var(--color-success)]">
                      <BadgeCheck className="h-4 w-4" />
                      Achat verifie
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
