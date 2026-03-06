"use client"

import { useEffect, useState } from "react"
import { Eye } from "lucide-react"

interface PeopleViewingProps {
  isFrench?: boolean
}

export function PeopleViewing({ isFrench = false }: PeopleViewingProps) {
  const [viewers, setViewers] = useState(18)

  useEffect(() => {
    // Inicial: número aleatório entre 18-45
    setViewers(Math.floor(Math.random() * (45 - 18 + 1)) + 18)

    // Muda o número a cada 3-5 segundos
    const interval = setInterval(() => {
      setViewers(Math.floor(Math.random() * (45 - 18 + 1)) + 18)
    }, Math.random() * 2000 + 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex items-center gap-2 py-3 text-sm text-muted-foreground">
      <Eye className="h-4 w-4 text-accent" />
      <span>
        <span className="font-medium text-foreground">{viewers}</span>{" "}
        {isFrench
          ? "personnes visualisent ce produit en ce moment"
          : "people are viewing this product right now"}
      </span>
    </div>
  )
}
