import { NextResponse } from "next/server"

interface MapDataPoint {
  id: string
  type: "sensor" | "incident" | "communication"
  coordinates: [number, number]
  location: string
  status: "normal" | "warning" | "critical"
  data: any
  timestamp: string
}

export async function GET() {
  try {
    // Fetch all data sources for map visualization
    const [sensorResponse, commResponse, alertResponse] = await Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/sensor-data`),
      fetch(`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/communication-analysis`),
      fetch(`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/alerts`),
    ])

    if (!sensorResponse.ok || !commResponse.ok || !alertResponse.ok) {
      throw new Error("Failed to fetch map data")
    }

    const sensorData = await sensorResponse.json()
    const commData = await commResponse.json()
    const alertData = await alertResponse.json()

    const mapPoints: MapDataPoint[] = []

    // Add sensor locations
    sensorData.data.forEach((sensor: any) => {
      mapPoints.push({
        id: sensor.id,
        type: "sensor",
        coordinates: sensor.coordinates,
        location: sensor.location,
        status: sensor.status,
        data: {
          pm25: sensor.pm25,
          pm10: sensor.pm10,
          temperature: sensor.temperature,
          humidity: sensor.humidity,
          gasLevel: sensor.gasLevel,
          smokeLevel: sensor.smokeLevel,
        },
        timestamp: sensor.timestamp,
      })
    })

    // Add communication points
    commData.data.communications.forEach((comm: any) => {
      if (comm.coordinates) {
        const status = comm.urgency === "critical" ? "critical" : comm.urgency === "high" ? "warning" : "normal"

        mapPoints.push({
          id: comm.id,
          type: "communication",
          coordinates: comm.coordinates,
          location: comm.location,
          status: status as "normal" | "warning" | "critical",
          data: {
            source: comm.source,
            content: comm.content,
            sentiment: comm.sentiment,
            urgency: comm.urgency,
            entities: comm.entities,
            topics: comm.topics,
          },
          timestamp: comm.timestamp,
        })
      }
    })

    // Add incident points from alerts
    alertData.data.forEach((alert: any) => {
      if (alert.coordinates && alert.severity === "critical") {
        mapPoints.push({
          id: alert.id,
          type: "incident",
          coordinates: alert.coordinates,
          location: alert.location,
          status: "critical",
          data: {
            title: alert.title,
            description: alert.description,
            type: alert.type,
            actionItems: alert.actionItems,
          },
          timestamp: alert.timestamp,
        })
      }
    })

    // Calculate map bounds
    const lats = mapPoints.map((p) => p.coordinates[0])
    const lngs = mapPoints.map((p) => p.coordinates[1])

    const bounds = {
      north: Math.max(...lats) + 0.01,
      south: Math.min(...lats) - 0.01,
      east: Math.max(...lngs) + 0.01,
      west: Math.min(...lngs) - 0.01,
    }

    return NextResponse.json({
      success: true,
      data: {
        points: mapPoints,
        bounds,
        center: [(bounds.north + bounds.south) / 2, (bounds.east + bounds.west) / 2] as [number, number],
        statistics: {
          totalPoints: mapPoints.length,
          sensors: mapPoints.filter((p) => p.type === "sensor").length,
          communications: mapPoints.filter((p) => p.type === "communication").length,
          incidents: mapPoints.filter((p) => p.type === "incident").length,
          criticalPoints: mapPoints.filter((p) => p.status === "critical").length,
        },
      },
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch map data" }, { status: 500 })
  }
}
