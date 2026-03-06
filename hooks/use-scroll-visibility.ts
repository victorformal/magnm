'use client';

import { useEffect, useState } from 'react'

/**
 * Hook que rastreia a posição do scroll e retorna a opacidade/visibilidade
 * do CTA flutuante baseado em quanto o usuário rolou
 * 
 * Começa completamente invisível, aparece gradualmente após 200px de scroll
 */
export function useScrollVisibility() {
  const [scrollY, setScrollY] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      setScrollY(currentScrollY)
      // Mostra o CTA após rolar 200px
      setIsVisible(currentScrollY > 200)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Calcula opacidade baseada no scroll (começa aos 200px, totalmente opaco aos 400px)
  const opacity = Math.min(Math.max((scrollY - 200) / 200, 0), 1)

  return {
    scrollY,
    isVisible,
    opacity,
  }
}
