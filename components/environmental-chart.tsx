"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const data = [
  { time: "00:00", pm25: 25, temperature: 22, humidity: 65 },
  { time: "04:00", pm25: 30, temperature: 20, humidity: 70 },
  { time: "08:00", pm25: 45, temperature: 25, humidity: 60 },
  { time: "12:00", pm25: 65, temperature: 28, humidity: 55 },
  { time: "16:00", pm25: 85, temperature: 30, humidity: 50 },
  { time: "20:00", pm25: 70, temperature: 26, humidity: 58 },
  { time: "24:00", pm25: 40, temperature: 23, humidity: 62 },
]

export function EnvironmentalChart() {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis dataKey="time" className="text-xs" tick={{ fontSize: 12 }} />
          <YAxis className="text-xs" tick={{ fontSize: 12 }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
            }}
          />
          <Line type="monotone" dataKey="pm25" stroke="hsl(var(--chart-1))" strokeWidth={2} name="PM2.5 (μg/m³)" />
          <Line
            type="monotone"
            dataKey="temperature"
            stroke="hsl(var(--chart-4))"
            strokeWidth={2}
            name="Temperature (°C)"
          />
          <Line type="monotone" dataKey="humidity" stroke="hsl(var(--chart-3))" strokeWidth={2} name="Humidity (%)" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
