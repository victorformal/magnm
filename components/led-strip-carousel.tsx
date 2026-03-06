"use client"

import React, { useState, useEffect, useRef } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"

// Main feature slides with titles
const featureSlides = [
  {
    src: "/images/led-intro-dimmer.jpg",
    title: "Dimmable Wood Slat Wall Panel Lights",
    subtitle: "Long press for stepless dimming 10%-100%",
  },
  {
    src: "/images/led-intro-energy.jpg",
    title: "24/7 Operation - Energy Efficient & Weather Resistant",
    subtitle: "50,000+ hour service life",
  },
  {
    src: "/images/led-intro-howto.jpg",
    title: "User Friendly - Plug and Play",
    subtitle: "Easy installation in minutes",
  },
]

// LED Strip Product Showcase - Scrollable carousel
const ledStripShowcase = [
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/LED0101-NcQN4b3GARfX7EQhQSIcnMbQB9NsFa.jpg",
    alt: "LED Strip 6-Pack Showcase",
    title: "Complete 6-Pack Kit",
    description: "Living room installation with wood slat wall panels",
  },
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/LED0202-FgYEc2VLFBKleJV7PYlgETikXoR8mG.jpg",
    alt: "LED Strip Features",
    title: "Advanced Features",
    description: "Dimmable, Strong Adhesion, Energy-Efficient, 24V Safe, Touch Control, Easy Installation",
  },
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/LED0303-gogSHAtk3fgrlc95hSLuauXIeSc1We.jpg",
    alt: "LED Strip Dimming Control",
    title: "Dimming & Touch Control",
    description: "Short press: turn lights on/off; Long press: adjust brightness from 10%-100%",
  },
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/LED030303-P4LLJ1QfKkKzSLlIC8ahDalqeFtXkt.jpg",
    alt: "LED Strip Installation Details",
    title: "Thoughtful Details, Effortless Use",
    description: "Self-Adhesive Design, Extra Adhesive Strip, Black Power Cord - Perfect for WPC/Wood Slat Wall Panel",
  },
]

// Room showcase tabs
const roomTabs = [
  { id: "living", label: "Living Room", image: "/images/led-room-living.jpg" },
  { id: "bedroom", label: "Bedroom", image: "/images/led-room-bedroom.jpg" },
  { id: "tv", label: "TV Background", image: "/images/led-room-tv.jpg" },
  { id: "office", label: "Home Office", image: "/images/led-room-office.jpg" },
  { id: "restaurant", label: "Restaurant", image: "/images/led-room-restaurant.jpg" },
]

