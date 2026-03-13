"use client"

import { useState, useRef } from "react"
import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import Image from "next/image"
import { GripVertical } from "lucide-react"

export function DemoSectionFr() {
  const { ref, inView } = useInView({ threshold: 0.2, triggerOnce: true })
  const [sliderPos, setSliderPos] = useState(50)
  const containerRef = useRef<HTMLDivElement>(null)
  const isDragging = useRef(false)

  const updateSliderPos = (clientX: number) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = clientX - rect.left
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100))
    setSliderPos(percentage)
  }

  const handleMouseDown = () => {
    isDragging.current = true
  }

  const handleMouseUp = () => {
    isDragging.current = false
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return
    updateSliderPos(e.clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    updateSliderPos(e.touches[0].clientX)
  }

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
            Demonstration
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[var(--color-wood-dark)]">
            La flexibilite en action
          </h2>
          <p className="mt-4 text-[var(--color-muted-wood)] max-w-xl mx-auto">
            Faites glisser le curseur pour voir la difference entre un panneau rigide classique et notre panneau
            flexible.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-4xl mx-auto"
        >
          {/* Before/After Slider */}
          <div
            ref={containerRef}
            className="relative aspect-[16/10] rounded-2xl overflow-hidden cursor-ew-resize select-none shadow-2xl"
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onMouseMove={handleMouseMove}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleMouseUp}
          >
            {/* After image (flexible - full width) */}
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/FAP004-ZDLxcKZNaH78vc8NDClQsY6xZCHYuM.jpg"
              alt="Panneau flexible parfaitement installe sur surface courbe"
              fill
              className="object-cover"
            />

            {/* Before image (rigid - clipped) */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
            >
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/FAP002-fTn7oH4WnVjqFuYJGlXCVQqcgJZV7P.jpg"
                alt="Panneau rigide avec problemes sur surface courbe"
                fill
                className="object-cover"
              />
              {/* Overlay to simulate "problem" */}
              <div className="absolute inset-0 bg-red-900/10" />
            </div>

            {/* Slider handle */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-white shadow-lg z-10"
              style={{ left: `${sliderPos}%`, transform: "translateX(-50%)" }}
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center">
                <GripVertical className="h-5 w-5 text-[var(--color-wood-dark)]" />
              </div>
            </div>

            {/* Labels */}
            <div className="absolute top-4 left-4 bg-red-600 text-white text-xs font-medium px-3 py-1.5 rounded-full">
              Rigide classique
            </div>
            <div className="absolute top-4 right-4 bg-[var(--color-success)] text-white text-xs font-medium px-3 py-1.5 rounded-full">
              Woodbois Flexible
            </div>
          </div>

          <p className="text-center text-sm text-[var(--color-muted-wood)] mt-6">
            Glissez le curseur pour comparer les resultats
          </p>
        </motion.div>
      </div>
    </section>
  )
}
