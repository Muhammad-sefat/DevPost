import { useEffect, useState, useCallback } from "react"
import { getTodayActivityApi } from "../api/activity.api"
import { TodayActivity } from "../types"

export function useTodayActivity() {
  const [activity, setActivity] = useState<TodayActivity | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchActivity = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await getTodayActivityApi()
      if (response.success && response.data) {
        setActivity(response.data)
      } else {
        setActivity(null)
      }
    } catch (err: any) {
      console.error("Failed to load today's activity:", err)
      setError(err.response?.data?.message || err.message || "Failed to load activity")
      setActivity(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchActivity()
  }, [fetchActivity])

  return {
    activity,
    loading,
    error,
    refetch: fetchActivity,
  }
}
