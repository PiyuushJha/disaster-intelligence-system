"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, AlertTriangle, CheckCircle, Clock } from "lucide-react"
import { useRealTimeData } from "@/hooks/use-real-time-data"

export function InteractiveMap() {
  const { data: mapData, loading } = useRealTimeData<any>({
    endpoint: "/api/map-data",
    interval: 10000, // Update every 10 seconds
  })

  const { data: sensorData } = useRealTimeData<any>({
    endpoint: "/api/sensor-data",
    interval: 5000,
  })

  const mapPoints = mapData?.data?.points || []
  const sensorPoints = mapPoints.filter((point: any) => point.type === "sensor")
  const sensors = sensorData?.data || []

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-muted-foreground">Loading map data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Sensor Network Overview
            <Badge variant="outline" className="ml-auto">
              {sensorPoints.length} Active Sensors
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Map Placeholder */}
          <div className="relative h-[400px] bg-muted rounded-lg overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">Interactive Map View</p>
                <p className="text-sm text-muted-foreground">Real-time sensor locations and data overlay</p>
              </div>
            </div>

            {/* Sensor Markers */}
            {sensorPoints.map((point: any, index: number) => (
              <div
                key={point.id}
                className={`absolute w-4 h-4 rounded-full border-2 border-white shadow-lg cursor-pointer transform -translate-x-2 -translate-y-2 ${
                  point.status === "critical"
                    ? "bg-destructive animate-pulse"
                    : point.status === "warning"
                      ? "bg-yellow-500"
                      : "bg-primary"
                }`}
                style={{
                  left: `${20 + index * 15}%`,
                  top: `${30 + (index % 2) * 20}%`,
                }}
                title={point.location}
              />
            ))}

            {/* Communication Points */}
            {mapPoints
              .filter((point: any) => point.type === "communication")
              .map((point: any, index: number) => (
                <div
                  key={point.id}
                  className={`absolute w-3 h-3 rounded-full border border-white shadow-md cursor-pointer transform -translate-x-1 -translate-y-1 ${
                    point.status === "critical"
                      ? "bg-red-400"
                      : point.status === "warning"
                        ? "bg-orange-400"
                        : "bg-blue-400"
                  }`}
                  style={{
                    left: `${25 + index * 12}%`,
                    top: `${40 + (index % 3) * 15}%`,
                  }}
                  title={`Communication: ${point.location}`}
                />
              ))}

            {/* Incident Markers */}
            {mapPoints
              .filter((point: any) => point.type === "incident")
              .map((point: any, index: number) => (
                <div
                  key={point.id}
                  className="absolute w-6 h-6 rounded-full bg-destructive border-2 border-white shadow-lg cursor-pointer transform -translate-x-3 -translate-y-3 animate-pulse"
                  style={{
                    left: `${30 + index * 20}%`,
                    top: `${25 + (index % 2) * 30}%`,
                  }}
                  title={`Incident: ${point.data.title}`}
                >
                  <AlertTriangle className="w-4 h-4 text-white m-0.5" />
                </div>
              ))}
          </div>

          {/* Map Legend */}
          <div className="flex items-center gap-6 mt-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary"></div>
              <span>Normal Sensors</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <span>Warning Sensors</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-destructive"></div>
              <span>Critical Sensors</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-400"></div>
              <span>Communications</span>
            </div>
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-3 h-3 text-destructive" />
              <span>Active Incidents</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sensor Status Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sensors.map((sensor: any) => (
          <Card key={sensor.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">{sensor.location}</CardTitle>
                {sensor.status === "critical" ? (
                  <AlertTriangle className="w-5 h-5 text-destructive" />
                ) : sensor.status === "warning" ? (
                  <Clock className="w-5 h-5 text-yellow-500" />
                ) : (
                  <CheckCircle className="w-5 h-5 text-primary" />
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">PM2.5:</span>
                    <span className="font-semibold">{sensor.pm25} μg/m³</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Temp:</span>
                    <span className="font-semibold">{sensor.temperature}°C</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Humidity:</span>
                    <span className="font-semibold">{sensor.humidity}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Gas:</span>
                    <span className="font-semibold">{sensor.gasLevel} ppm</span>
                  </div>
                </div>
                <Badge
                  variant={
                    sensor.status === "critical" ? "destructive" : sensor.status === "warning" ? "secondary" : "default"
                  }
                  className="w-full justify-center mt-2"
                >
                  {sensor.status === "critical" ? "Critical" : sensor.status === "warning" ? "Warning" : "Normal"}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
