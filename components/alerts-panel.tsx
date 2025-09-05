"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, CheckCircle, Clock, Bell, X } from "lucide-react"
import { useRealTimeData } from "@/hooks/use-real-time-data"

export function AlertsPanel() {
  const { data: alertsData, loading } = useRealTimeData<any>({
    endpoint: "/api/alerts",
    interval: 10000, // Update every 10 seconds
  })

  const alerts = alertsData?.data || []
  const summary = alertsData?.summary || { critical: 0, high: 0, medium: 0, low: 0 }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "destructive"
      case "high":
        return "destructive"
      case "medium":
        return "secondary"
      case "low":
        return "outline"
      default:
        return "outline"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <AlertTriangle className="w-4 h-4" />
      case "investigating":
        return <Clock className="w-4 h-4" />
      case "monitoring":
        return <Bell className="w-4 h-4" />
      case "resolved":
        return <CheckCircle className="w-4 h-4" />
      default:
        return <AlertTriangle className="w-4 h-4" />
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-muted-foreground">Loading alerts...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Alert Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-destructive bg-destructive/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-destructive">Critical</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{summary.critical}</div>
            <p className="text-xs text-muted-foreground">Requires immediate action</p>
          </CardContent>
        </Card>

        <Card className="border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-yellow-700 dark:text-yellow-400">High Priority</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-700 dark:text-yellow-400">{summary.high}</div>
            <p className="text-xs text-muted-foreground">Under investigation</p>
          </CardContent>
        </Card>

        <Card className="border-primary bg-primary/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-primary">Medium</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{summary.medium}</div>
            <p className="text-xs text-muted-foreground">Being monitored</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Low Priority</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.low}</div>
            <p className="text-xs text-muted-foreground">Routine monitoring</p>
          </CardContent>
        </Card>
      </div>

      {/* Active Alerts */}
      <div className="space-y-4">
        <h3 className="text-lg font-serif font-semibold">Active Alerts</h3>

        {alerts.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <CheckCircle className="w-12 h-12 text-primary mx-auto mb-2" />
              <p className="text-muted-foreground">No active alerts at this time</p>
            </CardContent>
          </Card>
        ) : (
          alerts.map((alert: any) => (
            <Card
              key={alert.id}
              className={`${
                alert.severity === "critical"
                  ? "border-destructive bg-destructive/5"
                  : alert.severity === "high"
                    ? "border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20"
                    : alert.severity === "medium"
                      ? "border-primary bg-primary/5"
                      : ""
              }`}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(alert.status)}
                    <div>
                      <CardTitle className="text-base">{alert.title}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant={getSeverityColor(alert.severity)}>{alert.severity.toUpperCase()}</Badge>
                        <Badge variant="outline">{alert.status.toUpperCase()}</Badge>
                        <Badge variant="outline">{alert.type}</Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      {new Date(alert.timestamp).toLocaleTimeString()}
                    </span>
                    <Button variant="ghost" size="sm">
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-3">{alert.description}</p>

                <div className="space-y-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Location:</span>
                    <span>{alert.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Data Source:</span>
                    <span>{alert.dataSource}</span>
                  </div>
                </div>

                {alert.actionItems && alert.actionItems.length > 0 && (
                  <div className="mt-3">
                    <p className="text-xs font-medium text-muted-foreground mb-2">Recommended Actions:</p>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      {alert.actionItems.slice(0, 3).map((action: string, index: number) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-primary">•</span>
                          <span>{action}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="flex gap-2 mt-4">
                  <Button size="sm" variant={alert.severity === "critical" ? "destructive" : "default"}>
                    Take Action
                  </Button>
                  <Button size="sm" variant="outline">
                    View Details
                  </Button>
                  {alert.status === "active" && (
                    <Button size="sm" variant="outline">
                      Acknowledge
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
