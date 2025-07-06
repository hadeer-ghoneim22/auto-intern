"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Activity, Plus, Calendar, Building, Clock } from "lucide-react"

interface TrackingScreenProps {
  onBack: () => void
}

export default function TrackingScreen({ onBack }: TrackingScreenProps) {
  const [applications] = useState([
    {
      id: 1,
      company: "Google",
      position: "Software Engineering Intern",
      appliedDate: "2024-01-15",
      status: "Interview Scheduled",
      statusColor: "bg-blue-500",
      nextStep: "Technical Interview on Jan 25",
      progress: 75,
    },
    {
      id: 2,
      company: "Microsoft",
      position: "Data Science Intern",
      appliedDate: "2024-01-10",
      status: "Under Review",
      statusColor: "bg-yellow-500",
      nextStep: "Waiting for response",
      progress: 50,
    },
    {
      id: 3,
      company: "Apple",
      position: "UX Design Intern",
      appliedDate: "2024-01-08",
      status: "Rejected",
      statusColor: "bg-red-500",
      nextStep: "Application closed",
      progress: 100,
    },
    {
      id: 4,
      company: "Meta",
      position: "Frontend Developer Intern",
      appliedDate: "2024-01-20",
      status: "Applied",
      statusColor: "bg-gray-500",
      nextStep: "Application submitted",
      progress: 25,
    },
  ])

  const getStatusStats = () => {
    const stats = applications.reduce(
      (acc, app) => {
        acc[app.status] = (acc[app.status] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    return {
      total: applications.length,
      pending: stats["Under Review"] || 0,
      interviews: stats["Interview Scheduled"] || 0,
      rejected: stats["Rejected"] || 0,
    }
  }

  const stats = getStatusStats()

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen shadow-xl">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 to-orange-700 text-white px-4 py-6">
        <div className="flex items-center mb-4">
          <Button variant="ghost" size="sm" className="text-white hover:bg-orange-500 p-2 mr-2" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold font-arabic-english">Track Applications</h1>
              <p className="text-orange-100 text-sm font-arabic-english">Monitor Progress</p>
            </div>
          </div>
        </div>
        <p className="text-orange-100 text-sm font-arabic-english">
          Keep track of all your application statuses in one place
        </p>
      </div>

      <div className="p-4 space-y-6">
        {/* Stats Overview */}
        <Card className="shadow-md border-0 bg-gradient-to-r from-orange-50 to-yellow-50">
          <CardHeader>
            <CardTitle className="text-lg font-arabic-english">Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{stats.total}</div>
                <div className="text-sm text-gray-600 font-arabic-english">Total Applications</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.interviews}</div>
                <div className="text-sm text-gray-600 font-arabic-english">Interviews</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
                <div className="text-sm text-gray-600 font-arabic-english">Under Review</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
                <div className="text-sm text-gray-600 font-arabic-english">Rejected</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Add New Application */}
        <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white">
          <Plus className="w-4 h-4 mr-2" />
          <span className="font-arabic-english">Add New Application</span>
        </Button>

        {/* Applications List */}
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-800 font-arabic-english">Recent Applications</h3>
          {applications.map((app) => (
            <Card key={app.id} className="shadow-md border-0 hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800 font-arabic-english">{app.position}</h4>
                      <div className="flex items-center text-gray-600 mt-1">
                        <Building className="w-4 h-4 mr-1" />
                        <span className="font-arabic-english">{app.company}</span>
                      </div>
                    </div>
                    <Badge className={`${app.statusColor} text-white`}>{app.status}</Badge>
                  </div>

                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span className="font-arabic-english">
                      Applied: {new Date(app.appliedDate).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="w-4 h-4 mr-2" />
                    <span className="font-arabic-english">{app.nextStep}</span>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-gray-600">
                      <span className="font-arabic-english">Progress</span>
                      <span>{app.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${app.statusColor}`}
                        style={{ width: `${app.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
