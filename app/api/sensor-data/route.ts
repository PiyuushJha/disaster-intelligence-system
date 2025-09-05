import { NextResponse } from "next/server"

interface SensorReading {
  id: string
  location: string
  coordinates: [number, number]
  timestamp: string
  pm25: number
  pm10: number
  temperature: number
  humidity: number
  gasLevel: number
  smokeLevel: number
  status: "normal" | "warning" | "critical"
}

// Simulate multiple sensor locations
const sensorLocations = [
  { id: "sensor-001", location: "Downtown District", coordinates: [40.7128, -74.006] as [number, number] },
  { id: "sensor-002", location: "Industrial Zone", coordinates: [40.7589, -73.9851] as [number, number] },
  { id: "sensor-003", location: "Residential Area", coordinates: [40.6782, -73.9442] as [number, number] },
  { id: "sensor-004", location: "Waterfront", coordinates: [40.7505, -74.0134] as [number, number] },
  { id: "sensor-005", location: "University Campus", coordinates: [40.8176, -73.7781] as [number, number] },
]

function generateSensorReading(sensor: (typeof sensorLocations)[0]): SensorReading {
  // Simulate realistic environmental data with some randomness
  const baseTemp = 22 + Math.random() * 15 // 22-37°C
  const baseHumidity = 40 + Math.random() * 40 // 40-80%
  const basePM25 = Math.random() * 50 // 0-50 μg/m³
  const basePM10 = basePM25 * 1.5 + Math.random() * 20
  const baseGas = Math.random() * 100
  const baseSmoke = Math.random() * 100

  // Determine status based on readings
  let status: "normal" | "warning" | "critical" = "normal"
  if (basePM25 > 35 || baseTemp > 35 || baseGas > 70) status = "warning"
  if (basePM25 > 50 || baseTemp > 40 || baseGas > 85 || baseSmoke > 80) status = "critical"

  return {
    id: sensor.id,
    location: sensor.location,
    coordinates: sensor.coordinates,
    timestamp: new Date().toISOString(),
    pm25: Math.round(basePM25 * 10) / 10,
    pm10: Math.round(basePM10 * 10) / 10,
    temperature: Math.round(baseTemp * 10) / 10,
    humidity: Math.round(baseHumidity * 10) / 10,
    gasLevel: Math.round(baseGas * 10) / 10,
    smokeLevel: Math.round(baseSmoke * 10) / 10,
    status,
  }
}

export async function GET() {
  try {
    const sensorReadings = sensorLocations.map(generateSensorReading)

    return NextResponse.json({
      success: true,
      data: sensorReadings,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch sensor data" }, { status: 500 })
  }
}
