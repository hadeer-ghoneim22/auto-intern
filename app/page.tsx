"use client"

import { useState, useEffect } from "react"
import SplashScreen from "@/components/splash-screen"
import LoginScreen from "@/components/login-screen"
import Dashboard from "@/components/dashboard"

export default function Home() {
  const [showSplash, setShowSplash] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState<{ name: string; email: string; avatar: string } | null>(null)

  const handleSplashComplete = () => {
    setShowSplash(false)
  }

  const handleLogin = (userData: { name: string; email: string; avatar: string }) => {
    setUser(userData)
    setIsLoggedIn(true)
  }

  const handleLogout = () => {
    setUser(null)
    setIsLoggedIn(false)
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      handleSplashComplete()
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      {showSplash ? (
        <SplashScreen onComplete={handleSplashComplete} />
      ) : !isLoggedIn ? (
        <LoginScreen onLogin={handleLogin} />
      ) : (
        user && <Dashboard user={user} onLogout={handleLogout} />
      )}
    </div>
  )
}
