"use client"

import { useState, useEffect } from "react"
import { Users } from "lucide-react"

export function SalesNotificationToast() {
  const [visible, setVisible] = useState(false)
  const [buyers, setBuyers] = useState(24)

  useEffect(() => {
    // Show first notification after 3 seconds
    const initialTimeout = setTimeout(() => {
      showNotification()
    }, 3000)

    // Then show every 15-25 seconds
    const interval = setInterval(() => {
      showNotification()
    }, Math.random() * 10000 + 15000)

    return () => {
      clearTimeout(initialTimeout)
      clearInterval(interval)
    }
  }, [])

  const showNotification = () => {
    // Generate random number between 10 and 45
    const randomBuyers = Math.floor(Math.random() * 36) + 10
    setBuyers(randomBuyers)
    setVisible(true)

    // Hide after 4 seconds
    setTimeout(() => {
      setVisible(false)
    }, 4000)
  }

  return (
    <div
      className={`fixed bottom-24 left-4 z-[1000] transition-all duration-500 ease-out ${
        visible 
          ? "translate-x-0 opacity-100" 
          : "-translate-x-full opacity-0"
      }`}
    >
      <div className="flex items-center gap-3 bg-white rounded-lg shadow-lg border border-gray-200 px-4 py-3 max-w-[280px]">
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-100 flex-shrink-0">
          <Users className="w-5 h-5 text-green-600" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-gray-900">
            {buyers} personnes
          </span>
          <span className="text-xs text-gray-500">
            viennent d&apos;acheter
          </span>
        </div>
        <span className="relative flex h-2 w-2 ml-auto flex-shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
        </span>
      </div>
    </div>
  )
}
