"use client"

import { useRef, useEffect, useCallback, useState } from "react"
import { Play } from "lucide-react"
import { cn } from "@/lib/utils"

const VIDEOS = [
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Akupanel%20240%20_%20E%CC%81liminez%20la%20re%CC%81verbe%CC%81ration%20-%20WoodUpp-6-ssHEKxZl4rD7EMywdjKOFupRQJBCRD.mp4",
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Akupanel%20240%20_%20E%CC%81liminez%20la%20re%CC%81verbe%CC%81ration%20-%20WoodUpp-2-L7rDT4HLc5y9iKbUaUmtU4GlJi1hQL.mp4",
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Akupanel%20240%20_%20E%CC%81liminez%20la%20re%CC%81verbe%CC%81ration%20-%20WoodUpp-3-TL180uV5d9e7AhCQeYpQXwDCtf0reg.mp4",
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Akupanel%20240%20_%20E%CC%81liminez%20la%20re%CC%81verbe%CC%81ration%20-%20WoodUpp-7-q4AAEXP9HeUQcc1RUAuMImDy8hP4pg.mp4",
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Akupanel%20240%20_%20E%CC%81liminez%20la%20re%CC%81verbe%CC%81ration%20-%20WoodUpp-4-SOmDbYQRDcbbGuBoMACj9ygO9warRp.mp4",
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Akupanel%20240%20_%20E%CC%81liminez%20la%20re%CC%81verbe%CC%81ration%20-%20WoodUpp-6-plDb2YukyBgeCOMS8rkRt6FVhHLDPo.mp4",
]

function VideoCard({ src, index }: { src: string; index: number }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(false)

  const toggle = useCallback(() => {
    const video = videoRef.current
    if (!video) return
    // pause all other videos
    document.querySelectorAll<HTMLVideoElement>(".galerie-video").forEach((v) => {
      if (v !== video && !v.paused) {
        v.pause()
      }
    })
    if (video.paused) {
      video.play()
      setPlaying(true)
    } else {
      video.pause()
      setPlaying(false)
    }
  }, [])

  // Pause when leaving viewport
  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting && !video.paused) {
          video.pause()
          setPlaying(false)
        }
      },
      { threshold: 0.25 }
    )
    obs.observe(video)
    return () => obs.disconnect()
  }, [])

  return (
    <div
      onClick={toggle}
      className="relative flex-shrink-0 w-[72vw] max-w-[300px] sm:w-full sm:max-w-none cursor-pointer rounded-[18px] overflow-hidden bg-foreground"
      style={{ aspectRatio: "9/16", scrollSnapAlign: "start" }}
    >
      {/* Bottom gradient overlay */}
      <div
        className="absolute bottom-0 left-0 right-0 z-10 rounded-b-[18px]"
        style={{ height: "40%", background: "linear-gradient(to top, rgba(42,37,34,.55), transparent)" }}
      />

      <video
        ref={videoRef}
        src={src}
        playsInline
        preload="metadata"
        loop
        muted={false}
        className="galerie-video w-full h-full object-cover block pointer-events-none"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
      />

      {/* Play icon */}
      <div
        className={cn(
          "absolute inset-0 flex items-center justify-center z-20 transition-opacity duration-200",
          playing ? "opacity-0" : "opacity-100"
        )}
      >
        <div className="w-14 h-14 rounded-full bg-white/92 flex items-center justify-center shadow-lg">
          <Play className="w-6 h-6 text-foreground fill-foreground ml-1" />
        </div>
      </div>

      {/* Badge */}
      <span className="absolute bottom-3 left-3 z-30 bg-accent text-accent-foreground text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full">
        Client
      </span>
    </div>
  )
}

export function ProductDescriptionSection() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  // Update dots on scroll (mobile only)
  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const onScroll = () => {
      const items = el.querySelectorAll<HTMLDivElement>("[data-gallery-item]")
      if (!items.length) return
      const itemWidth = items[0].offsetWidth + 12
      const idx = Math.round(el.scrollLeft / itemWidth)
      setActiveIndex(Math.max(0, Math.min(idx, VIDEOS.length - 1)))
    }
    el.addEventListener("scroll", onScroll, { passive: true })
    return () => el.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <div className="mt-16 border-t border-border pt-16 overflow-hidden">
      {/* Header */}
      <div className="text-center px-5 mb-9">
        <h2 className="font-serif text-[clamp(26px,6vw,40px)] text-foreground mb-2.5 leading-tight text-balance">
          Galerie
        </h2>
        <p className="font-sans text-[clamp(14px,3.5vw,16px)] text-muted-foreground max-w-[480px] mx-auto leading-relaxed">
          Regardez ces magnifiques projets de nos clients et laissez-vous inspirer&nbsp;!
        </p>
      </div>

      {/* Video grid — mobile: horizontal scroll; tablet: 2-col; desktop: 3-col */}
      <div
        ref={scrollRef}
        className={cn(
          // Mobile: horizontal scroll carousel
          "flex gap-3 overflow-x-auto pb-4 px-5",
          "[scroll-snap-type:x_mandatory] [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          // Tablet 600px+: grid 2-col
          "sm:grid sm:grid-cols-2 sm:overflow-x-visible sm:px-6 sm:pb-0 sm:max-w-[700px] sm:mx-auto",
          // Desktop 960px+: grid 3-col
          "md:grid-cols-3 md:gap-[18px] md:max-w-[1060px] md:px-10"
        )}
      >
        {VIDEOS.map((src, i) => (
          <div key={i} data-gallery-item className="contents">
            <VideoCard src={src} index={i} />
          </div>
        ))}
      </div>

      {/* Dots — mobile only */}
      <div className="flex justify-center gap-1.5 mt-4 sm:hidden">
        {VIDEOS.map((_, i) => (
          <div
            key={i}
            className={cn(
              "w-1.5 h-1.5 rounded-full transition-all duration-200",
              i === activeIndex ? "bg-accent scale-125" : "bg-border"
            )}
          />
        ))}
      </div>

      {/* Key Features Summary */}
      <div className="mt-12 grid gap-4 sm:gap-6 grid-cols-2 lg:grid-cols-4 px-5 sm:px-6 md:px-10 max-w-[1060px] mx-auto">
        <div className="rounded-lg bg-secondary/50 p-4 sm:p-6 text-center">
          <h4 className="font-semibold text-sm sm:text-base">NRC 0.80</h4>
          <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-muted-foreground">Excellent Sound Absorption</p>
        </div>
        <div className="rounded-lg bg-secondary/50 p-4 sm:p-6 text-center">
          <h4 className="font-semibold text-sm sm:text-base">E1 Certified</h4>
          <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-muted-foreground">Low Formaldehyde Emission</p>
        </div>
        <div className="rounded-lg bg-secondary/50 p-4 sm:p-6 text-center">
          <h4 className="font-semibold text-sm sm:text-base">Easy Install</h4>
          <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-muted-foreground">DIY Friendly Setup</p>
        </div>
        <div className="rounded-lg bg-secondary/50 p-4 sm:p-6 text-center">
          <h4 className="font-semibold text-sm sm:text-base">SGS Certified</h4>
          <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-muted-foreground">Safe & Eco-Friendly</p>
        </div>
      </div>
    </div>
  )
}
