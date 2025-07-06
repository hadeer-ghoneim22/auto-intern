"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Search, MapPin, Building, Clock, ExternalLink, Linkedin } from "lucide-react"

interface OpportunitiesScreenProps {
  onBack: () => void
}

export default function OpportunitiesScreen({ onBack }: OpportunitiesScreenProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const opportunities = [
    {
      id: 1,
      title: "Software Engineering Intern",
      company: "Google",
      location: "Mountain View, CA",
      type: "Full-time",
      duration: "3 months",
      posted: "2 days ago",
      skills: ["Python", "JavaScript", "React"],
      description: "Join our team to work on cutting-edge projects...",
    },
    {
      id: 2,
      title: "Data Science Intern",
      company: "Microsoft",
      location: "Seattle, WA",
      type: "Remote",
      duration: "6 months",
      posted: "1 week ago",
      skills: ["Python", "Machine Learning", "SQL"],
      description: "Analyze large datasets and build ML models...",
    },
    {
      id: 3,
      title: "UX Design Intern",
      company: "Apple",
      location: "Cupertino, CA",
      type: "Hybrid",
      duration: "4 months",
      posted: "3 days ago",
      skills: ["Figma", "Sketch", "User Research"],
      description: "Design intuitive user experiences for our products...",
    },
  ]

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen shadow-xl">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-6">
        <div className="flex items-center mb-4">
          <Button variant="ghost" size="sm" className="text-white hover:bg-blue-500 p-2 mr-2" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <Linkedin className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold font-arabic-english">Identify Opportunities</h1>
              <p className="text-blue-100 text-sm font-arabic-english">LinkedIn Integration</p>
            </div>
          </div>
        </div>
        <p className="text-blue-100 text-sm font-arabic-english">
          Discover internship opportunities tailored to your profile and interests
        </p>
      </div>

      {/* Search */}
      <div className="p-4 bg-gray-50 border-b">
        <div className="relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search internships..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 font-arabic-english"
          />
        </div>
      </div>

      {/* Opportunities List */}
      <div className="p-4 space-y-4 overflow-y-auto">
        {opportunities.map((opportunity) => (
          <Card key={opportunity.id} className="shadow-md border-0 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-lg font-arabic-english">{opportunity.title}</CardTitle>
                  <div className="flex items-center text-gray-600 mt-1">
                    <Building className="w-4 h-4 mr-1" />
                    <span className="font-arabic-english">{opportunity.company}</span>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span className="font-arabic-english">{opportunity.location}</span>
                  <span className="mx-2">•</span>
                  <span className="font-arabic-english">{opportunity.type}</span>
                </div>

                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="w-4 h-4 mr-2" />
                  <span className="font-arabic-english">{opportunity.duration}</span>
                  <span className="mx-2">•</span>
                  <span className="font-arabic-english">Posted {opportunity.posted}</span>
                </div>

                <p className="text-sm text-gray-700 font-arabic-english">{opportunity.description}</p>

                <div className="flex flex-wrap gap-2">
                  {opportunity.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>

                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                  <span className="font-arabic-english">Apply Now</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
