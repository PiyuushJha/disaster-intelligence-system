"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import {
  Activity,
  AlertTriangle,
  MapPin,
  Thermometer,
  Wind,
  Droplets,
  Radio,
  Users,
  TrendingUp,
  Shield,
  Zap,
  Eye,
} from "lucide-react"
import { EnvironmentalChart } from "./environmental-chart"
import { InteractiveMap } from "./interactive-map"
import { CommunicationAnalysis } from "./communication-analysis"
import { AlertsPanel } from "./alerts-panel"
import { ThemeToggle } from "./theme-toggle"
import { useRealTimeData } from "@/hooks/use-real-time-data"

export function DisasterDashboard() {
  const { data: sensorData, loading: sensorLoading } = useRealTimeData<any>({
    endpoint: "/api/sensor-data",
    interval: 5000, // Update every 5 seconds
  })

  const { data: alertsData } = useRealTimeData<any>({
    endpoint: "/api/alerts",
    interval: 10000, // Update every 10 seconds
  })

  const [activeTab, setActiveTab] = useState("overview")
  const [isConnected, setIsConnected] = useState(true)

  const currentSensor = sensorData?.data?.[0] || {
    pm25: 0,
    temperature: 0,
    humidity: 0,
    gasLevel: 0,
  }

  const criticalAlerts = alertsData?.data?.filter((alert: any) => alert.severity === "critical") || []

  useEffect(() => {
    setIsConnected(!sensorLoading)
  }, [sensorLoading])

  const getAirQualityStatus = (pm25: number) => {
    if (pm25 <= 35) return { status: "Good", color: "bg-primary", textColor: "text-primary" }
    if (pm25 <= 75) return { status: "Moderate", color: "bg-yellow-500", textColor: "text-yellow-600" }
    return { status: "Unhealthy", color: "bg-destructive", textColor: "text-destructive" }
  }

  const airQuality = getAirQualityStatus(currentSensor.pm25)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-lg">
                <Shield className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-serif font-bold text-foreground">Disaster Intelligence System</h1>
                <p className="text-sm text-muted-foreground">Hyper-Localized Environmental Monitor</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div
                  className={`w-2 h-2 rounded-full ${isConnected ? "bg-primary animate-pulse" : "bg-destructive"}`}
                />
                <span className="text-sm font-medium">{isConnected ? "Connected" : "Disconnected"}</span>
              </div>
              <Badge variant="outline" className="gap-1 text-primary border-primary">
                <Radio className="w-3 h-3" />
                Live Data
              </Badge>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-fit lg:grid-cols-4">
            <TabsTrigger value="overview" className="gap-2">
              <Activity className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="map" className="gap-2">
              <MapPin className="w-4 h-4" />
              Map View
            </TabsTrigger>
            <TabsTrigger value="analysis" className="gap-2">
              <TrendingUp className="w-4 h-4" />
              Analysis
            </TabsTrigger>
            <TabsTrigger value="alerts" className="gap-2">
              <AlertTriangle className="w-4 h-4" />
              Alerts
              {criticalAlerts.length > 0 && (
                <Badge variant="destructive" className="ml-1 h-5 w-5 p-0 text-xs">
                  {criticalAlerts.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Critical Alerts */}
            {criticalAlerts.length > 0 && (
              <Alert className="border-destructive bg-destructive/10">
                <AlertTriangle className="h-4 w-4 text-destructive" />
                <AlertTitle className="text-destructive">{criticalAlerts[0].title}</AlertTitle>
                <AlertDescription>{criticalAlerts[0].description}</AlertDescription>
              </Alert>
            )}

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="border-l-4 border-l-primary">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Air Quality</CardTitle>
                  <Wind className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{currentSensor.pm25} μg/m³</div>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="secondary" className={airQuality.color}>
                      {airQuality.status}
                    </Badge>
                  </div>
                  <Progress value={(currentSensor.pm25 / 150) * 100} className="mt-3" />
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-chart-4">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Temperature</CardTitle>
                  <Thermometer className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{currentSensor.temperature}°C</div>
                  <p className="text-xs text-muted-foreground mt-2">Normal range: 15-30°C</p>
                  <Progress value={(currentSensor.temperature / 40) * 100} className="mt-3" />
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-chart-3">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Humidity</CardTitle>
                  <Droplets className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{currentSensor.humidity}%</div>
                  <p className="text-xs text-muted-foreground mt-2">Optimal: 40-60%</p>
                  <Progress value={currentSensor.humidity} className="mt-3" />
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-destructive">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Gas Levels</CardTitle>
                  <Zap className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{currentSensor.gasLevel} ppm</div>
                  <p className="text-xs text-muted-foreground mt-2">Safe threshold: &lt;50 ppm</p>
                  <Progress value={(currentSensor.gasLevel / 100) * 100} className="mt-3" />
                </CardContent>
              </Card>
            </div>

            {/* Charts and Analysis */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    Environmental Trends
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <EnvironmentalChart />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Communication Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CommunicationAnalysis />
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {alertsData?.data?.slice(0, 4).map((alert: any, index: number) => (
                    <div key={alert.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          alert.severity === "critical"
                            ? "bg-destructive"
                            : alert.severity === "high"
                              ? "bg-yellow-500"
                              : "bg-primary"
                        }`}
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{alert.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(alert.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  )) || (
                    <div className="text-center text-muted-foreground py-4">
                      <p>Loading recent activity...</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="map">
            <InteractiveMap />
          </TabsContent>

          <TabsContent value="analysis">
            <CommunicationAnalysis detailed />
          </TabsContent>

          <TabsContent value="alerts">
            <AlertsPanel />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
