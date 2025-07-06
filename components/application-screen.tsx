"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { ArrowLeft, PenTool, FileText, Sparkles, Download } from "lucide-react"

interface ApplicationScreenProps {
  onBack: () => void
}

export default function ApplicationScreen({ onBack }: ApplicationScreenProps) {
  const [formData, setFormData] = useState({
    company: "",
    position: "",
    experience: "",
    motivation: "",
  })
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedLetter, setGeneratedLetter] = useState("")

  const handleGenerate = async () => {
    setIsGenerating(true)
    // Simulate AI generation
    setTimeout(() => {
      setGeneratedLetter(`Dear Hiring Manager,

I am writing to express my strong interest in the ${formData.position || "Software Engineering Intern"} position at ${formData.company || "your company"}. As a passionate computer science student with hands-on experience in modern technologies, I am excited about the opportunity to contribute to your team.

${formData.experience || "Throughout my academic journey, I have developed strong programming skills in Python, JavaScript, and React. I have completed several projects that demonstrate my ability to solve complex problems and work with cutting-edge technologies."}

${formData.motivation || "What particularly attracts me to this role is the opportunity to work with innovative technologies and contribute to meaningful projects. I am eager to bring my technical skills, creativity, and enthusiasm to your team."}

I would welcome the opportunity to discuss how my background and passion for technology can contribute to your team's success. Thank you for considering my application.

Best regards,
[Your Name]`)
      setIsGenerating(false)
    }, 2000)
  }

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen shadow-xl">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white px-4 py-6">
        <div className="flex items-center mb-4">
          <Button variant="ghost" size="sm" className="text-white hover:bg-green-500 p-2 mr-2" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <PenTool className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold font-arabic-english">Write Application</h1>
              <p className="text-green-100 text-sm font-arabic-english">AI-Powered Writing</p>
            </div>
          </div>
        </div>
        <p className="text-green-100 text-sm font-arabic-english">
          Generate personalized cover letters and applications with AI assistance
        </p>
      </div>

      <div className="p-4 space-y-6">
        {!generatedLetter ? (
          <>
            {/* Input Form */}
            <Card className="shadow-md border-0">
              <CardHeader>
                <CardTitle className="flex items-center text-lg font-arabic-english">
                  <FileText className="w-5 h-5 mr-2" />
                  Application Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="company" className="font-arabic-english">
                    Company Name
                  </Label>
                  <Input
                    id="company"
                    placeholder="e.g., Google, Microsoft, Apple"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="font-arabic-english"
                  />
                </div>

                <div>
                  <Label htmlFor="position" className="font-arabic-english">
                    Position Title
                  </Label>
                  <Input
                    id="position"
                    placeholder="e.g., Software Engineering Intern"
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    className="font-arabic-english"
                  />
                </div>

                <div>
                  <Label htmlFor="experience" className="font-arabic-english">
                    Your Relevant Experience
                  </Label>
                  <Textarea
                    id="experience"
                    placeholder="Describe your relevant skills, projects, and experience..."
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                    className="font-arabic-english"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="motivation" className="font-arabic-english">
                    Why This Role?
                  </Label>
                  <Textarea
                    id="motivation"
                    placeholder="Why are you interested in this position and company?"
                    value={formData.motivation}
                    onChange={(e) => setFormData({ ...formData, motivation: e.target.value })}
                    className="font-arabic-english"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Generate Button */}
            <Button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full bg-green-600 hover:bg-green-700 text-white h-12"
            >
              {isGenerating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  <span className="font-arabic-english">Generating...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  <span className="font-arabic-english">Generate Cover Letter</span>
                </>
              )}
            </Button>
          </>
        ) : (
          <>
            {/* Generated Letter */}
            <Card className="shadow-md border-0">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="font-arabic-english">Generated Cover Letter</span>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-1" />
                    <span className="font-arabic-english">Download</span>
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 rounded-lg p-4 whitespace-pre-line text-sm font-arabic-english leading-relaxed">
                  {generatedLetter}
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button onClick={() => setGeneratedLetter("")} variant="outline" className="w-full">
                <span className="font-arabic-english">Generate New Letter</span>
              </Button>
              <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                <span className="font-arabic-english">Use This Letter</span>
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
