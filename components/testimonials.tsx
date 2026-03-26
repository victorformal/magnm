import { Star } from "lucide-react"

const testimonials = [
  {
    name: "Sophie M.",
    location: "Paris, France",
    rating: 5,
    text: "Les panneaux en chene ont completement transforme notre salon. La qualite est exceptionnelle et l'installation a ete etonnamment simple.",
  },
  {
    name: "Marc L.",
    location: "Lyon, France",
    rating: 5,
    text: "Un artisanat magnifique. J'ai commande les panneaux acoustiques pour mon studio a domicile et la difference sonore est remarquable. En plus, ils sont superbes.",
  },
  {
    name: "Emma K.",
    location: "Bordeaux, France",
    rating: 5,
    text: "WOOD BOIS est devenu ma reference pour la decoration interieure. Chaque piece que j'ai achetee semble soigneusement concue et construite pour durer.",
  },
]

export function Testimonials() {
  return (
    <section className="bg-secondary/30 py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className="mb-4 inline-block text-xs font-medium uppercase tracking-[0.2em] text-accent">Temoignages</span>
          <h2 className="font-serif text-3xl font-normal sm:text-4xl lg:text-5xl">Ce que Disent nos Clients</h2>
          <p className="mx-auto mt-5 max-w-2xl text-muted-foreground">
            Rejoignez des milliers de clients satisfaits qui ont transforme leur maison avec WOOD BOIS.
          </p>
        </div>

        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="flex flex-col border border-border/30 bg-background p-8 transition-shadow duration-300 hover:shadow-lg">
              <div className="flex gap-1">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                ))}
              </div>
              <p className="mt-5 flex-1 font-serif text-lg italic leading-relaxed text-foreground/80">{`"${testimonial.text}"`}</p>
              <div className="mt-8 border-t border-border/30 pt-5">
                <p className="font-medium">{testimonial.name}</p>
                <p className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">{testimonial.location}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
