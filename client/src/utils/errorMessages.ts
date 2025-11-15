export function getUserFriendlyError(error: Error | null): { title: string; message: string; action?: string } {
  if (!error) {
    return { title: 'Something went wrong', message: 'An unexpected error occurred.' }
  }

  const message = error.message.toLowerCase()

  if (message.includes('rate limit')) {
    return {
      title: 'Rate limit reached',
      message: 'GitHub API rate limit exceeded. Please wait a moment and try again.',
      action: 'Try again in a few seconds'
    }
  }

  if (message.includes('forbidden') || message.includes('access')) {
    return {
      title: 'Access restricted',
      message: 'Your search query might be too complex. Try removing some filters or simplifying your search.',
      action: 'Simplify filters'
    }
  }

  if (message.includes('network') || message.includes('fetch')) {
    return {
      title: 'Connection issue',
      message: 'Unable to connect to GitHub. Please check your internet connection and try again.',
      action: 'Retry'
    }
  }

  if (message.includes('timeout')) {
    return {
      title: 'Request timed out',
      message: 'The request took too long. This might be due to a complex search. Try simplifying your filters.',
      action: 'Simplify search'
    }
  }

  return {
    title: 'Unable to load issues',
    message: 'Something went wrong while fetching issues. Please try again.',
    action: 'Retry'
  }
}

