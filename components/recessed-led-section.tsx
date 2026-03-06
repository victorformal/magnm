"use client"

import Image from "next/image"

interface RecessedLedImage {
  src: string
  alt: string
  title: string
  description: string
}

export function RecessedLedSection() {
  const recessedLedImages: RecessedLedImage[] = [
    {
      src: "/recessed-led-howto.jpg",
      alt: "How to install recessed LED strips - 5 step installation guide",
      title: "Easy Installation",
      description: "5-step installation process: Attach light tapes to power, attach sensor switch, attach power cord, peel protective film, and stick to wall",
    },
    {
      src: "/recessed-led-living-room.jpg",
      alt: "Modern living room with recessed LED strips integrated with acoustic panels",
      title: "Living Room Ambiance",
      description: "Transform your living room with vertical recessed LED strips that accentuate acoustic panels for stunning visual impact",
    },
    {
      src: "/recessed-led-tv-wall.jpg",
      alt: "TV wall with recessed LED lighting creating cinematic ambiance",
      title: "TV Wall Enhancement",
      description: "Create a cinema-like atmosphere with recessed LED strips framing your entertainment area",
    },
    {
      src: "/recessed-led-kitchen.jpg",
      alt: "Kitchen with CIR90 high-brightness linear LED lighting",
      title: "Kitchen Cabinet Lighting",
      description: "CIR90 high-brightness linear lighting provides vibrant illumination for kitchen cabinets and workspaces",
    },
    {
      src: "/recessed-led-office.jpg",
      alt: "Modern office workspace with recessed LED accent lighting",
      title: "Professional Office Space",
      description: "Create a productive and stylish office environment with integrated recessed LED panels",
    },
    {
      src: "/recessed-led-bedroom.jpg",
      alt: "Bedroom accent wall with recessed LED strips for relaxation",
      title: "Bedroom Relaxation",
      description: "Design a serene bedroom sanctuary with warm recessed LED lighting integrated into wall panels",
    },
    {
      src: "/recessed-led-8pack-install.jpg",
      alt: "8-pack LED strip installation in modern living room",
      title: "Multi-Pack Installation",
      description: "Create stunning wall displays with 8-pack LED strip installations across large areas",
    },
    {
      src: "/recessed-led-living-room-2.jpg",
      alt: "Elegant living room with recessed LED strips on panel walls",
      title: "Elegant Design Integration",
      description: "Seamlessly integrate recessed LED strips with acoustic panels for sophisticated interior design",
    },
    {
      src: "/recessed-led-bedroom-decoration.jpg",
      alt: "Bedroom decoration with recessed LED lighting and wood slat panels",
      title: "Decorative Bedroom Setup",
      description: "Transform your bedroom with recessed LED lighting integrated into wood slat acoustic panels",
    },
    {
      src: "/recessed-led-restaurant.jpg",
      alt: "Restaurant dining area with recessed LED accent lighting",
      title: "Commercial Application",
      description: "Perfect for restaurants and dining spaces - create an upscale ambiance with recessed LED strips",
    },
    {
      src: "/recessed-led-dimming-feature.jpg",
      alt: "Touch dimmer control for stepless brightness adjustment",
      title: "Smart Dimming (10-100%)",
      description: "Control brightness effortlessly with long-press dimming - adjust from 10% to 100% brightness in real-time",
    },
    {
      src: "/recessed-led-dimmer-control.jpg",
      alt: "Touch sensor dimmer with memory function",
      title: "Smart Control Features",
      description: "Memory function remembers your last brightness setting - turn on at your preferred brightness level automatically",
    },
    {
      src: "/recessed-led-quick-connect.jpg",
      alt: "Quick Connect system with extra-long connecting cables",
      title: "Quick Connect System",
      description: "Extra-long connecting cables (2m/78.74 inch) allow flexible LED strip placement and installation",
    },
    {
      src: "/recessed-led-black-b-specs.jpg",
      alt: "Black-B LED variant specifications showing multiple lengths",
      title: "Multiple Size Options",
      description: "Available in multiple lengths: 18\", 26\", 34\", and 42\" - choose the perfect size for your space",
    },
    {
      src: "/recessed-led-room-applications.jpg",
      alt: "Multi-room applications showing office, bedrooms, living room, and sofa wall",
      title: "Versatile Applications",
      description: "Perfect for offices, bedrooms, living rooms, sofa walls - limitless design possibilities",
    },
    {
      src: "/recessed-led-adhesive-quality.jpg",
      alt: "Superior customized adhesive tape comparison",
      title: "Premium Adhesive",
      description: "Our customized adhesive tape is stickier and thicker than competitors - secure and long-lasting installation",
    },
    {
      src: "/recessed-led-energy-efficient.jpg",
      alt: "Energy efficient LED strips with 50,000 hour service life",
      title: "Energy Efficient & Durable",
      description: "50,000+ hour service life with only 0.43 kWh/day consumption - eco-friendly and economical",
    },
  ]

  return (
    <section className="mt-16 sm:mt-24 py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="mb-8 sm:mb-12">
          <h2 className="font-serif text-2xl sm:text-3xl mb-4 text-foreground">
            Recessed LED Strip Lighting
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-3xl">
            Elevate your acoustic panels with integrated vertical LED lighting. Create stunning visual effects with customizable brightness, flexible installation, and premium quality construction. Perfect for living rooms, bedrooms, offices, and commercial spaces.
          </p>
        </div>

        {/* Image Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {recessedLedImages.map((item, index) => (
            <div
              key={index}
              className="flex flex-col h-full rounded-lg overflow-hidden bg-card border border-border hover:shadow-lg transition-shadow duration-300"
            >
              {/* Image Container */}
              <div className="relative w-full h-48 sm:h-56 md:h-64 overflow-hidden bg-muted flex-shrink-0">
                <Image
                  src={item.src}
                  alt={item.alt}
                  width={400}
                  height={300}
                  className="w-full h-full object-cover"
                  style={{ width: "auto", height: "auto" }}
                />
              </div>

              {/* Content */}
              <div className="p-4 sm:p-6 flex flex-col flex-grow">
                <h3 className="font-semibold text-base sm:text-lg mb-2 text-foreground">
                  {item.title}
                </h3>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Features Summary */}
        <div className="mt-12 sm:mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 bg-muted p-6 sm:p-8 rounded-lg">
          <div>
            <h4 className="font-semibold text-foreground mb-2">Smart Dimming</h4>
            <p className="text-sm text-muted-foreground">Stepless brightness control from 10% to 100% with memory function</p>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-2">Easy Installation</h4>
            <p className="text-sm text-muted-foreground">Quick Connect system with extra-long cables for flexible placement</p>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-2">Premium Quality</h4>
            <p className="text-sm text-muted-foreground">Superior adhesive tape that is stickier and thicker than competitors</p>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-2">Energy Efficient</h4>
            <p className="text-sm text-muted-foreground">50,000+ hour lifespan using only 0.43 kWh per day</p>
          </div>
        </div>
      </div>
    </section>
  )
}
