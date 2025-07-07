"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X, CheckCircle, AlertCircle, Info, TrendingUp } from "lucide-react"

interface Notification {
  id: string
  type: "success" | "error" | "info" | "trade"
  title: string
  message: string
  timestamp: Date
  autoClose?: boolean
}

interface NotificationSystemProps {
  notifications: Notification[]
  onRemove: (id: string) => void
}

export function NotificationSystem({ notifications, onRemove }: NotificationSystemProps) {
  useEffect(() => {
    notifications.forEach((notification) => {
      if (notification.autoClose) {
        const timer = setTimeout(() => {
          onRemove(notification.id)
        }, 5000)
        return () => clearTimeout(timer)
      }
    })
  }, [notifications, onRemove])

  const getIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-400" />
      case "error":
        return <AlertCircle className="w-5 h-5 text-red-400" />
      case "trade":
        return <TrendingUp className="w-5 h-5 text-blue-400" />
      default:
        return <Info className="w-5 h-5 text-blue-400" />
    }
  }

  const getBackgroundColor = (type: string) => {
    switch (type) {
      case "success":
        return "bg-green-900/20 border-green-500/30"
      case "error":
        return "bg-red-900/20 border-red-500/30"
      case "trade":
        return "bg-blue-900/20 border-blue-500/30"
      default:
        return "bg-slate-800/50 border-slate-700"
    }
  }

  return (
    <div className="fixed top-20 right-4 z-50 space-y-2 max-w-sm">
      {notifications.map((notification) => (
        <Card
          key={notification.id}
          className={`p-4 ${getBackgroundColor(notification.type)} backdrop-blur-sm animate-fade-in`}
        >
          <div className="flex items-start space-x-3">
            {getIcon(notification.type)}
            <div className="flex-1 min-w-0">
              <h4 className="text-white font-medium text-sm">{notification.title}</h4>
              <p className="text-slate-300 text-xs mt-1">{notification.message}</p>
              <p className="text-slate-500 text-xs mt-1">{notification.timestamp.toLocaleTimeString()}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRemove(notification.id)}
              className="text-slate-400 hover:text-white p-1 h-auto"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </Card>
      ))}
    </div>
  )
}

// Hook for managing notifications
export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])

  const addNotification = (notification: Omit<Notification, "id" | "timestamp">) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
      autoClose: notification.autoClose ?? true,
    }
    setNotifications((prev) => [newNotification, ...prev.slice(0, 4)]) // Keep max 5 notifications
  }

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  return { notifications, addNotification, removeNotification }
}
