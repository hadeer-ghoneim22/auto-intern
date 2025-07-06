"use client"

import { useEffect } from "react"
import { FileText, Cpu } from "lucide-react"

interface SplashScreenProps {
  onComplete: () => void
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete()
    }, 2500)

    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-blue-500 to-blue-400 px-4">
      <div className="text-center animate-fade-in">
        <div className="flex items-center justify-center mb-6">
          <div className="relative">
            <div className="w-20 h-20 bg-yellow-400 rounded-2xl flex items-center justify-center shadow-lg">
              <FileText className="w-10 h-10 text-gray-800" />
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center">
                <Cpu className="w-4 h-4 text-yellow-400" />
              </div>
            </div>
          </div>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 font-arabic-english">AutoIntern.AI</h1>
        <p className="text-blue-100 text-lg font-arabic-english">Your AI-Powered Internship Assistant</p>
        <div className="mt-8">
          <div className="w-12 h-1 bg-white/30 rounded-full mx-auto animate-pulse"></div>
        </div>
      </div>
    </div>
  )
}
