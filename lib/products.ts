export interface ProductColor {
  id: string
  name: string
  hex: string
  image?: string
}

export interface ProductStyle {
  id: string
  name: string
  image: string
}

export interface Product {
  id: string
  slug: string
  name: string
  description: string
  longDescription: string
  price: number
  originalPrice?: number
  currency: string
  category: string
  images: string[]
  features: string[]
  dimensions?: string
  material?: string
  inStock: boolean
  badge?: string
  onSale?: boolean
  colors?: ProductColor[]
  video?: string // URL to a product demo video (MP4)
  styles?: ProductStyle[] // Added styles for product variants
  noShipping?: boolean // Skip shipping for this product
  hidden?: boolean // Hide from product listings (only accessible via direct link)
}

export const categories = [
  { id: "wall-panels", name: "Panneaux Muraux", slug: "wall-panels" },
  { id: "lighting", name: "Eclairage", slug: "lighting" },
  { id: "decor", name: "Decoration", slug: "decor" },
]

export const products: Product[] = [
  {
    id: "prod_U4kuSjp9pwoOzo",
    slug: "flexible-acoustic-panel",
    name: "Flexible Acoustic Panel",
    description:
      "Revolutionary bendable acoustic panel that adapts to any surface. Perfect for curved walls, pillars, and creative installations.",
    longDescription:
      "Introducing our game-changing Flexible Acoustic Panel—the most versatile wall covering solution on the market. Unlike traditional rigid panels, this innovative design features a specially engineered flexible felt backing that allows the panel to bend and conform to curved surfaces, pillars, and unconventional architectural features. Available in multiple wood tones including Natural Oak, Smoked Oak, Walnut, and Grey Oak, each panel delivers exceptional sound absorption while transforming any space into a design statement. At an incredible 270x110cm, each panel covers nearly 3m² of wall space, making it the most cost-effective premium acoustic solution available.",
    price: 15.44,
    originalPrice: 17.90,
    currency: "GBP",
    category: "wall-panels",
    images: [
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/panneu01-COvuniuy0UAMH2wAwPKmS9Tlev4Qrt.avif",
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/panneau02-qeu9jY1J99l7kquJK3L2fnpKCxJuHj.avif",
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/panneau03-Ji8b2j4tKYBnBXpeqNu9khj7yL7wvV.avif",
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/panneau05-GkWwFoSwI1tdI52JGtLrfokd39EcZ6.avif",
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/panneau06-RN0no924w98dCR2WLKu9Lc5ix1yxsd.avif",
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/panneau08-MDTCtLoI5jgKXB9aMNIgb6jn6rpRlj.avif",
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/panneau10-st1uB7l391OAmADvAE7RopRDYVevb6.avif",
    ],
    video: "/videos/akupanel-demo.mp4",
    inStock: true,
    badge: "Bestseller",
    onSale: true,
    colors: [
      { id: "natural", name: "Natural", hex: "#D4B896", image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Gemini_Generated_Image_gv77m0gv77m0gv77-2ZuSE03hVAhko9zJULiZyynQuzvSro.png" },
      { id: "walnut", name: "Walnut", hex: "#5D4037", image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Gemini_Generated_Image_v6k2hsv6k2hsv6k2-WlF4p8OnMPN9VN2jMsVPIoGPJUxmAU.png" },
      { id: "black", name: "Black", hex: "#2D2D2D", image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Gemini_Generated_Image_y18qr9y18qr9y18q-nzi1de1MXOo3sji65NDIhMdbxWOdIk.png" },
      { id: "grey", name: "Grey", hex: "#9E9E9E", image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Gemini_Generated_Image_hoylswhoylswhoyl-IspXGlydLXx9MoShiAKqZWmOiQQpwj.png" },
    ],
    features: [
      "Flexible backing - adapts to any curve",
      "270x110cm coverage per piece",
      "Superior NRC rating of 0.85",
      "Multiple wood tones available",
      "Easy DIY installation",
      "Eco-friendly materials",
    ],
    dimensions: "270cm W x 110cm H x 0.5cm D",
    material: "Premium Wood Veneer with Acoustic Felt Backing",
  },
  // French version of Flexible Acoustic Panel (FR market)
  {
    id: "prod_U2rumuoWXebtgj",
    slug: "flexible-acoustic-panel-fr",
    name: "Panneau Acoustique Flexible",
    description:
      "Panneau acoustique pliable revolutionnaire qui s'adapte a toute surface. Parfait pour les murs courbes, les piliers et les installations creatives.",
    longDescription:
      "Decouvrez notre Panneau Acoustique Flexible revolutionnaire - la solution de revetement mural la plus polyvalente du marche. Contrairement aux panneaux rigides traditionnels, ce design innovant dispose d'un support en feutre flexible specialement concu qui permet au panneau de se plier et de s'adapter aux surfaces courbes, aux piliers et aux caracteristiques architecturales non conventionnelles. Disponible en plusieurs tons de bois dont Chene Naturel, Chene Fume, Noyer et Chene Gris, chaque panneau offre une absorption sonore exceptionnelle tout en transformant n'importe quel espace en une declaration de design. Avec des dimensions incroyables de 270x110cm, chaque panneau couvre pres de 3m2 de surface murale, ce qui en fait la solution acoustique premium la plus rentable disponible.",
    price: 14,
    originalPrice: 29.80,
    currency: "EUR",
    category: "wall-panels",
    images: [
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/panneu01-COvuniuy0UAMH2wAwPKmS9Tlev4Qrt.avif",
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/panneau02-qeu9jY1J99l7kquJK3L2fnpKCxJuHj.avif",
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/panneau03-Ji8b2j4tKYBnBXpeqNu9khj7yL7wvV.avif",
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/panneau05-GkWwFoSwI1tdI52JGtLrfokd39EcZ6.avif",
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/panneau06-RN0no924w98dCR2WLKu9Lc5ix1yxsd.avif",
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/panneau08-MDTCtLoI5jgKXB9aMNIgb6jn6rpRlj.avif",
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/panneau10-st1uB7l391OAmADvAE7RopRDYVevb6.avif",
    ],
    video: "/videos/akupanel-demo.mp4",
    features: [
      "Support flexible - s'adapte a toute courbe",
      "Couverture de 270x110cm par piece",
      "Indice NRC superieur de 0.85",
      "Plusieurs tons de bois disponibles",
      "Installation facile a faire soi-meme",
      "Noyau en feutre acoustique haute densite",
      "Faible emission de formaldehyde (0.05 mg/m3)",
      "Teste et certifie SGS",
    ],
    dimensions: "270cm x 110cm x 2.1cm",
    material: "Lattes en MDF / Support en Feutre Acoustique",
    inStock: true,
    badge: "Meilleure Vente",
    onSale: true,
    colors: [
      { id: "natural-fr", name: "Naturel", hex: "#D4B896", image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Gemini_Generated_Image_gv77m0gv77m0gv77-2ZuSE03hVAhko9zJULiZyynQuzvSro.png" },
      { id: "walnut-fr", name: "Noyer", hex: "#5D4037", image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Gemini_Generated_Image_v6k2hsv6k2hsv6k2-WlF4p8OnMPN9VN2jMsVPIoGPJUxmAU.png" },
      { id: "black-fr", name: "Noir", hex: "#2D2D2D", image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Gemini_Generated_Image_y18qr9y18qr9y18q-nzi1de1MXOo3sji65NDIhMdbxWOdIk.png" },
      { id: "grey-fr", name: "Gris", hex: "#9E9E9E", image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Gemini_Generated_Image_hoylswhoylswhoyl-IspXGlydLXx9MoShiAKqZWmOiQQpwj.png" },
    ],
  },
  {
    id: "prod_U4kuz3MBgNjf76",
    slug: "oak-slat-wall-panel",
    name: "Oak Slat Wall Panel",
    description:
      "Handcrafted natural oak slat panel with warm undertones. Perfect for creating a cozy Scandinavian atmosphere.",
    longDescription:
      "Transform your space with our premium Oak Slat Wall Panel, meticulously handcrafted from sustainably sourced European oak. Each panel features precisely spaced slats that create beautiful light and shadow patterns throughout the day. The natural grain variations make every panel unique, bringing warmth and texture to any room. Ideal for living rooms, bedrooms, or office spaces seeking that authentic Nordic aesthetic.",
    price: 14,
    currency: "GBP",
    category: "wall-panels",
    images: [
      "/oak-wood-slat-wall-panel-natural-texture-scandinav.jpg",
      "/oak-slat-panel-installed-living-room-modern.jpg",
      "/oak-wood-panel-close-up-grain-detail.jpg",
    ],
    features: ["100% European oak", "Easy installation system", "Sound absorption properties", "FSC certified wood"],
    dimensions: "120cm x 60cm x 2cm",
    material: "Solid European Oak",
    inStock: true,
    badge: "Bestseller",
  },
  {
    id: "prod_U4kuODmzE1memh",
    slug: "walnut-acoustic-panel",
    name: "Walnut Acoustic Panel",
    description: "Premium walnut acoustic panel combining elegant aesthetics with superior sound absorption.",
    longDescription:
      "Experience the perfect fusion of form and function with our Walnut Acoustic Panel. Engineered with a high-density acoustic core and wrapped in luxurious American walnut veneer, this panel dramatically reduces echo and reverb while adding sophisticated warmth to your interior. The deep chocolate tones of the walnut create a striking visual statement that elevates any contemporary or traditional space.",
    price: 25,
    currency: "GBP",
    category: "wall-panels",
    images: [
      "/walnut-acoustic-panel-dark-wood-elegant-modern.jpg",
      "/walnut-panel-home-office-professional.jpg",
      "/acoustic-panel-sound-studio-walnut.jpg",
    ],
    features: ["NRC rating 0.85", "American walnut veneer", "Fire retardant core", "Modular design system"],
    dimensions: "120cm x 60cm x 4cm",
    material: "Walnut Veneer / Acoustic Core",
    inStock: true,
    badge: "New",
  },
  {
    id: "prod_U4kuzRsw3B5dBe",
    slug: "minimalist-arc-lamp",
    name: "Minimalist Arc Lamp",
    description: "Elegant floor lamp with sweeping arc design. Brass finish with linen shade.",
    longDescription:
      "The Minimalist Arc Lamp embodies the essence of Scandinavian design philosophy—beautiful simplicity with purposeful function. The graceful brass arc extends elegantly over seating areas, providing warm ambient light through its natural linen shade. The weighted marble base ensures stability while adding a touch of luxury. Perfect for reading nooks or as a statement piece in your living space.",
    price: 159,
    currency: "GBP",
    category: "lighting",
    images: ["/minimalist-arc-floor-lamp-brass-linen-shade.jpg"],
    features: ["Adjustable arc height", "Natural linen shade", "Marble base", "E27 bulb compatible"],
    dimensions: "Height: 180cm, Arc reach: 120cm",
    material: "Brass / Marble / Linen",
    inStock: true,
  },
  {
    id: "prod_U4kuu8uiPc6s44",
    slug: "organic-ceramic-vase",
    name: "Organic Ceramic Vase",
    description: "Hand-thrown ceramic vase with organic curves and matte glaze finish.",
    longDescription:
      "Each Organic Ceramic Vase is individually hand-thrown by skilled artisans in our Portuguese atelier, making every piece truly one-of-a-kind. The deliberate imperfections and organic curves celebrate the beauty of handcraft, while the soft matte glaze in our signature clay tone adds understated elegance. Whether displayed empty as a sculptural object or filled with dried botanicals, this vase brings artisanal warmth to any surface.",
    price: 79,
    currency: "GBP",
    category: "decor",
    images: [
      "/organic-ceramic-vase-matte-beige-handmade.jpg",
      "/ceramic-vase-dried-flowers-minimalist.jpg",
      "/handmade-pottery-vase-detail-texture.jpg",
    ],
    features: ["Handmade in Portugal", "Food-safe glaze", "Waterproof interior", "Unique piece"],
    dimensions: "Height: 28cm, Diameter: 15cm",
    material: "Stoneware Ceramic",
    inStock: true,
    styles: [
      { id: "matte-white", name: "Matte White", image: "/organic-ceramic-vase-matte-beige-handmade.jpg" },
      { id: "natural-dried", name: "Natural with Dried Flowers", image: "/ceramic-vase-dried-flowers-minimalist.jpg" },
      { id: "blue-painted", name: "Blue Painted", image: "/handmade-pottery-vase-detail-texture.jpg" },
    ],
  },
  {
    id: "prod_U4kv4CKxEyo0xu",
    slug: "recessed-led-strip-lighting",
    name: "Recessed LED Strip Kit",
    description: "Warm 3000K LED strip kit for recessed panel lighting. Self-adhesive with touch dimmer. 8 pieces included.",
    longDescription:
      "Elevate your wall panels with our professional Recessed LED Strip Kit, designed specifically for behind-panel installation. This complete 8-piece kit includes LED strips in multiple sizes (18\", 26\", 34\", 42\" - 2 of each), a premium LED driver, touch sensor dimmer switch, and all connecting cables. The warm 3000K color temperature creates a cozy ambient glow, while the touch dimmer allows adjustment from 10% to 100% brightness with memory function. Features customized thicker adhesive tape for superior mounting and black aluminum housing that disappears behind panels. Quick connect system makes installation effortless. Perfect for bedrooms, living rooms, offices, and sofa walls.",
    price: 150.49,
    currency: "GBP",
    category: "lighting",
    images: [
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/LED0101-NcQN4b3GARfX7EQhQSIcnMbQB9NsFa.jpg",
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/LED0202-FgYEc2VLFBKleJV7PYlgETikXoR8mG.jpg",
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/LED0303-gogSHAtk3fgrlc95hSLuauXIeSc1We.jpg",
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/LED0333-aAgFPx9MLEjZ1qUmRjKyg0TTMx5AlI.jpg",
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/LED030303-P4LLJ1QfKkKzSLlIC8ahDalqeFtXkt.jpg",
    ],
    features: [
      "8 LED strips included (2x each size)",
      "Warm 3000K color temperature",
      "Touch dimmer 10%-100% with memory",
      "Premium thick self-adhesive tape",
      "Black aluminum housing",
      "LED driver included",
      "Quick connect cables (2m length)",
      "Perfect for recessed installation",
    ],
    dimensions: "18\", 26\", 34\", 42\" strips (2 each)",
    material: "Black Aluminum / LED",
    inStock: true,
    badge: "Popular",
  },
  {
    id: "prod_U4kvhZVdMgj3T5",
    slug: "wall-preparation-cleaner",
    name: "Wall Preparation Cleaner",
    description: "Professional foaming wall cleaner for pre-installation surface preparation. Removes dirt, grease, and stains without damaging surfaces.",
    longDescription:
      "Prepare your walls perfectly before installing acoustic panels with our professional-grade Foaming Wall Cleaner. This powerful yet gentle formula removes dirt, scuffs, grease, grime, markers, crayons, nicotine residue, fingerprints, and makeup without damaging painted surfaces. The clinging foam technology ensures no drips and fast, scrub-free cleaning. Safe on most painted walls, doors, baseboards, cabinets, and washable wallpaper. Made in USA with globally sourced materials. Essential for achieving the best adhesion and finish when installing wall panels.",
    price: 12.99,
    currency: "GBP",
    category: "decor",
    images: [
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/CLEAN04-jsHtrQ87vwg45Qyo5RrSkzrJbV2MXC.jpg",
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/CLEAN05-OrCyYhiGFlNOZJ6uMPv729KBWN6jHG.jpg",
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/CLEAN05E-ImqfbNfWohct5EliXBJBJy3edDfAHq.jpg",
    ],
    features: [
      "Fast scrub-free cleaning",
      "Clinging foam - no drips",
      "Safe on painted walls",
      "Removes dirt, grease, markers, crayons",
      "Removes nicotine residue & fingerprints",
      "Works on cabinets & baseboards",
      "18 oz (510g) can",
      "Made in USA",
    ],
    dimensions: "18 oz (510g)",
    material: "Foaming Cleaner Solution",
    inStock: true,
    badge: "Essential",
  },
  // French version of LED Strip Kit
  {
    id: "prod_U2rv6g1To7VPTZ",
    slug: "recessed-led-strip-lighting-fr",
    name: "Kit Ruban LED Encastre",
    description: "Ruban LED blanc chaud 3000K pour eclairage de panneaux encastres. Auto-adhesif avec variateur tactile. 8 pieces incluses.",
    longDescription:
      "Ameliorez vos panneaux muraux avec notre Kit Ruban LED Encastre professionnel, concu specifiquement pour l'installation derriere les panneaux. Ce kit complet de 8 pieces comprend des rubans LED de plusieurs tailles (18\", 26\", 34\", 42\" - 2 de chaque), un driver LED premium, un variateur tactile, et tous les cables de connexion. La temperature de couleur chaude de 3000K cree une ambiance chaleureuse, tandis que le variateur tactile permet un reglage de 10% a 100% de luminosite avec fonction memoire. Caracterise par un ruban adhesif plus epais pour un montage superieur et un boitier en aluminium noir qui disparait derriere les panneaux. Le systeme de connexion rapide rend l'installation simple. Parfait pour chambres, salons, bureaux et murs de canape.",
    price: 150.49,
    currency: "EUR",
    category: "lighting",
    images: [
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/LED0101-NcQN4b3GARfX7EQhQSIcnMbQB9NsFa.jpg",
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/LED0202-FgYEc2VLFBKleJV7PYlgETikXoR8mG.jpg",
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/LED0303-gogSHAtk3fgrlc95hSLuauXIeSc1We.jpg",
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/LED0333-aAgFPx9MLEjZ1qUmRjKyg0TTMx5AlI.jpg",
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/LED030303-P4LLJ1QfKkKzSLlIC8ahDalqeFtXkt.jpg",
    ],
    features: [
      "8 rubans LED inclus (2x chaque taille)",
      "Temperature de couleur blanc chaud 3000K",
      "Variateur tactile 10%-100% avec memoire",
      "Ruban auto-adhesif epais premium",
      "Boitier en aluminium noir",
      "Transformateur LED inclus",
      "Cables de connexion rapide (2m)",
      "Parfait pour installation encastree",
    ],
    dimensions: "18\", 26\", 34\", 42\" rubans (2 de chaque)",
    material: "Aluminium Noir / LED",
    inStock: true,
    badge: "Populaire",
  },
  // French version of Wall Cleaner
  {
    id: "prod_U2rvHwRWU8IYTd",
    slug: "wall-preparation-cleaner-fr",
    name: "STARWAX Anti-moisissures pour murs et pieces a vivre 500ML",
    description: "Ideal pour eliminer les moisissures sur les murs, plafonds, contours de fenetres des pieces a vivre. Sans rincage, sans odeur incommodante, ne decolore pas les supports. Sans Javel.",
    longDescription:
      "STARWAX Anti-moisissures pour murs et pieces a vivre 500ML - Ideal pour eliminer les moisissures sur les murs, plafonds, contours de fenetres des pieces a vivre. Pret a l'emploi : sans rincage, sans odeur incommodante, ne tache pas. Fongicide selon EN1650 et EN13697 en 15 min a 20C. Bactericide selon les normes EN1276 et EN13697 en 5 min a 20C. Virucide sur virus enveloppes selon la norme EN 14476 en 1 min a 20C. Utilisable sur chambres, salon, murs et plafonds peints, papier vinyl, contours de fenetres, surfaces lavables dures. Flacon pulverisateur de 500ml. Sans Javel.",
    price: 14.88,
    currency: "EUR",
    category: "decor",
    hidden: true,
    images: [
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/CLEAN04-jsHtrQ87vwg45Qyo5RrSkzrJbV2MXC.jpg",
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/CLEAN05-OrCyYhiGFlNOZJ6uMPv729KBWN6jHG.jpg",
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/CLEAN05E-ImqfbNfWohct5EliXBJBJy3edDfAHq.jpg",
    ],
    features: [
      "Sans rincage, sans odeur incommodante",
      "Ne decolore pas les supports",
      "Fongicide selon EN1650 et EN13697 en 15 min",
      "Bactericide selon EN1276 et EN13697 en 5 min",
      "Virucide selon EN 14476 en 1 min",
      "Sans Javel",
      "Flacon pulverisateur 500ml",
      "Fabrique en France",
    ],
    dimensions: "500 ml",
    material: "Solution Anti-moisissures",
    inStock: true,
    badge: "Essentiel",
  },
  // Tableau Madrid - Stade Santiago Bernabéu (FR only)
  {
    id: "prod_U2rvgYxfRGaGl7",
    slug: "tableau-madrid-santiago-bernabeu",
    name: "Tableau Madrid Stade Santiago Bernabéu en Noir et Blanc",
    description:
      "Tableau décoratif exclusif du Stade Santiago Bernabéu en noir et blanc. Impression haute définition sur papier photographique 240g. Disponible en plusieurs tailles et types de finition.",
    longDescription:
      "Avec un design exclusif et une finition de haute qualité, le Tableau Madrid Stade Santiago Bernabéu en Noir et Blanc va sublimer la décoration de votre intérieur avec un style moderne, élégant et qui vous ressemble. Choisissez votre moldure et les dimensions souhaitées ci-dessous. Impression en haute définition sur papier photographique 240g avec des couleurs intenses, soigneusement emballé et envoyé en tube postal résistant. Impression avec encre écologique et non toxique.",
    price: 87.90,
    originalPrice: 109.90,
    currency: "EUR",
    category: "decor",
    hidden: true,
    images: [
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/11_50_05_829_11_2_1_169_lr01427destaque-3rTBVWdA4H0XQmcV9lYEdKBX5Mv0eo.webp",
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/17_39_26_187_lr01427-filete-preta%20%281%29-9tbzZKTDsBeo3Zh5UCm6vWsOFY4A2q.webp",
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/11_50_13_758_11_2_1_119_lr01427ambiente03%20%282%29-rKVz9Zs6yc0iLmDktTFO4xdy6Wk4Rh.webp",
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Gemini_Generated_Image_ho4ec5ho4ec5ho4e-2UOOEE3fBhit8jtumSwUCqnRq9qgrb.png",
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Gemini_Generated_Image_iflkykiflkykiflk-14ui5eCJO8pRc8M5c39UDE3wbYdvWl.png",
    ],
    inStock: true,
    badge: "Nouveau",
    onSale: true,
    colors: [
      { id: "noir", name: "Noir", hex: "#1a1a1a" },
      { id: "blanc", name: "Blanc", hex: "#f5f5f5" },
      { id: "naturel", name: "Naturel", hex: "#D4B896" },
      { id: "freijo", name: "Freijó", hex: "#8B6343" },
      { id: "noyer", name: "Noyer", hex: "#3E2010" },
    ],
    styles: [
      {
        id: "moldura-filete",
        name: "1. Moldure Filet",
        image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Captura%20de%20Tela%202026-02-24%20a%CC%80s%2018.45.03-NTFToD4wrDKpV1RFrnvW7mTw9peTDT.png",
      },
      {
        id: "moldura-premium-vidro",
        name: "2. Moldure Premium avec Verre",
        image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Captura%20de%20Tela%202026-02-24%20a%CC%80s%2018.45.23-G7bxIKBuZznu8W7rUxPelmIGP6JOPH.png",
      },
      {
        id: "moldura-premium-sem-vidro",
        name: "3. Moldure Premium sans Verre",
        image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Captura%20de%20Tela%202026-02-24%20a%CC%80s%2018.45.23-G7bxIKBuZznu8W7rUxPelmIGP6JOPH.png",
      },
      {
        id: "canvas",
        name: "4. Canvas avec Cadre",
        image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Captura%20de%20Tela%202026-02-24%20a%CC%80s%2018.46.39-g1dRjZY79eMT0M1qQGmgtaYlDPnfzu.png",
      },
      {
        id: "papel-fotografico",
        name: "5. Papier Photographique",
        image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Captura%20de%20Tela%202026-02-24%20a%CC%80s%2018.46.39-g1dRjZY79eMT0M1qQGmgtaYlDPnfzu.png",
      },
      {
        id: "placa-decorativa",
        name: "6. Plaque Décorative",
        image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Captura%20de%20Tela%202026-02-24%20a%CC%80s%2018.44.29-h5L4XO5SWUCqL2AlrrlxdX377ONxH6.png",
      },
    ],
    features: [
      "Impression haute définition sur papier 240g",
      "Disponible en 6 tailles : 21x30, 30x40, 40x60, 50x70, 70x100, 100x150 cm",
      "6 types de finition disponibles",
      "5 couleurs de moldure disponibles",
      "Encre écologique et non toxique",
      "Emballage soigné en tube postal résistant",
      "Fait à la main avec soin",
      "Certificat de qualité inclus",
    ],
    dimensions: "21x30 cm | 30x40 cm | 40x60 cm | 50x70 cm | 70x100 cm | 100x150 cm",
    material: "Papier Photographique 240g / Bois de Pin 100% reboisement",
  },

  // Test Product EN
  {
    id: "prod_test_usd_2",
    slug: "test-product-usd",
    name: "Test Product",
    description: "Test product for system verification - Symbolic price of $2 with no shipping",
    longDescription:
      "This is a test product created to verify the proper functioning of the e-commerce system with USD (US Dollar) currency. This product has a symbolic price of $2.00 and should only be used for testing and validation purposes. No shipping charges apply.",
    price: 2.00,
    currency: "USD",
    category: "decor",
    hidden: true,
    noShipping: true,
    images: [
      "/placeholder.svg",
    ],
    features: [
      "Test product only",
      "Symbolic price $2.00",
      "No shipping charges",
      "For system validation",
    ],
    dimensions: "Test",
    material: "Test",
    inStock: true,
    badge: "Test",
  },

  // Test Product FR
  {
    id: "prod_U2rwsqAu2lmXwH",
    slug: "produit-test-fr",
    name: "Produit Test",
    description: "Produit de test pour verification du systeme - Prix symbolique de 2 euros",
    longDescription:
      "Ceci est un produit de test cree pour verifier le bon fonctionnement du systeme de commerce electronique avec la devise EUR (Euro). Ce produit a un prix symbolique de 2,00 € et ne doit etre utilise qu'a des fins de test et de validation.",
    price: 2.00,
    currency: "EUR",
    category: "decor",
    hidden: true,
    noShipping: true,
    images: [
      "/placeholder.svg",
    ],
    features: [
      "Produit de test uniquement",
      "Prix symbolique 2,00 €",
      "Ne pas utiliser en production",
      "Pour validation du systeme",
    ],
    dimensions: "Test",
    material: "Test",
    inStock: true,
    badge: "Test",
  },
]

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug)
}

// Get only visible products (exclude hidden FR products)
export function getVisibleProducts(): Product[] {
  return products.filter((p) => !p.hidden)
}

export function getProductsByCategory(category: string): Product[] {
  return products.filter((p) => p.category === category && !p.hidden)
}

export function getFeaturedProducts(): Product[] {
  return products.filter((p) => p.badge && !p.hidden)
}

// FR Market Functions - Only show products with -fr suffix (EUR currency)
export function getVisibleProductsFr(): Product[] {
  return products.filter((p) => p.slug.endsWith("-fr") && p.currency === "EUR")
}

export function getProductsByCategoryFr(category: string): Product[] {
  return products.filter((p) => p.category === category && p.slug.endsWith("-fr") && p.currency === "EUR")
}

export function getFeaturedProductsFr(): Product[] {
  return products.filter((p) => p.badge && p.slug.endsWith("-fr") && p.currency === "EUR")
}
