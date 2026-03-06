"use client"

import { useState } from "react"
import { Check } from "lucide-react"
import Image from "next/image"
import type { ProductColor } from "@/lib/products"

interface ColorSelectorProps {
  colors: ProductColor[]
  onColorChange?: (color: ProductColor) => void
}

export function ColorSelector({ colors, onColorChange }: ColorSelectorProps) {
  const [selectedColor, setSelectedColor] = useState<ProductColor>(colors[0])

  const handleColorSelect = (color: ProductColor) => {
    setSelectedColor(color)
    onColorChange?.(color)
  }

  const hasImages = colors.some((color) => color.image)

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-wider">Color</h3>
        <span className="text-sm text-muted-foreground">{selectedColor.name}</span>
      </div>

      {hasImages ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {colors.map((color) => (
            <button
              key={color.id}
              onClick={() => handleColorSelect(color)}
              className={`group relative overflow-hidden rounded-md transition-all duration-200 ${
                selectedColor.id === color.id
                  ? "ring-2 ring-foreground ring-offset-2 ring-offset-background"
                  : "ring-1 ring-border hover:ring-2 hover:ring-muted-foreground"
              }`}
              title={color.name}
              aria-label={`Select ${color.name}`}
            >
              <div className="relative h-16 w-12 sm:h-20 sm:w-14 overflow-hidden">
                {color.image ? (
                  <Image src={color.image || "/placeholder.svg"} alt={color.name} fill className="object-cover" sizes="56px" />
                ) : (
                  <div className="h-full w-full" style={{ backgroundColor: color.hex }} />
                )}
                {selectedColor.id === color.id && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                    <Check className="h-5 w-5 text-white drop-shadow-md" />
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      ) : (
        // Fallback to color circles
        <div className="mt-3 flex flex-wrap gap-3">
          {colors.map((color) => (
            <button
              key={color.id}
              onClick={() => handleColorSelect(color)}
              className={`group relative h-10 w-10 rounded-full transition-all duration-200 ${
                selectedColor.id === color.id
                  ? "ring-2 ring-foreground ring-offset-2 ring-offset-background"
                  : "hover:ring-2 hover:ring-muted-foreground hover:ring-offset-2 hover:ring-offset-background"
              }`}
              style={{ backgroundColor: color.hex }}
              title={color.name}
              aria-label={`Select ${color.name}`}
            >
              {selectedColor.id === color.id && (
                <Check
                  className={`absolute inset-0 m-auto h-4 w-4 ${
                    color.hex === "#2D2D2D" || color.hex === "#5D4037" ? "text-white" : "text-foreground"
                  }`}
                />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
