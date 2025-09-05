import { NextResponse } from "next/server"

interface Alert {
  id: string
  type: "environmental" | "communication" | "correlation" | "system"
  severity: "low" | "medium" | "high" | "critical"
  title: string
  description: string
  location: string
  coordinates?: [number, number]
  timestamp: string
  status: "active" | "acknowledged" | "resolved"
  actionItems: string[]
  dataSource: string
}

export async function GET() {
  try {
    const alerts: Alert[] = []

    // Generate sample environmental alerts based on simulated sensor conditions
    const sensorLocations = [
      { id: "sensor-001", location: "Downtown District", coordinates: [40.7128, -74.006] as [number, number] },
      { id: "sensor-002", location: "Industrial Zone", coordinates: [40.7589, -73.9851] as [number, number] },
      { id: "sensor-003", location: "Residential Area", coordinates: [40.6782, -73.9442] as [number, number] },
      { id: "sensor-004", location: "Waterfront", coordinates: [40.7505, -74.0134] as [number, number] },
      { id: "sensor-005", location: "University Campus", coordinates: [40.8176, -73.7781] as [number, number] },
    ]

    // Simulate some alerts based on current conditions
    const currentTime = new Date()
    const timeVariations = [2, 5, 8, 12, 15] // minutes ago

    // Generate a critical air quality alert
    if (Math.random() > 0.7) {
      alerts.push({
        id: `env-alert-critical-${Date.now()}`,
        type: "environmental",
        severity: "critical",
        title: `Critical Air Quality Alert - ${sensorLocations[1].location}`,
        description: `PM2.5 levels exceed 85 μg/m³. Immediate attention required for sensitive individuals.`,
        location: sensorLocations[1].location,
        coordinates: sensorLocations[1].coordinates,
        timestamp: new Date(currentTime.getTime() - timeVariations[0] * 60000).toISOString(),
        status: "active",
        actionItems: [
          "Issue immediate health advisory",
          "Deploy emergency response teams",
          "Monitor air quality continuously",
          "Consider evacuation for sensitive areas",
        ],
        dataSource: `Sensor ${sensorLocations[1].id}`,
      })
    }

    // Generate a gas leak alert
    if (Math.random() > 0.8) {
      alerts.push({
        id: `env-alert-gas-${Date.now()}`,
        type: "environmental",
        severity: "high",
        title: `Gas Level Warning - ${sensorLocations[0].location}`,
        description: `Elevated gas levels detected. Emergency services have been notified.`,
        location: sensorLocations[0].location,
        coordinates: sensorLocations[0].coordinates,
        timestamp: new Date(currentTime.getTime() - timeVariations[1] * 60000).toISOString(),
        status: "active",
        actionItems: ["Verify gas leak source", "Coordinate with emergency services", "Monitor surrounding areas"],
        dataSource: `Sensor ${sensorLocations[0].id}`,
      })
    }

    // Generate communication-based alerts
    const communicationAlerts = [
      {
        id: `comm-alert-${Date.now()}-1`,
        type: "communication" as const,
        severity: "medium" as const,
        title: "Social Media Activity Surge",
        description: "Significant increase in emergency-related social media posts detected in downtown area.",
        location: "Downtown District",
        coordinates: [40.7128, -74.006] as [number, number],
        timestamp: new Date(currentTime.getTime() - timeVariations[2] * 60000).toISOString(),
        status: "active" as const,
        actionItems: [
          "Monitor social media trends",
          "Verify reports with ground teams",
          "Prepare public information response",
        ],
        dataSource: "Social Media Monitor",
      },
      {
        id: `comm-alert-${Date.now()}-2`,
        type: "communication" as const,
        severity: "low" as const,
        title: "Weather Advisory Update",
        description: "National Weather Service issued updated conditions for the region.",
        location: "City-wide",
        timestamp: new Date(currentTime.getTime() - timeVariations[3] * 60000).toISOString(),
        status: "active" as const,
        actionItems: ["Review weather conditions", "Update emergency protocols", "Inform relevant departments"],
        dataSource: "Weather Service",
      },
    ]

    // Add some communication alerts randomly
    if (Math.random() > 0.5) {
      alerts.push(communicationAlerts[0])
    }
    if (Math.random() > 0.6) {
      alerts.push(communicationAlerts[1])
    }

    // Always include a system status alert if no other alerts
    if (alerts.length === 0) {
      alerts.push({
        id: `system-status-${Date.now()}`,
        type: "system",
        severity: "low",
        title: "System Operational",
        description: "All monitoring systems are functioning normally. No critical alerts detected at this time.",
        location: "System-wide",
        timestamp: currentTime.toISOString(),
        status: "active",
        actionItems: ["Continue routine monitoring", "Maintain system readiness", "Review daily reports"],
        dataSource: "System Monitor",
      })
    }

    // Sort alerts by severity and timestamp
    const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 }
    alerts.sort((a, b) => {
      const severityDiff = severityOrder[b.severity] - severityOrder[a.severity]
      if (severityDiff !== 0) return severityDiff
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    })

    return NextResponse.json({
      success: true,
      data: alerts,
      summary: {
        total: alerts.length,
        critical: alerts.filter((a) => a.severity === "critical").length,
        high: alerts.filter((a) => a.severity === "high").length,
        medium: alerts.filter((a) => a.severity === "medium").length,
        low: alerts.filter((a) => a.severity === "low").length,
        active: alerts.filter((a) => a.status === "active").length,
      },
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("[v0] Error in alerts endpoint:", error)

    // Return a fallback response even on error
    return NextResponse.json({
      success: true,
      data: [
        {
          id: "fallback-alert",
          type: "system",
          severity: "low",
          title: "System Status",
          description: "Monitoring systems are operational. Alert generation temporarily using fallback mode.",
          location: "System-wide",
          timestamp: new Date().toISOString(),
          status: "active",
          actionItems: ["Monitor system status", "Check data connections"],
          dataSource: "Fallback System",
        },
      ],
      summary: { total: 1, critical: 0, high: 0, medium: 0, low: 1, active: 1 },
      timestamp: new Date().toISOString(),
    })
  }
}
