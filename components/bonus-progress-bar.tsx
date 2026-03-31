"use client"

import { Gift, Lock, Check } from "lucide-react"
import Image from "next/image"

interface BonusProgressBarProps {
  currentTotal: number
  threshold?: number
  className?: string
}

const LED_KIT_IMAGE = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/LED0101-NcQN4b3GARfX7EQhQSIcnMbQB9NsFa.jpg"
const LED_KIT_PRODUCT_URL = "/product/recessed-led-strip-lighting-fr"

export function BonusProgressBar({ currentTotal, threshold = 100, className = "" }: BonusProgressBarProps) {
  const progress = Math.min((currentTotal / threshold) * 100, 100)
  const isUnlocked = currentTotal >= threshold
  const remaining = Math.max(threshold - currentTotal, 0)

  return (
    <div className={`rounded-xl border-2 ${isUnlocked ? "border-emerald-400 bg-emerald-50" : "border-amber-300 bg-amber-50"} p-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <Gift className={`w-5 h-5 ${isUnlocked ? "text-emerald-600" : "text-amber-600"}`} />
        <span className={`text-sm font-semibold ${isUnlocked ? "text-emerald-800" : "text-amber-800"}`}>
          {isUnlocked ? "Bonus Debloque !" : "Debloquez votre cadeau"}
        </span>
        {isUnlocked && (
          <span className="ml-auto text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded font-medium">
            GRATUIT
          </span>
        )}
      </div>

      {/* Bonus Item Preview */}
      <div className="flex items-center gap-3 mb-4">
        <a 
          href={LED_KIT_PRODUCT_URL} 
          target="_blank" 
          rel="noopener noreferrer" 
          className={`relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 border ${isUnlocked ? "border-emerald-200 bg-white" : "border-amber-200 bg-white/50 opacity-70"}`}
        >
          <Image
            src={LED_KIT_IMAGE}
            alt="Kit Ruban LED Encastre"
            fill
            className="object-cover"
            unoptimized
          />
          {!isUnlocked && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
              <Lock className="w-4 h-4 text-white" />
            </div>
          )}
        </a>
        <div className="flex-1 min-w-0">
          <a
            href={LED_KIT_PRODUCT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={`text-sm font-medium leading-tight ${isUnlocked ? "text-emerald-800" : "text-amber-900"} hover:underline`}
          >
            Kit Ruban LED Encastre
          </a>
          <p className={`text-xs mt-0.5 ${isUnlocked ? "text-emerald-700" : "text-amber-700"}`}>
            Valeur : <span className="line-through">€49,00</span> {isUnlocked && <span className="text-emerald-600 font-semibold">OFFERT</span>}
          </p>
        </div>
        {isUnlocked ? (
          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500 flex-shrink-0">
            <Check className="w-4 h-4 text-white" />
          </div>
        ) : (
          <div className="flex-shrink-0">
            <span className="text-xs font-semibold text-amber-700 bg-amber-100 px-2 py-1 rounded">
              -€{remaining.toFixed(0)}
            </span>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="relative">
        <div className={`h-3 w-full rounded-full overflow-hidden ${isUnlocked ? "bg-emerald-200" : "bg-amber-200"}`}>
          <div 
            className={`h-full rounded-full transition-all duration-500 ease-out ${isUnlocked ? "bg-emerald-500" : "bg-gradient-to-r from-amber-400 to-amber-500"}`}
            style={{ width: `${progress}%` }}
          />
        </div>
        
        {/* Threshold marker */}
        <div className="absolute top-0 right-0 -mt-1">
          <div className={`w-5 h-5 rounded-full border-2 ${isUnlocked ? "bg-emerald-500 border-emerald-300" : "bg-white border-amber-400"} flex items-center justify-center`}>
            {isUnlocked ? (
              <Check className="w-3 h-3 text-white" />
            ) : (
              <Gift className="w-3 h-3 text-amber-500" />
            )}
          </div>
        </div>
      </div>

      {/* Progress Text */}
      <div className="flex justify-between items-center mt-2">
        <span className={`text-xs font-medium ${isUnlocked ? "text-emerald-700" : "text-amber-700"}`}>
          €{currentTotal.toFixed(2)}
        </span>
        <span className={`text-xs ${isUnlocked ? "text-emerald-600" : "text-amber-600"}`}>
          {isUnlocked 
            ? "Cadeau ajoute a votre commande !"
            : `Plus que €${remaining.toFixed(2)} pour debloquer`
          }
        </span>
        <span className={`text-xs font-medium ${isUnlocked ? "text-emerald-700" : "text-amber-700"}`}>
          €{threshold.toFixed(2)}
        </span>
      </div>
    </div>
  )
}
