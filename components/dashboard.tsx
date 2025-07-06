"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Settings,
  LogOut,
  Linkedin,
  PenTool,
  Activity,
  MessageSquare,
  ChevronRight,
  Bell,
  ArrowLeft,
  Send,
  Mic,
  Bot,
  User,
  Sparkles,
  CheckCircle,
  Clock,
  SendIcon,
  XCircle,
} from "lucide-react"

import OpportunitiesScreen from "./opportunities-screen"
import ApplicationScreen from "./application-screen"
import TrackingScreen from "./tracking-screen"
import { auth, tokenManager } from "@/lib/api"

interface DashboardProps {
  user: { name: string; email: string; avatar: string }
  onLogout: () => void
  setUser: React.Dispatch<React.SetStateAction<any>>
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>
}

interface Message {
  id: string
  content: string
  sender: "user" | "ai"
  timestamp: Date
}

interface Application {
  id: number
  company: string
  position: string
  appliedDate: string
  status: "Submitted" | "Under Review" | "Accepted" | "Rejected"
  logo: string
}

interface Internship {
  id: number
  title: string
  company: string
  location: string
  description: string
  url: string
  created_at: string
}

export default function Dashboard({ user, onLogout, setUser, setIsLoggedIn }: DashboardProps) {
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content:
        "Hello! I'm your AI career assistant. I'm here to help you with internship applications, CV improvements, interview preparation, and any career-related questions. How can I assist you today?",
      sender: "ai",
      timestamp: new Date(),
    },
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [statusFilter, setStatusFilter] = useState("All")
  const [sortBy, setSortBy] = useState("Date")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [internshipList, setInternshipList] = useState<Internship[]>([])
  const [userApplications, setUserApplications] = useState<Application[]>([
    {
      id: 1,
      company: "Google",
      position: "Software Engineering Intern",
      appliedDate: "December 15, 2024",
      status: "Under Review",
      logo: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 2,
      company: "Microsoft",
      position: "Data Science Intern",
      appliedDate: "December 10, 2024",
      status: "Submitted",
      logo: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 3,
      company: "Apple",
      position: "UX Design Intern",
      appliedDate: "December 8, 2024",
      status: "Accepted",
      logo: "/placeholder.svg?height=40&width=40",
    },
  ])

  const features = [
    {
      id: "opportunities",
      title: "Identify Opportunities",
      subtitle: "LinkedIn Integration",
      icon: Linkedin,
      bgColor: "bg-blue-100",
      iconColor: "text-blue-600",
      description: "Discover internship opportunities tailored to your profile",
    },
    {
      id: "application",
      title: "Write Application",
      subtitle: "AI-Powered Writing",
      icon: PenTool,
      bgColor: "bg-green-100",
      iconColor: "text-green-600",
      description: "Generate personalized cover letters and applications",
    },
    {
      id: "tracking",
      title: "Track Application Status",
      subtitle: "Monitor Progress",
      icon: Activity,
      bgColor: "bg-orange-100",
      iconColor: "text-orange-600",
      description: "Keep track of all your application statuses in one place",
    },
    {
      id: "assistant",
      title: "AI Assistant",
      subtitle: "Get Help Anytime",
      icon: MessageSquare,
      bgColor: "bg-purple-100",
      iconColor: "text-purple-600",
      description: "Chat with AI for career guidance and interview tips",
    },
  ]

  const suggestedPrompts = [
    "How do I improve my CV?",
    "What are the best internships for me?",
    "Can you write a cover letter for Google?",
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Accepted":
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case "Under Review":
        return <Clock className="w-5 h-5 text-yellow-600" />
      case "Submitted":
        return <SendIcon className="w-5 h-5 text-blue-600" />
      case "Rejected":
        return <XCircle className="w-5 h-5 text-red-600" />
      default:
        return <Clock className="w-5 h-5 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Accepted":
        return "bg-green-100 text-green-800 border-green-200"
      case "Under Review":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "Submitted":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "Rejected":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const filteredApplications = userApplications.filter((app) => {
    if (statusFilter === "All") return true
    return app.status === statusFilter
  })

  const sortedApplications = [...filteredApplications].sort((a, b) => {
    if (sortBy === "Date") {
      return new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime()
    } else {
      return a.company.localeCompare(b.company)
    }
  })

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    if (selectedFeature === "assistant") {
      scrollToBottom()
    }
  }, [messages, selectedFeature])

  useEffect(() => {
    const token = tokenManager.getToken()
    if (token && tokenManager.isTokenValid(token)) {
      // Token is valid, user can stay logged in
      // You might want to fetch user data here
    } else if (token) {
      // Token exists but is invalid, try to refresh
      auth
        .refreshToken()
        .then((response) => {
          tokenManager.setToken(response.token)
        })
        .catch(() => {
          // Refresh failed, logout user
          handleLogout()
        })
    }
  }, [])

  const generateAIResponse = (userMessage: string): string => {
    const responses = {
      cv: "Here are some tips to improve your CV:\n\n1. **Keep it concise** - Aim for 1-2 pages maximum\n2. **Use action verbs** - Start bullet points with words like 'Developed', 'Led', 'Implemented'\n3. **Quantify achievements** - Include numbers and metrics where possible\n4. **Tailor for each role** - Customize your CV for specific internships\n5. **Include relevant projects** - Showcase personal or academic projects\n\nWould you like me to help you with any specific section?",

      cover:
        "I'd be happy to help you write a cover letter! Here's a structure that works well:\n\n**Paragraph 1:** Hook + Position\n**Paragraph 2:** Your relevant experience/skills\n**Paragraph 3:** Why this company specifically\n**Paragraph 4:** Call to action\n\nTo write a personalized cover letter, I'll need:\n- The company name\n- The position title\n- Your relevant experience\n- Why you're interested in this role\n\nCan you provide these details?",

      interview:
        "Great question! Here's how to prepare for interviews:\n\n**Technical Preparation:**\n- Review fundamental concepts in your field\n- Practice coding problems (if applicable)\n- Prepare examples using the STAR method\n\n**Research:**\n- Study the company's mission and values\n- Know recent news about the company\n- Understand the role requirements\n\n**Common Questions:**\n- 'Tell me about yourself'\n- 'Why do you want this internship?'\n- 'What are your strengths/weaknesses?'\n\nWould you like me to help you practice answers to any of these?",

      default:
        "That's a great question! I'm here to help you with all aspects of your internship journey. Whether you need help with:\n\n• **CV and Resume** optimization\n• **Cover Letter** writing\n• **Interview** preparation\n• **Company research** and applications\n• **Skill development** recommendations\n• **Networking** strategies\n\nFeel free to ask me anything specific, and I'll provide detailed, actionable advice tailored to your needs!",
    }

    const message = userMessage.toLowerCase()
    if (message.includes("cv") || message.includes("resume")) return responses.cv
    if (message.includes("cover letter") || message.includes("google")) return responses.cover
    if (message.includes("interview") || message.includes("prepare")) return responses.interview
    return responses.default
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")
    setIsTyping(true)

    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: generateAIResponse(inputMessage),
        sender: "ai",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiResponse])
      setIsTyping(false)
    }, 1500)
  }

  const handleSuggestedPrompt = (prompt: string) => {
    setInputMessage(prompt)
    inputRef.current?.focus()
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleLogout = async () => {
    try {
      await auth.logout()
    } catch (error) {
      console.error("Logout failed:", error)
    } finally {
      setUser(null)
      setIsLoggedIn(false)
    }
  }

  // Render specific screens based on selected feature
  if (selectedFeature === "opportunities") {
    return <OpportunitiesScreen onBack={() => setSelectedFeature(null)} />
  }

  if (selectedFeature === "application") {
    return <ApplicationScreen onBack={() => setSelectedFeature(null)} />
  }

  if (selectedFeature === "tracking") {
    return <TrackingScreen onBack={() => setSelectedFeature(null)} />
  }

  // AI Assistant Screen
  if (selectedFeature === "assistant") {
    return (
      <div className="max-w-md mx-auto bg-white min-h-screen shadow-xl flex flex-col">
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-4 py-6 shadow-lg">
          <div className="flex items-center mb-4">
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-purple-500 p-2 mr-2"
              onClick={() => setSelectedFeature(null)}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold font-arabic-english">AI Assistant</h1>
                <div className="flex items-center text-purple-100 text-sm">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                  <span className="font-arabic-english">Online</span>
                </div>
              </div>
            </div>
          </div>
          <p className="text-purple-100 text-sm font-arabic-english leading-relaxed">
            Ask anything about internships, your CV, or how to apply — the AI is here to help!
          </p>
        </div>

        {/* Suggested Prompts */}
        <div className="p-4 bg-gray-50 border-b">
          <div className="flex items-center mb-3">
            <Sparkles className="w-4 h-4 text-purple-600 mr-2" />
            <span className="text-sm font-medium text-gray-700 font-arabic-english">Quick suggestions:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {suggestedPrompts.slice(0, 3).map((prompt, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => handleSuggestedPrompt(prompt)}
                className="text-xs bg-white hover:bg-purple-50 border-purple-200 text-purple-700 rounded-full px-3 py-1 h-auto"
              >
                <span className="font-arabic-english">{prompt}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"} animate-fade-in`}
            >
              <div
                className={`flex items-end space-x-2 max-w-[80%] ${message.sender === "user" ? "flex-row-reverse space-x-reverse" : ""}`}
              >
                <Avatar className="w-8 h-8 flex-shrink-0">
                  <AvatarFallback
                    className={message.sender === "user" ? "bg-purple-600 text-white" : "bg-gray-200 text-gray-600"}
                  >
                    {message.sender === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </AvatarFallback>
                </Avatar>
                <div
                  className={`rounded-2xl px-4 py-3 shadow-sm ${
                    message.sender === "user"
                      ? "bg-purple-600 text-white rounded-br-md"
                      : "bg-white text-gray-800 rounded-bl-md border"
                  }`}
                >
                  <p className="text-sm font-arabic-english leading-relaxed whitespace-pre-line">{message.content}</p>
                  <p className={`text-xs mt-2 ${message.sender === "user" ? "text-purple-100" : "text-gray-500"}`}>
                    {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex justify-start animate-fade-in">
              <div className="flex items-end space-x-2 max-w-[80%]">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-gray-200 text-gray-600">
                    <Bot className="w-4 h-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-white rounded-2xl rounded-bl-md px-4 py-3 shadow-sm border">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="bg-white border-t border-gray-200 p-4">
          <div className="flex items-center space-x-2">
            <div className="flex-1 relative">
              <Input
                ref={inputRef}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your question here…"
                className="pr-12 rounded-full border-gray-300 focus:border-purple-500 focus:ring-purple-500 font-arabic-english"
                disabled={isTyping}
              />
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 p-2"
              >
                <Mic className="w-4 h-4" />
              </Button>
            </div>
            <Button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isTyping}
              className="bg-purple-600 hover:bg-purple-700 text-white rounded-full p-3 shadow-lg"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center font-arabic-english">
            AI responses are generated for demonstration. Always verify important information.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-white p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="w-12 h-12 border-2 border-white">
              <AvatarImage src={user.avatar || "/placeholder.svg"} />
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-bold font-arabic-english">Hi, {user.name}!</h2>
              <p className="text-blue-100 text-sm font-arabic-english">Welcome to AutoIntern.AI</p>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white hover:bg-blue-500">
                <Settings className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem className="font-arabic-english">
                <Bell className="w-4 h-4 mr-2" /> Notifications
              </DropdownMenuItem>
              <DropdownMenuItem className="font-arabic-english" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" /> Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Feature Cards */}
        <div className="p-6 space-y-4">
          {features.map((feature) => (
            <Card
              key={feature.id}
              className="shadow-md border-0 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => setSelectedFeature(feature.id)}
            >
              <CardContent className="p-4 flex items-center space-x-4">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center ${feature.bgColor} flex-shrink-0`}
                >
                  <feature.icon className={`w-6 h-6 ${feature.iconColor}`} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800 font-arabic-english">{feature.title}</h3>
                  <p className="text-sm text-gray-600 font-arabic-english">{feature.description}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-500" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
