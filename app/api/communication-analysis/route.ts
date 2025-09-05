import { NextResponse } from "next/server"

interface CommunicationData {
  id: string
  source: string
  content: string
  timestamp: string
  location?: string
  coordinates?: [number, number]
  sentiment: "positive" | "negative" | "neutral"
  urgency: "low" | "medium" | "high" | "critical"
  entities: string[]
  topics: string[]
  confidence: number
}

// Simulated communication data sources
const communicationSources = [
  {
    source: "Twitter",
    content: "Heavy smoke visible near downtown area, visibility very poor #emergency",
    location: "Downtown District",
    coordinates: [40.7128, -74.006] as [number, number],
    sentiment: "negative" as const,
    urgency: "high" as const,
    entities: ["smoke", "downtown", "visibility"],
    topics: ["fire", "air quality", "emergency"],
  },
  {
    source: "Emergency Report",
    content: "Industrial gas leak reported at Zone 2, evacuation in progress",
    location: "Industrial Zone",
    coordinates: [40.7589, -73.9851] as [number, number],
    sentiment: "negative" as const,
    urgency: "critical" as const,
    entities: ["gas leak", "Zone 2", "evacuation"],
    topics: ["gas leak", "evacuation", "industrial accident"],
  },
  {
    source: "Citizen Report",
    content: "Air quality seems better today, no unusual smells in residential area",
    location: "Residential Area",
    coordinates: [40.6782, -73.9442] as [number, number],
    sentiment: "positive" as const,
    urgency: "low" as const,
    entities: ["air quality", "residential"],
    topics: ["air quality", "normal conditions"],
  },
  {
    source: "Weather Service",
    content: "High temperature alert: 38°C recorded, heat advisory in effect",
    location: "University Campus",
    coordinates: [40.8176, -73.7781] as [number, number],
    sentiment: "neutral" as const,
    urgency: "medium" as const,
    entities: ["temperature", "38°C", "heat advisory"],
    topics: ["weather", "heat wave", "advisory"],
  },
  {
    source: "Local News",
    content: "Waterfront area reports normal conditions, air quality monitoring continues",
    location: "Waterfront",
    coordinates: [40.7505, -74.0134] as [number, number],
    sentiment: "neutral" as const,
    urgency: "low" as const,
    entities: ["waterfront", "normal conditions", "monitoring"],
    topics: ["monitoring", "normal conditions"],
  },
]

function generateCommunicationAnalysis(): CommunicationData[] {
  return communicationSources.map((item, index) => ({
    id: `comm-${Date.now()}-${index}`,
    source: item.source,
    content: item.content,
    timestamp: new Date(Date.now() - Math.random() * 3600000).toISOString(), // Random time within last hour
    location: item.location,
    coordinates: item.coordinates,
    sentiment: item.sentiment,
    urgency: item.urgency,
    entities: item.entities,
    topics: item.topics,
    confidence: 0.7 + Math.random() * 0.3, // 70-100% confidence
  }))
}

export async function GET() {
  try {
    const analysisResults = generateCommunicationAnalysis()

    // Calculate trending topics
    const topicCounts = analysisResults.reduce(
      (acc, item) => {
        item.topics.forEach((topic) => {
          acc[topic] = (acc[topic] || 0) + 1
        })
        return acc
      },
      {} as Record<string, number>,
    )

    const trendingTopics = Object.entries(topicCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([topic, count]) => ({ topic, count }))

    return NextResponse.json({
      success: true,
      data: {
        communications: analysisResults,
        trendingTopics,
        totalAnalyzed: analysisResults.length,
        sentimentDistribution: {
          positive: analysisResults.filter((c) => c.sentiment === "positive").length,
          negative: analysisResults.filter((c) => c.sentiment === "negative").length,
          neutral: analysisResults.filter((c) => c.sentiment === "neutral").length,
        },
      },
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to analyze communications" }, { status: 500 })
  }
}
