import { useEffect, useState } from 'react'

type RepositoryDetails = {
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
  open_issues_count: number
  language: string | null
  updated_at: string
  created_at: string
  pushed_at: string
  topics: string[]
  watchers_count: number
  default_branch: string
}

type GoodFirstIssue = {
  id: number
  number: number
  title: string
  html_url: string
  created_at: string
  labels: Array<{
    name: string
    color: string
  }>
  user: {
    login: string
  }
  comments: number
}

type UseFetchRepositoryDetailsResult = {
  repository: RepositoryDetails | null
  goodFirstIssues: GoodFirstIssue[]
  isLoading: boolean
  isLoadingIssues: boolean
  error: Error | null
}

export function useFetchRepositoryDetails(repoFullName: string | null): UseFetchRepositoryDetailsResult {
  const [repository, setRepository] = useState<RepositoryDetails | null>(null)
  const [goodFirstIssues, setGoodFirstIssues] = useState<GoodFirstIssue[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isLoadingIssues, setIsLoadingIssues] = useState<boolean>(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!repoFullName) {
      setRepository(null)
      setGoodFirstIssues([])
      return
    }

    async function fetchRepositoryDetails() {
      setIsLoading(true)
      setError(null)
      try {
        // Fetch repository details
        const repoUrl = `https://api.github.com/repos/${repoFullName}`
        const repoResponse = await fetch(repoUrl, {
          method: 'GET',
          headers: {
            Accept: 'application/vnd.github+json'
          }
        })

        if (!repoResponse.ok) {
          throw new Error(`GitHub API error: ${repoResponse.status} ${repoResponse.statusText}`)
        }

        const repoData: RepositoryDetails = await repoResponse.json()
        setRepository(repoData)

        // Fetch good-first-issue issues
        setIsLoadingIssues(true)
        const issuesUrl = `https://api.github.com/search/issues?q=repo:${repoFullName}+label:"good first issue"+state:open&sort=created&order=desc&per_page=10`
        const issuesResponse = await fetch(issuesUrl, {
          method: 'GET',
          headers: {
            Accept: 'application/vnd.github+json'
          }
        })

        if (issuesResponse.ok) {
          const issuesData = await issuesResponse.json()
          setGoodFirstIssues(issuesData.items || [])
        }
      } catch (err: unknown) {
        console.error('Error fetching repository details:', err)
        setError(err as Error)
      } finally {
        setIsLoading(false)
        setIsLoadingIssues(false)
      }
    }

    fetchRepositoryDetails()
  }, [repoFullName])

  return { repository, goodFirstIssues, isLoading, isLoadingIssues, error }
}

