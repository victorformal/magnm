"use client"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { Calculator, ArrowRight, Check } from "lucide-react"
import { useRouter } from "next/navigation"

const PANEL_AREA = 1.68 // m² per panel
const PRICE_PER_PANEL = 34.9 // EUR

const COVERAGE_OPTIONS = [
  { value: 0.25, label: "25%" },
  { value: 0.5, label: "50%" },
  { value: 0.75, label: "75%" },
  { value: 1, label: "Mur entier" },
]

interface CalculatorResult {
  panelsMin: number
  panelsBuffer: number
  areaTotal: string
  priceMin: string
  priceBuffer: string
}

function calculatePanels(width: number, height: number, coverage: number): CalculatorResult {
  const wallArea = width * height
  const targetArea = wallArea * coverage
  const panels = Math.ceil(targetArea / PANEL_AREA)
  const withBuffer = Math.ceil(panels * 1.1) // +10% cutting waste

  return {
    panelsMin: panels,
    panelsBuffer: withBuffer,
    areaTotal: targetArea.toFixed(1),
    priceMin: (panels * PRICE_PER_PANEL).toFixed(0),
    priceBuffer: (withBuffer * PRICE_PER_PANEL).toFixed(0),
  }
}

export function CalculatorSectionFr() {
  const { ref, inView } = useInView({ threshold: 0.2, triggerOnce: true })
  const router = useRouter()

  const [width, setWidth] = useState(3)
  const [height, setHeight] = useState(2.5)
  const [coverage, setCoverage] = useState(1)

  const result = useMemo(() => calculatePanels(width, height, coverage), [width, height, coverage])

  const handleOrder = () => {
    // Navigate to product page with quantity pre-set
    router.push(`/product/panneau-acustique-flexible-fr?qty=${result.panelsBuffer}`)
  }

  return (
    <section ref={ref} id="calculator-section" className="bg-[var(--color-cream)] py-16 lg:py-24 scroll-mt-20">
      <div className="container mx-auto max-w-7xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <span className="text-xs font-medium tracking-[0.15em] uppercase text-[var(--color-wood-mid)] mb-3 block">
            Calculateur
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[var(--color-wood-dark)]">
            Combien de panneaux pour votre projet ?
          </h2>
          <p className="mt-4 text-[var(--color-muted-wood)] max-w-xl mx-auto">
            Entrez les dimensions de votre mur et nous calculons exactement ce dont vous avez besoin.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-2xl mx-auto"
        >
          <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-xl border border-[var(--color-border-wood)]">
            {/* Inputs */}
            <div className="grid sm:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-sm font-medium text-[var(--color-wood-dark)] mb-2">Largeur (m)</label>
                <input
                  type="number"
                  step="0.1"
                  min="0.5"
                  max="20"
                  value={width}
                  onChange={(e) => setWidth(Number.parseFloat(e.target.value) || 0)}
                  className="w-full px-4 py-3 rounded-lg border border-[var(--color-border-wood)] focus:ring-2 focus:ring-[var(--color-cta)] focus:border-transparent text-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--color-wood-dark)] mb-2">Hauteur (m)</label>
                <input
                  type="number"
                  step="0.1"
                  min="0.5"
                  max="10"
                  value={height}
                  onChange={(e) => setHeight(Number.parseFloat(e.target.value) || 0)}
                  className="w-full px-4 py-3 rounded-lg border border-[var(--color-border-wood)] focus:ring-2 focus:ring-[var(--color-cta)] focus:border-transparent text-lg"
                />
              </div>
            </div>

            {/* Coverage */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-[var(--color-wood-dark)] mb-3">Couverture souhaitee</label>
              <div className="grid grid-cols-4 gap-2">
                {COVERAGE_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setCoverage(option.value)}
                    className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      coverage === option.value
                        ? "bg-[var(--color-cta)] text-white"
                        : "bg-[var(--color-cream-dark)] text-[var(--color-wood-dark)] hover:bg-[var(--color-border-wood)]"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Results */}
            <div className="bg-[var(--color-cream)] rounded-xl p-6 mb-6 border border-[var(--color-border-wood)]">
              <div className="flex items-center gap-2 mb-4">
                <Calculator className="h-5 w-5 text-[var(--color-wood-mid)]" />
                <span className="text-sm font-medium text-[var(--color-muted-wood)]">Resultat</span>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-baseline">
                  <span className="text-[var(--color-muted-wood)]">Il vous faut :</span>
                  <span className="text-2xl font-bold text-[var(--color-wood-dark)]">
                    {result.panelsMin} panneaux{" "}
                    <span className="text-base font-normal text-[var(--color-muted-wood)]">
                      (+ {result.panelsBuffer - result.panelsMin} de reserve = {result.panelsBuffer} recommandes)
                    </span>
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--color-muted-wood)]">Surface couverte :</span>
                  <span className="font-semibold text-[var(--color-wood-dark)]">{result.areaTotal} m²</span>
                </div>
                <div className="flex justify-between pt-3 border-t border-[var(--color-border-wood)]">
                  <span className="text-[var(--color-muted-wood)]">Budget estime :</span>
                  <span className="text-xl font-bold text-[var(--color-cta)]">
                    {result.priceMin} - {result.priceBuffer} EUR
                  </span>
                </div>
              </div>
            </div>

            {/* CTA */}
            <button
              type="button"
              onClick={handleOrder}
              className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-lg bg-[var(--color-cta)] hover:bg-[var(--color-cta-hover)] text-white font-medium text-lg transition-colors shadow-lg"
            >
              Commander {result.panelsBuffer} panneaux — {result.priceBuffer} EUR
              <ArrowRight className="h-5 w-5" />
            </button>

            {/* Trust */}
            <div className="flex flex-wrap justify-center gap-4 mt-6 text-xs text-[var(--color-muted-wood)]">
              <span className="flex items-center gap-1">
                <Check className="h-3.5 w-3.5 text-[var(--color-success)]" />
                Livraison gratuite des 199EUR
              </span>
              <span className="flex items-center gap-1">
                <Check className="h-3.5 w-3.5 text-[var(--color-success)]" />
                Retours gratuits 30 jours
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
