"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
  ScatterChart,
  Scatter,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts"
import {
  MessageSquare,
  Users,
  Brain,
  AlertTriangle,
  MapPin,
  Clock,
  Filter,
  Download,
  RefreshCw,
  Zap,
  Target,
} from "lucide-react"
import { useRealTimeData } from "@/hooks/use-real-time-data"
import { useState, useMemo } from "react"

interface CommunicationAnalysisProps {
  detailed?: boolean
}

export function CommunicationAnalysis({ detailed = false }: CommunicationAnalysisProps) {
  const { data: commData, loading } = useRealTimeData<any>({
    endpoint: "/api/communication-analysis",
    interval: 10000, // Faster updates for real-time feel
  })

  const [selectedTimeRange, setSelectedTimeRange] = useState("1h")
  const [selectedSource, setSelectedSource] = useState("all")

  const communications = commData?.data?.communications || []
  const trendingTopics = commData?.data?.trendingTopics || []
  const sentimentDistribution = commData?.data?.sentimentDistribution || { positive: 0, negative: 0, neutral: 0 }

  const enhancedAnalytics = useMemo(() => {
    const emotionData = [
      { emotion: "Fear", value: Math.floor(Math.random() * 30) + 20, color: "#ef4444" },
      { emotion: "Anger", value: Math.floor(Math.random() * 25) + 15, color: "#f97316" },
      { emotion: "Anxiety", value: Math.floor(Math.random() * 35) + 25, color: "#eab308" },
      { emotion: "Hope", value: Math.floor(Math.random() * 20) + 10, color: "#22c55e" },
      { emotion: "Confusion", value: Math.floor(Math.random() * 15) + 5, color: "#8b5cf6" },
    ]

    const threatLevels = [
      { level: "Critical", count: communications.filter((c) => c.urgency === "critical").length, color: "#dc2626" },
      { level: "High", count: communications.filter((c) => c.urgency === "high").length, color: "#ea580c" },
      { level: "Medium", count: communications.filter((c) => c.urgency === "medium").length, color: "#ca8a04" },
      { level: "Low", count: communications.filter((c) => c.urgency === "low").length, color: "#16a34a" },
    ]

    const timeSeriesData = Array.from({ length: 24 }, (_, i) => ({
      hour: `${i}:00`,
      messages: Math.floor(Math.random() * 50) + 10,
      urgentMessages: Math.floor(Math.random() * 15) + 2,
      sentiment: Math.random() * 2 - 1, // -1 to 1 scale
    }))

    const geographicClusters = [
      { area: "Downtown", messages: 45, avgUrgency: 0.7, coordinates: [40.7128, -74.006] },
      { area: "Industrial", messages: 32, avgUrgency: 0.9, coordinates: [40.7589, -73.9851] },
      { area: "Residential", messages: 28, avgUrgency: 0.3, coordinates: [40.6782, -73.9442] },
      { area: "Waterfront", messages: 15, avgUrgency: 0.4, coordinates: [40.7505, -74.0134] },
    ]

    return { emotionData, threatLevels, timeSeriesData, geographicClusters }
  }, [communications])

  const sentimentData = [
    { category: "Positive", value: sentimentDistribution.positive, color: "hsl(var(--chart-1))" },
    { category: "Neutral", value: sentimentDistribution.neutral, color: "hsl(var(--chart-5))" },
    { category: "Negative", value: sentimentDistribution.negative, color: "hsl(var(--chart-2))" },
  ]

  const urgentMessages = communications.filter((comm: any) => comm.urgency === "critical" || comm.urgency === "high")
  const totalMessages = communications.length
  const urgentPercentage = totalMessages > 0 ? Math.round((urgentMessages.length / totalMessages) * 100) : 0

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="flex items-center gap-2">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          <span className="text-sm text-muted-foreground">Analyzing communications...</span>
        </div>
      </div>
    )
  }

  if (!detailed) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{totalMessages}</div>
            <div className="text-sm text-muted-foreground">Total Messages</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{urgentPercentage}%</div>
            <div className="text-sm text-muted-foreground">Urgent Content</div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Sentiment Analysis</span>
            <span>{Math.round((sentimentDistribution.negative / totalMessages) * 100) || 0}% Negative</span>
          </div>
          <Progress value={(sentimentDistribution.negative / totalMessages) * 100 || 0} className="h-2" />
        </div>

        <div className="space-y-2">
          {trendingTopics.slice(0, 3).map((topic: any, index: number) => (
            <div key={index} className="flex items-center justify-between text-sm">
              <span>{topic.topic}</span>
              <Badge variant="outline">{topic.count}</Badge>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">AI Communication Analysis</h2>
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <Zap className="h-3 w-3 mr-1" />
            Live Analysis
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-1" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-1" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Messages</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalMessages}</div>
            <p className="text-xs text-muted-foreground">+12% from last hour</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Confidence</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94%</div>
            <p className="text-xs text-muted-foreground">Analysis accuracy</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Threat Level</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${urgentPercentage > 50 ? "text-destructive" : "text-primary"}`}>
              {urgentPercentage > 50 ? "High" : "Moderate"}
            </div>
            <p className="text-xs text-muted-foreground">{urgentPercentage}% urgent</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Sources</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{new Set(communications.map((c: any) => c.source)).size}</div>
            <p className="text-xs text-muted-foreground">Data streams</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hotspots</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{enhancedAnalytics.geographicClusters.length}</div>
            <p className="text-xs text-muted-foreground">Geographic clusters</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Processing Rate</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.3s</div>
            <p className="text-xs text-muted-foreground">Avg response time</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="sentiment">Sentiment & Emotion</TabsTrigger>
          <TabsTrigger value="threats">Threat Analysis</TabsTrigger>
          <TabsTrigger value="geographic">Geographic</TabsTrigger>
          <TabsTrigger value="temporal">Temporal Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Sentiment Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={sentimentData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        dataKey="value"
                        label={({ category, value }) => `${category}: ${value}`}
                      >
                        {sentimentData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Discussion Topics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={trendingTopics} layout="horizontal">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="topic" type="category" width={100} />
                      <Tooltip />
                      <Bar dataKey="count" fill="hsl(var(--chart-1))" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="sentiment" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Emotion Detection Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={enhancedAnalytics.emotionData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="emotion" />
                      <PolarRadiusAxis angle={90} domain={[0, 50]} />
                      <Radar
                        name="Emotion Intensity"
                        dataKey="value"
                        stroke="hsl(var(--chart-1))"
                        fill="hsl(var(--chart-1))"
                        fillOpacity={0.3}
                      />
                      <Tooltip />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sentiment Over Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={enhancedAnalytics.timeSeriesData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="hour" />
                      <YAxis domain={[-1, 1]} />
                      <Tooltip />
                      <Area
                        type="monotone"
                        dataKey="sentiment"
                        stroke="hsl(var(--chart-3))"
                        fill="hsl(var(--chart-3))"
                        fillOpacity={0.3}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="threats" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Threat Level Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={enhancedAnalytics.threatLevels}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="level" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill={(entry) => entry.color} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Message Volume vs Urgency</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={enhancedAnalytics.timeSeriesData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="hour" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="messages" stroke="hsl(var(--chart-1))" name="Total Messages" />
                      <Line
                        type="monotone"
                        dataKey="urgentMessages"
                        stroke="hsl(var(--chart-2))"
                        name="Urgent Messages"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="geographic" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Geographic Message Clusters</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart data={enhancedAnalytics.geographicClusters}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="messages" name="Messages" />
                      <YAxis dataKey="avgUrgency" name="Avg Urgency" domain={[0, 1]} />
                      <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                      <Scatter name="Areas" dataKey="avgUrgency" fill="hsl(var(--chart-1))" />
                    </ScatterChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Area Activity Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {enhancedAnalytics.geographicClusters.map((cluster, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                      <div>
                        <div className="font-medium">{cluster.area}</div>
                        <div className="text-sm text-muted-foreground">{cluster.messages} messages</div>
                      </div>
                      <Badge
                        variant={
                          cluster.avgUrgency > 0.7 ? "destructive" : cluster.avgUrgency > 0.5 ? "outline" : "outline"
                        }
                      >
                        {cluster.avgUrgency > 0.7 ? "High Risk" : cluster.avgUrgency > 0.5 ? "Medium Risk" : "Low Risk"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="temporal" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>24-Hour Communication Patterns</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={enhancedAnalytics.timeSeriesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hour" />
                    <YAxis />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="messages"
                      stackId="1"
                      stroke="hsl(var(--chart-1))"
                      fill="hsl(var(--chart-1))"
                      fillOpacity={0.6}
                      name="Total Messages"
                    />
                    <Area
                      type="monotone"
                      dataKey="urgentMessages"
                      stackId="2"
                      stroke="hsl(var(--chart-2))"
                      fill="hsl(var(--chart-2))"
                      fillOpacity={0.8}
                      name="Urgent Messages"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Recent Messages */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Recent High-Priority Messages
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {urgentMessages.slice(0, 3).map((msg: any) => (
              <div key={msg.id} className="p-4 rounded-lg border bg-card">
                <div className="flex items-start justify-between mb-2">
                  <Badge variant={msg.urgency === "critical" ? "destructive" : "outline"}>
                    {msg.urgency.toUpperCase()}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{new Date(msg.timestamp).toLocaleTimeString()}</span>
                </div>
                <p className="text-sm mb-2">{msg.content}</p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>📍 {msg.location || "Unknown Location"}</span>
                  <span className="text-primary">🔗 {msg.source}</span>
                </div>
              </div>
            ))}
            {urgentMessages.length === 0 && (
              <div className="text-center text-muted-foreground py-4">
                <p>No high-priority messages at this time</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
