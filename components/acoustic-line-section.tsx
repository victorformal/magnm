import Image from "next/image"

const CONTENT = {
  en: {
    supra: "Sophistication in Every Detail",
    title: "Acoustic Line",
    subtitle: "Discover the features of our slatted acoustic panels",
    blocks: [
      {
        title: "Acoustic Efficiency",
        text: "Experience unmatched sound quality with our decorative slatted panels, carefully engineered to enhance the acoustics of any room.",
        image: "/images/acustika-efficiency.jpg",
      },
      {
        title: "Easy to Clean",
        text: "Keeping your spaces looking beautiful has never been easier. Our slatted panels are designed to simplify your routine: simply wipe with a dry or slightly damp cloth to remove dust or light marks, without compromising the flawless finish. Functionality and practicality for your everyday life.",
        image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Caracteristicas-Facil-de-instalar-tTBaUKwKi4AyDqZpyQSaRsdncnw4Uf.webp",
      },
      {
        title: "European Design for Interiors",
        text: "Bring the timeless elegance of Scandinavian design into your home, the perfect combination of functionality and aesthetics, with our sophisticated slatted wood panels.",
        image: "/images/acustika-european-design.jpg",
      },
    ],
  },
  fr: {
    supra: "Sophistication dans chaque detail",
    title: "Ligne Acoustique",
    subtitle: "Decouvrez les caracteristiques de nos panneaux acoustiques a lattes",
    blocks: [
      {
        title: "Efficacite Acoustique",
        text: "Profitez d'une qualite sonore incomparable avec nos panneaux decoratifs a lattes, soigneusement concus pour ameliorer l'acoustique de n'importe quel espace.",
        image: "/images/acustika-efficiency.jpg",
      },
      {
        title: "Facile a Nettoyer",
        text: "Maintenir la beaute de vos espaces n'a jamais ete aussi simple. Nos panneaux a lattes sont concus pour faciliter votre quotidien : il suffit de passer un chiffon sec ou legerement humide pour enlever la poussiere ou les taches legeres, sans compromettre la finition impeccable. Fonctionnalite et praticite au quotidien.",
        image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Caracteristicas-Facil-de-instalar-tTBaUKwKi4AyDqZpyQSaRsdncnw4Uf.webp",
      },
      {
        title: "Design Europeen pour Interieurs",
        text: "Apportez chez vous l'elegance intemporelle du design scandinave, la combinaison parfaite de fonctionnalite et d'esthetique, avec nos panneaux sophistiques en bois a lattes.",
        image: "/images/acustika-european-design.jpg",
      },
    ],
  },
}

interface AcousticLineSectionProps {
  isFrenchVersion?: boolean
}

export function AcousticLineSection({ isFrenchVersion = false }: AcousticLineSectionProps) {
  const lang = isFrenchVersion ? "fr" : "en"
  const t = CONTENT[lang]

  return (
    <section className="mt-16 sm:mt-24">
      {/* Header */}
      <div className="text-center mb-10">
        <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
          {t.supra}
        </p>
        <h2 className="font-serif text-2xl sm:text-3xl text-foreground mb-3">
          {t.title}
        </h2>
        <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
          {t.subtitle}
        </p>
      </div>

      {/* Content blocks */}
      <div className="space-y-12 sm:space-y-16">
        {t.blocks.map((block, i) => (
          <div key={i} className="flex flex-col items-center text-center gap-6">
            {/* Image */}
            <div className="w-full max-w-lg overflow-hidden rounded-xl">
              <Image
                src={block.image}
                alt={block.title}
                width={600}
                height={400}
                className="w-full h-auto object-cover"
                unoptimized
              />
            </div>

            {/* Text */}
            <div className="max-w-md">
              <h3 className="font-serif text-xl sm:text-2xl text-foreground mb-3">
                {block.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {block.text}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
