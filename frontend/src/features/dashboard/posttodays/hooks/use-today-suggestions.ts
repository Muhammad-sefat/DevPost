import { useEffect, useState, useCallback } from "react"
import { getTodaySuggestionsApi, PostSuggestion } from "../api/suggestions.api"

export function useTodaySuggestions() {
  const [suggestions, setSuggestions] = useState<PostSuggestion[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchSuggestions = useCallback(async (regenerate = false) => {
    setLoading(true)
    setError(null)
    try {
      const response = await getTodaySuggestionsApi(regenerate)
      if (response.success && Array.isArray(response.data)) {
        setSuggestions(response.data)
      } else {
        setSuggestions([])
      }
    } catch (err: any) {
      console.error("Failed to load post suggestions:", err)
      setError(err.response?.data?.message || err.message || "Failed to load suggestions")
      setSuggestions([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchSuggestions()
  }, [fetchSuggestions])

  return {
    suggestions,
    loading,
    error,
    refetch: fetchSuggestions,
  }
}
