"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Home } from "lucide-react"

// Move this outside the component to generate only once
const staticSessions = (() => {
  const sessions = []
  const baseSessionId = 29185948

  // Get next upcoming minute (xx:yy:00)
  const now = new Date()
  const nextMinute = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    now.getHours(),
    now.getMinutes() + 1,
    0,
    0,
  )

  for (let i = 0; i < 30; i++) {
    const sessionTime = new Date(nextMinute.getTime() + i * 60 * 1000)
    const sessionId = baseSessionId + i
    // Use a deterministic approach for consistent results
    const result = sessionId % 2 === 0 ? "Lên" : "Xuống"

    const startTime = sessionTime
      .toLocaleString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
      .replace(/(\d{2})\/(\d{2})\/(\d{4})/, "$1/$2/$3")

    const endTime = new Date(sessionTime.getTime() + 59 * 1000)
      .toLocaleString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
      .replace(/(\d{2})\/(\d{2})\/(\d{4})/, "$1/$2/$3")

    sessions.push({
      session: sessionId.toString(),
      result,
      startTime,
      endTime,
    })
  }

  return sessions
})()

export default function TradingSessionsPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const sessionsPerPage = 10
  const allSessions = staticSessions
  const totalPages = Math.ceil(allSessions.length / sessionsPerPage)
  const currentSessions = allSessions.slice(
    (currentPage - 1) * sessionsPerPage,
    currentPage * sessionsPerPage
  )

  // Get the current session (first in the list)
  const currentSessionData = allSessions[0]
  const [countdown, setCountdown] = useState(59)

  // Update countdown every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 0) {
          // When session ends, move to next session
          return 59
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Handle page navigation
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  return (
    <div className="container mx-auto p-4">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
        <Home className="h-4 w-4" />
        <span>/</span>
        <span>Phiên giao dịch</span>
      </div>

      {/* Current Session Display */}
      <div className="flex justify-center mb-8">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="space-y-4 text-center">
              <h1 className="text-2xl font-bold">Phiên hiện tại</h1>
              <div className="text-4xl font-bold text-blue-600">
                #{currentSessionData.session}
              </div>
              <div className="text-5xl font-bold text-red-600 my-4">
                {countdown}s
              </div>
              <div className="text-xl">
                Kết quả:{" "}
                <span 
                  className={`font-bold ${
                    currentSessionData.result === "Lên" 
                      ? "text-green-600" 
                      : "text-red-600"
                  }`}
                >
                  {currentSessionData.result}
                </span>
              </div>
              <div className="text-sm text-gray-500">
                {currentSessionData.startTime} - {currentSessionData.endTime}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sessions Table */}
      <Card className="mb-6">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-800">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phiên
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thời gian bắt đầu
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thời gian kết thúc
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kết quả
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                {currentSessions.map((session, index) => (
                  <tr 
                    key={session.session}
                    className={index % 2 === 0 ? 'bg-gray-50 dark:bg-gray-800' : 'bg-white dark:bg-gray-900'}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      #{session.session}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {session.startTime}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {session.endTime}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span 
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          session.result === "Lên" 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}
                      >
                        {session.result}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-700 dark:text-gray-300">
          Hiển thị <span className="font-medium">{(currentPage - 1) * sessionsPerPage + 1}</span> đến{" "}
          <span className="font-medium">
            {Math.min(currentPage * sessionsPerPage, allSessions.length)}
          </span>{" "}
          trong <span className="font-medium">{allSessions.length}</span> phiên
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            // Show first, last and current page with neighbors
            let pageNum: number | null = null;
            if (totalPages <= 5) {
              pageNum = i + 1;
            } else if (currentPage <= 3) {
              pageNum = i + 1;
            } else if (currentPage >= totalPages - 2) {
              pageNum = totalPages - 4 + i;
            } else {
              if (i === 0 || i === 4) {
                pageNum = i === 0 ? 1 : totalPages;
              } else {
                pageNum = currentPage - 2 + i;
              }
            }
            
            if (i === 1 && currentPage > 3 && totalPages > 5) {
              return <span key="ellipsis-start" className="px-3 py-1">...</span>;
            }
            if (i === 3 && currentPage < totalPages - 2 && totalPages > 5) {
              return <span key="ellipsis-end" className="px-3 py-1">...</span>;
            }
            
            return (
              <Button
                key={pageNum}
                variant={currentPage === pageNum ? "default" : "outline"}
                size="sm"
                onClick={() => goToPage(pageNum)}
              >
                {pageNum}
              </Button>
            );
          })}
          <Button
            variant="outline"
            size="sm"
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
