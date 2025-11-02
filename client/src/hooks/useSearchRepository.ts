import { useEffect, useState } from 'react'

type Repository = {
  id: number
  full_name: string
  name: string
  owner: {
    login: string
    avatar_url: string
  }
  html_url: string
  description: string | null
  stargazers_count: number
  forks_count: number
  language: string | null
  open_issues_count: number
  updated_at: string
  topics: string[]
}

type SearchRepositoriesResponse = {
  total_count: number
  incomplete_results: boolean
  items: Repository[]
}

type UseSearchRepositoryResult = {
  results: Repository[]
  isLoading: boolean
  error: Error | null
}

export function useSearchRepository(searchQuery: string | null): UseSearchRepositoryResult {
  const [results, setResults] = useState<Repository[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!searchQuery || searchQuery.trim().length < 2) {
      setResults([])
      setIsLoading(false)
      return
    }

    const trimmedQuery = searchQuery.trim()

    async function searchRepository() {
      setIsLoading(true)
      setError(null)
      try {
        // Check if it's in owner/repo format
        const ownerRepoMatch = trimmedQuery.match(/^([a-zA-Z0-9._-]+)\/([a-zA-Z0-9._-]+)$/)
        
        let url: string
        if (ownerRepoMatch) {
          // Direct repository search
          url = `https://api.github.com/search/repositories?q=${encodeURIComponent(trimmedQuery)}+in:name&sort=stars&order=desc&per_page=10`
        } else {
          // General repository search
          url = `https://api.github.com/search/repositories?q=${encodeURIComponent(trimmedQuery)}+in:name&sort=stars&order=desc&per_page=10`
        }

        const response = await fetch(url, {
          method: 'GET',
          headers: {
            Accept: 'application/vnd.github+json'
          }
        })

        if (!response.ok) {
          throw new Error(`GitHub API error: ${response.status} ${response.statusText}`)
        }

        const data: SearchRepositoriesResponse = await response.json()
        setResults(data.items || [])
      } catch (err: unknown) {
        console.error('Error searching repositories:', err)
        setError(err as Error)
        setResults([])
      } finally {
        setIsLoading(false)
      }
    }

    const timeoutId = setTimeout(() => {
      searchRepository()
    }, 500) // Debounce search

    return () => clearTimeout(timeoutId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery])

  return { results, isLoading, error }
}

