"use client"

import { useState, useRef, useCallback } from "react"
import Image from "next/image"
import { Play } from "lucide-react"
import { cn } from "@/lib/utils"

interface ProductGalleryProps {
  images: string[]
  productName: string
  video?: string
}

export function ProductGallery({ images, productName, video }: ProductGalleryProps) {
  // Total items = images + optional video at the end
  const totalItems = images.length + (video ? 1 : 0)
  const videoIndex = video ? images.length : -1

  const [selectedIndex, setSelectedIndex] = useState(0)
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const touchStartX = useRef(0)
  const touchEndX = useRef(0)

  const isExternalImage = (src: string) => src.startsWith("http")
  const isVideoSelected = selectedIndex === videoIndex

  const handlePlayVideo = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.play()
      setIsVideoPlaying(true)
    }
  }, [])

  // Swipe on main image area
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }, [])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX
  }, [])

  const handleTouchEnd = useCallback(() => {
    const diff = touchStartX.current - touchEndX.current
    const threshold = 50
    if (Math.abs(diff) > threshold) {
      if (diff > 0 && selectedIndex < totalItems - 1) {
        setSelectedIndex((prev) => prev + 1)
        setIsVideoPlaying(false)
      } else if (diff < 0 && selectedIndex > 0) {
        setSelectedIndex((prev) => prev - 1)
        setIsVideoPlaying(false)
      }
    }
  }, [selectedIndex, totalItems])

  const handleSelectIndex = useCallback((index: number) => {
    setSelectedIndex(index)
    setIsVideoPlaying(false)
    if (videoRef.current) {
      videoRef.current.pause()
    }
  }, [])

  return (
    <div className="flex flex-col gap-3 overflow-hidden max-w-full">
      {/* Main display area */}
      <div
        className="w-full max-w-[350px] sm:max-w-[400px] mx-auto overflow-hidden bg-secondary aspect-square flex items-center justify-center"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {isVideoSelected && video ? (
          <div className="relative h-full w-full flex items-center justify-center">
            <video
              ref={videoRef}
              src={video}
              controls={isVideoPlaying}
              playsInline
              preload="metadata"
              className="h-full w-full object-contain"
              onPlay={() => setIsVideoPlaying(true)}
              onPause={() => setIsVideoPlaying(false)}
              onEnded={() => setIsVideoPlaying(false)}
            />
            {/* Play overlay */}
            {!isVideoPlaying && (
              <button
                type="button"
                onClick={handlePlayVideo}
                className="absolute inset-0 flex items-center justify-center bg-black/20 transition-opacity hover:bg-black/30"
                aria-label="Play video"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 shadow-lg transition-transform hover:scale-110">
                  <Play className="h-7 w-7 text-foreground fill-foreground ml-1" />
                </div>
              </button>
            )}
          </div>
        ) : (
          <Image
            src={images[selectedIndex] || "/placeholder.svg"}
            alt={`${productName} - Image ${selectedIndex + 1}`}
            width={400}
            height={400}
            className="h-full w-full object-contain"
            style={{ width: "auto", height: "auto" }}
            priority
            sizes="(max-width: 350px) 100vw, 400px"
            unoptimized={isExternalImage(images[selectedIndex] || "")}
          />
        )}
      </div>

      {/* Thumbnail strip - swipeable */}
      {totalItems > 1 && (
        <div className="max-w-[350px] sm:max-w-[400px] mx-auto w-full overflow-hidden">
          <div
            className="flex gap-1 overflow-x-auto pb-2"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              WebkitOverflowScrolling: "touch",
            }}
          >
            {/* Image thumbnails */}
            {images.map((image, index) => (
              <button
                type="button"
                key={index}
                onClick={() => handleSelectIndex(index)}
                className={cn(
                  "w-10 h-10 sm:w-12 sm:h-12 min-w-[40px] sm:min-w-[48px] min-h-[40px] sm:min-h-[48px] overflow-hidden bg-secondary transition-all flex-shrink-0",
                  selectedIndex === index ? "ring-1 ring-foreground" : "opacity-60 hover:opacity-100",
                )}
              >
                <Image
                  src={image || "/placeholder.svg"}
                  alt={`${productName} thumbnail ${index + 1}`}
                  width={48}
                  height={48}
                  className="w-full h-full object-cover"
                  style={{ width: "auto", height: "auto" }}
                  sizes="48px"
                  unoptimized={isExternalImage(image)}
                />
              </button>
            ))}

            {/* Video thumbnail */}
            {video && (
              <button
                type="button"
                onClick={() => handleSelectIndex(videoIndex)}
                className={cn(
                  "w-10 h-10 sm:w-12 sm:h-12 min-w-[40px] sm:min-w-[48px] min-h-[40px] sm:min-h-[48px] overflow-hidden bg-foreground/90 transition-all flex-shrink-0 flex items-center justify-center",
                  selectedIndex === videoIndex ? "ring-1 ring-foreground" : "opacity-60 hover:opacity-100",
                )}
                aria-label="Play video"
              >
                <Play className="h-4 w-4 sm:h-5 sm:w-5 text-background fill-background" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
