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
    const mapPoints: MapDataPoint[] = []

    // Generate sensor locations
    const sensorLocations = [
      { id: "sensor-001", location: "Downtown District", coordinates: [40.7128, -74.006] as [number, number] },
      { id: "sensor-002", location: "Industrial Zone", coordinates: [40.7589, -73.9851] as [number, number] },
      { id: "sensor-003", location: "Residential Area", coordinates: [40.6782, -73.9442] as [number, number] },
      { id: "sensor-004", location: "Waterfront", coordinates: [40.7505, -74.0134] as [number, number] },
      { id: "sensor-005", location: "Airport District", coordinates: [40.6413, -73.7781] as [number, number] },
    ]

    sensorLocations.forEach((sensor) => {
      const pm25 = Math.random() * 50 + 10
      const status = pm25 > 35 ? "critical" : pm25 > 25 ? "warning" : "normal"

      mapPoints.push({
        id: sensor.id,
        type: "sensor",
        coordinates: sensor.coordinates,
        location: sensor.location,
        status: status as "normal" | "warning" | "critical",
        data: {
          pm25: Math.round(pm25 * 10) / 10,
          pm10: Math.round(pm25 * 1.5 * 10) / 10,
          temperature: Math.round((Math.random() * 15 + 20) * 10) / 10,
          humidity: Math.round((Math.random() * 30 + 40) * 10) / 10,
          gasLevel: Math.round(Math.random() * 100 * 10) / 10,
          smokeLevel: Math.round(Math.random() * 50 * 10) / 10,
        },
        timestamp: new Date().toISOString(),
      })
    })

    // Generate communication points
    const commLocations = [
      { id: "comm-001", location: "Social Media Report", coordinates: [40.7282, -74.0776] as [number, number] },
      { id: "comm-002", location: "Emergency Call", coordinates: [40.7831, -73.9712] as [number, number] },
      { id: "comm-003", location: "News Report", coordinates: [40.6892, -73.9442] as [number, number] },
    ]

    commLocations.forEach((comm) => {
      const urgencyLevel = Math.random()
      const urgency = urgencyLevel > 0.7 ? "critical" : urgencyLevel > 0.4 ? "high" : "medium"
      const status = urgency === "critical" ? "critical" : urgency === "high" ? "warning" : "normal"

      mapPoints.push({
        id: comm.id,
        type: "communication",
        coordinates: comm.coordinates,
        location: comm.location,
        status: status as "normal" | "warning" | "critical",
        data: {
          source: ["Twitter", "Facebook", "Emergency Hotline", "News"][Math.floor(Math.random() * 4)],
          content: "Environmental concern reported in the area",
          sentiment: ["positive", "negative", "neutral"][Math.floor(Math.random() * 3)],
          urgency,
          entities: ["pollution", "air quality", "health"],
          topics: ["environmental", "safety"],
        },
        timestamp: new Date().toISOString(),
      })
    })

    // Generate incident points
    const incidents = [
      { id: "incident-001", location: "Chemical Plant", coordinates: [40.7505, -74.0234] as [number, number] },
      { id: "incident-002", location: "Highway Junction", coordinates: [40.6892, -73.9542] as [number, number] },
    ]

    incidents.forEach((incident) => {
      if (Math.random() > 0.5) {
        // Only show some incidents
        mapPoints.push({
          id: incident.id,
          type: "incident",
          coordinates: incident.coordinates,
          location: incident.location,
          status: "critical",
          data: {
            title: "Environmental Alert",
            description: "High pollution levels detected",
            type: "environmental",
            actionItems: ["Monitor air quality", "Issue health advisory"],
          },
          timestamp: new Date().toISOString(),
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
    console.error("Map data error:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch map data" }, { status: 500 })
  }
}