export function LedStripCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [activeRoom, setActiveRoom] = useState("living")
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)
  const scrollRef = useRef<HTMLDivElement>(null)

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % featureSlides.length)
  }

  const goToPrev = () => {
    setCurrentSlide((prev) => (prev - 1 + featureSlides.length) % featureSlides.length)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 75) {
      goToNext()
    }
    if (touchStart - touchEnd < -75) {
      goToPrev()
    }
  }

  useEffect(() => {
    const interval = setInterval(() => {
      goToNext()
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const activeRoomData = roomTabs.find((r) => r.id === activeRoom)

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: "smooth" })
    }
  }

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: "smooth" })
    }
  }

  return (
    <div className="mt-8 border-t border-border pt-8 space-y-8">
      {/* Feature Slides Carousel */}
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-wider mb-4">Product Highlights</h2>

        <div
          className="relative w-full overflow-hidden rounded-lg"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Main Image Container */}
          <div className="relative aspect-[4/3] w-full">
            {featureSlides.map((slide, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-500 ${
                  index === currentSlide ? "opacity-100" : "opacity-0 pointer-events-none"
                }`}
              >
                <img
                  src={slide.src || "/placeholder.svg"}
                  alt={slide.title}
                  className="w-full h-full object-cover"
                />
                {/* Overlay with text */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-3 right-3 text-white">
                  <h3 className="text-sm sm:text-lg font-bold leading-tight">{slide.title}</h3>
                  <p className="text-xs sm:text-sm text-white/90 mt-1">{slide.subtitle}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={goToPrev}
            className="absolute left-1 top-1/2 -translate-y-1/2 w-7 h-7 sm:w-9 sm:h-9 bg-white/70 hover:bg-white rounded-full flex items-center justify-center shadow-md transition-all"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-800" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-1 top-1/2 -translate-y-1/2 w-7 h-7 sm:w-9 sm:h-9 bg-white/70 hover:bg-white rounded-full flex items-center justify-center shadow-md transition-all"
            aria-label="Next slide"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-800" />
          </button>

          {/* Dots Indicator */}
          <div className="absolute bottom-12 sm:bottom-14 left-1/2 -translate-x-1/2 flex gap-1.5">
            {featureSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentSlide ? "bg-amber-500 w-5" : "bg-white/60 w-2 hover:bg-white/80"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Interactive Room Showcase */}
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-wider mb-4">See It In Your Space</h2>

        {/* Room Tabs */}
        <div className="flex gap-1 overflow-x-auto scrollbar-hide pb-2 -mx-3 px-3 sm:mx-0 sm:px-0">
          {roomTabs.map((room) => (
            <button
              key={room.id}
              onClick={() => setActiveRoom(room.id)}
              className={`flex-shrink-0 px-3 py-1.5 text-xs sm:text-sm font-medium rounded-full transition-all whitespace-nowrap ${
                activeRoom === room.id
                  ? "bg-foreground text-background"
                  : "bg-secondary/50 text-muted-foreground hover:bg-secondary"
              }`}
            >
              {room.label}
            </button>
          ))}
        </div>

        {/* Room Image Display */}
        <div className="relative mt-3 rounded-lg overflow-hidden aspect-[4/3] w-full">
          {roomTabs.map((room) => (
            <div
              key={room.id}
              className={`absolute inset-0 transition-opacity duration-300 ${
                activeRoom === room.id ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
            >
              <img
                src={room.image || "/placeholder.svg"}
                alt={room.label}
                className="w-full h-full object-cover"
              />
            </div>
          ))}

          {/* Navigation arrows for rooms */}
          <button
            onClick={() => {
              const currentIndex = roomTabs.findIndex((r) => r.id === activeRoom)
              const prevIndex = (currentIndex - 1 + roomTabs.length) % roomTabs.length
              setActiveRoom(roomTabs[prevIndex].id)
            }}
            className="absolute left-1 top-1/2 -translate-y-1/2 w-7 h-7 sm:w-9 sm:h-9 bg-white/70 hover:bg-white rounded-full flex items-center justify-center shadow-md transition-all"
            aria-label="Previous room"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-800" />
          </button>
          <button
            onClick={() => {
              const currentIndex = roomTabs.findIndex((r) => r.id === activeRoom)
              const nextIndex = (currentIndex + 1) % roomTabs.length
              setActiveRoom(roomTabs[nextIndex].id)
            }}
            className="absolute right-1 top-1/2 -translate-y-1/2 w-7 h-7 sm:w-9 sm:h-9 bg-white/70 hover:bg-white rounded-full flex items-center justify-center shadow-md transition-all"
            aria-label="Next room"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-800" />
          </button>
        </div>
      </div>

      {/* LED Strip Product Showcase */}
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-wider mb-4">LED Strip Features</h2>

        <div className="relative">
          <div
            ref={scrollRef}
            className="flex gap-3 overflow-x-auto scroll-smooth pb-2 -mx-3 px-3 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:gap-4"
            style={{ scrollBehavior: "smooth" }}
          >
            {ledStripShowcase.map((item, index) => (
              <div key={index} className="flex-shrink-0 w-72 sm:w-full">
                <div className="rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow bg-secondary/50">
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
                    <Image
                      src={item.src}
                      alt={item.alt}
                      width={300}
                      height={225}
                      className="h-full w-full object-cover"
                      style={{ width: "auto", height: "auto" }}
                      unoptimized
                    />
                  </div>
                  <div className="p-3">
                    <h4 className="font-semibold text-sm text-foreground leading-tight">{item.title}</h4>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={scrollLeft}
            className="sm:hidden absolute left-0 top-1/3 -translate-y-1/2 w-8 h-8 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 flex items-center justify-center shadow-lg z-10"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={scrollRight}
            className="sm:hidden absolute right-0 top-1/3 -translate-y-1/2 w-8 h-8 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 flex items-center justify-center shadow-lg z-10"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
