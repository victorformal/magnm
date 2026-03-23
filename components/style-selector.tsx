"use client"

import { useState } from "react"
import Image from "next/image"
import { Check } from "lucide-react"
import type { ProductStyle } from "@/lib/products"

interface StyleSelectorProps {
  styles: ProductStyle[]
  onStyleChange?: (style: ProductStyle) => void
}

export function StyleSelector({ styles, onStyleChange }: StyleSelectorProps) {
  const [selectedStyle, setSelectedStyle] = useState<ProductStyle>(styles[0])

  const handleStyleSelect = (style: ProductStyle) => {
    setSelectedStyle(style)
    onStyleChange?.(style)
  }

  return (
    <div className="mt-6">
      <div className="flex items-center gap-2">
        <h3 className="text-sm font-semibold uppercase tracking-wider">Style</h3>
        <span className="text-sm text-muted-foreground">: {selectedStyle.name}</span>
      </div>
      <div className="mt-3 flex gap-3">
        {styles.map((style) => (
          <button
            key={style.id}
            onClick={() => handleStyleSelect(style)}
            className={`relative h-20 w-20 overflow-hidden rounded-md border-2 transition-all ${
              selectedStyle.id === style.id
                ? "border-foreground ring-2 ring-foreground ring-offset-2"
                : "border-border hover:border-muted-foreground"
            }`}
            title={style.name}
          >
            <Image src={style.image || "/placeholder.svg"} alt={style.name} fill className="object-cover" sizes="80px" />
            {selectedStyle.id === style.id && (
              <div className="absolute inset-0 flex items-center justify-center bg-foreground/20">
                <Check className="h-5 w-5 text-white drop-shadow-md" />
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
