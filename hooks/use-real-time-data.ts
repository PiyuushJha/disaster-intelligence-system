"use client"

import { useState, useEffect } from "react"

interface UseRealTimeDataOptions {
  endpoint: string
  interval?: number
  enabled?: boolean
}

export function useRealTimeData<T>(options: UseRealTimeDataOptions) {
  const { endpoint, interval = 30000, enabled = true } = options
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  useEffect(() => {
    if (!enabled) return

    const fetchData = async () => {
      try {
        setError(null)
        const response = await fetch(endpoint)

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const result = await response.json()

        if (result.success) {
          setData(result.data || result)
          setLastUpdated(new Date())
        } else {
          throw new Error(result.error || "Unknown error occurred")
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch data")
        console.error(`[v0] Error fetching ${endpoint}:`, err)
      } finally {
        setLoading(false)
      }
    }

    // Initial fetch
    fetchData()

    // Set up interval for real-time updates
    const intervalId = setInterval(fetchData, interval)

    return () => clearInterval(intervalId)
  }, [endpoint, interval, enabled])

  const refetch = async () => {
    setLoading(true)
    const response = await fetch(endpoint)
    const result = await response.json()

    if (result.success) {
      setData(result.data || result)
      setLastUpdated(new Date())
    }
    setLoading(false)
  }

  return {
    data,
    loading,
    error,
    lastUpdated,
    refetch,
  }
}
