"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, Lock, Shield, Eye, EyeOff } from "lucide-react"
import { auth, tokenManager } from "@/lib/api"

interface LoginScreenProps {
  onLogin: (user: { name: string; email: string; avatar: string }) => void
}

export default function LoginScreen({ onLogin }: LoginScreenProps) {
  const [showEmailLogin, setShowEmailLogin] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleGoogleLogin = async () => {
    setIsLoading(true)
    try {
      // Check if Google Sign-In is available
      if (typeof window === "undefined" || !window.google) {
        throw new Error("Google Sign-In is not available. Please use email login instead.")
      }

      // For demo purposes, we\'ll simulate a successful Google login
      // In a real app, you would use the Google Sign-In SDK
      const mockGoogleResponse = {
        user_id: 1,
        email: email || "demo@google.com",
        token: "demo_google_token_" + Date.now(),
      }

      tokenManager.setToken(mockGoogleResponse.token)
      onLogin({
        name: mockGoogleResponse.email.split("@")[0],
        email: mockGoogleResponse.email,
        avatar: "/placeholder.svg?height=40&width=40",
      })
    } catch (error) {
      console.error("Google login failed:", error)
      // Show user-friendly error message
      alert("Google Sign-In is currently unavailable. Please try signing in with email instead.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (email && password) {
      setIsLoading(true)
      try {
        const response = await auth.login(email, password)
        tokenManager.setToken(response.token)
        onLogin({
          name: response.email.split("@")[0],
          email: response.email,
          avatar: "/placeholder.svg?height=40&width=40",
        })
      } catch (error) {
        console.error("Email login failed:", error)
        alert((error as Error).message)
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    if (email && password) {
      setIsLoading(true)
      try {
        const response = await auth.signup(email, password)
        tokenManager.setToken(response.token)
        onLogin({
          name: response.email.split("@")[0],
          email: response.email,
          avatar: "/placeholder.svg?height=40&width=40",
        })
      } catch (error) {
        console.error("Signup failed:", error)
        alert((error as Error).message)
      } finally {
        setIsLoading(false)
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4 shadow-lg">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2 font-arabic-english">AutoIntern.AI</h1>
          <p className="text-gray-600 font-arabic-english">Your AI-Powered Career Assistant</p>
        </div>

        <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl font-bold text-gray-900 font-arabic-english">
              {isSignUp ? "Sign Up" : "Login"}
            </CardTitle>
            <p className="text-gray-600 font-arabic-english">
              {isSignUp ? "Create your account to get started" : "Welcome back! Please sign in to continue"}
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {!showEmailLogin ? (
              <>
                <Button
                  onClick={handleGoogleLogin}
                  disabled={isLoading}
                  className="w-full h-12 bg-white hover:bg-gray-50 text-gray-700 border-2 border-gray-200 hover:border-gray-300 shadow-sm transition-all duration-200"
                  variant="outline"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-3" />
                  ) : (
                    <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                  )}
                  <span className="font-medium font-arabic-english">
                    {isLoading ? "Signing in..." : "Continue with Google (Demo)"}
                  </span>
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500 font-arabic-english">or</span>
                  </div>
                </div>

                <Button
                  onClick={() => setShowEmailLogin(true)}
                  variant="outline"
                  className="w-full h-12 border-2 border-blue-200 hover:border-blue-300 text-blue-700 hover:bg-blue-50 transition-all duration-200"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  <span className="font-medium font-arabic-english">Sign in with Email</span>
                </Button>
              </>
            ) : (
              <form onSubmit={isSignUp ? handleSignup : handleEmailLogin} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 font-arabic-english">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 h-12 border-2 border-gray-200 focus:border-blue-500 rounded-xl transition-all duration-200"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 font-arabic-english">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10 h-12 border-2 border-gray-200 focus:border-blue-500 rounded-xl transition-all duration-200"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <div className="flex items-center text-xs text-gray-500 mt-1">
                    <Shield className="w-3 h-3 mr-1" />
                    <span className="font-arabic-english">Your data is encrypted and secure</span>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      <span className="font-arabic-english">{isSignUp ? "Creating account..." : "Signing in..."}</span>
                    </>
                  ) : (
                    <span className="font-arabic-english">{isSignUp ? "Create Account" : "Sign In Securely"}</span>
                  )}
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setShowEmailLogin(false)}
                  className="w-full font-arabic-english"
                >
                  ← Back to Google Sign In
                </Button>

                <div className="text-center pt-2">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setIsSignUp(!isSignUp)}
                    className="text-sm text-blue-600 hover:text-blue-700 font-arabic-english"
                  >
                    {isSignUp ? "Already have an account? Sign In" : "Don\'t have an account? Sign Up"}
                  </Button>
                </div>
              </form>
            )}

            <div className="text-center pt-4 border-t border-gray-100">
              <div className="flex items-center justify-center text-xs text-gray-500">
                <Shield className="w-3 h-3 mr-1" />
                <span className="font-arabic-english">Protected by enterprise-grade security</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
