import { useEffect, useRef, useState } from 'react'

type GithubRepository = {
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

type GithubRepositoriesResponse = {
  total_count: number
  incomplete_results: boolean
  items: GithubRepository[]
}

type UseFetchRepositoriesResult = {
  data: GithubRepositoriesResponse | null
  isLoading: boolean
  error: Error | null
}

export function useFetchRepositories(
  language: string | null,
  sort: 'stars' | 'updated' | 'forks' = 'stars',
  page: number = 1,
  perPage: number = 20
): UseFetchRepositoriesResult {
  const [data, setData] = useState<GithubRepositoriesResponse | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<Error | null>(null)
  const abortRef = useRef<AbortController | null>(null)

  useEffect(() => {
    if (abortRef.current) {
      abortRef.current.abort()
    }
    const controller = new AbortController()
    abortRef.current = controller

    async function fetchRepositories() {
      setIsLoading(true)
      setError(null)
      try {
        // Search for repositories that are good for beginners
        // Focus on quality repos that are likely to have beginner-friendly issues
        let queryParts: string[] = []
        
        // Add language filter if selected
        if (language) {
          queryParts.push(`language:${language}`)
        }
        
        // Add quality filters - ensure minimum engagement
        queryParts.push('forks:>=10')
        queryParts.push('stars:>=50')
        queryParts.push('archived:false') // Only active repos
        
        // Join with spaces - encodeURIComponent will handle URL encoding
        const query = queryParts.join(' ')
        const url = `https://api.github.com/search/repositories?q=${encodeURIComponent(query)}&sort=${sort}&order=desc&page=${page}&per_page=${perPage}`
        
        console.log('Fetching repositories with query:', query)
        console.log('Full URL:', url)

        const response = await fetch(url, {
          method: 'GET',
          headers: {
            Accept: 'application/vnd.github+json'
          },
          signal: controller.signal
        })

        if (!response.ok) {
          const errorText = await response.text()
          console.error('GitHub API error:', response.status, response.statusText, errorText)
          throw new Error(`GitHub API error: ${response.status} ${response.statusText}`)
        }

        const json: GithubRepositoriesResponse = await response.json()
        setData(json)
      } catch (err: unknown) {
        if ((err as any)?.name === 'AbortError') return
        console.error('Error fetching repositories:', err)
        setError(err as Error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchRepositories()

    return () => {
      controller.abort()
    }
  }, [language, sort, page, perPage])

  return { data, isLoading, error }
}

