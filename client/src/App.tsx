import React, { useMemo, useState } from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import FiltersPanel from './components/FiltersPanel'
import IssueList from './components/IssueList'
import RepositoryList from './components/RepositoryList'
import Footer from './components/Footer'

type ViewMode = 'issues' | 'repositories'

const App: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('issues')
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [submittedSearch, setSubmittedSearch] = useState<string>('')
  const [selectedLabels, setSelectedLabels] = useState<string[]>(['good first issue'])
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>('javascript')
  const [showMobileFilters, setShowMobileFilters] = useState<boolean>(false)

  const toggleLabel = (label: string) => {
    setSelectedLabels((prev) => (prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]))
  }

  const onSubmitSearch = () => {
    setSubmittedSearch(searchTerm.trim())
  }

  const query = useMemo(() => {
    const parts: string[] = []
    if (submittedSearch) parts.push(submittedSearch)
    parts.push('state:open')
    selectedLabels.forEach((l) => parts.push(`label:"${l}"`))
    if (selectedLanguage) parts.push(`language:${selectedLanguage}`)
    return parts.join(' ')
  }, [submittedSearch, selectedLabels, selectedLanguage])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
      <Header
        title="IssueFinder"
        searchTerm={searchTerm}
        onSearchTermChange={setSearchTerm}
        onSubmitSearch={onSubmitSearch}
      />
      <Hero />
      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex gap-2 border-b border-gray-300 dark:border-gray-600">
            <button
              type="button"
              onClick={() => setViewMode('issues')}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                viewMode === 'issues'
                  ? 'border-slate-700 dark:border-slate-400 text-slate-900 dark:text-slate-100'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300'
              }`}
            >
              Issues
            </button>
            <button
              type="button"
              onClick={() => setViewMode('repositories')}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                viewMode === 'repositories'
                  ? 'border-slate-700 dark:border-slate-400 text-slate-900 dark:text-slate-100'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300'
              }`}
            >
              Repositories
            </button>
          </div>
          <div className="md:hidden">
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-1.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              onClick={() => setShowMobileFilters((v) => !v)}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              {showMobileFilters ? 'Hide Filters' : 'Show Filters'}
            </button>
          </div>
        </div>
        {showMobileFilters && (
          <div className="md:hidden mb-4">
            <FiltersPanel
              className="rounded-md"
              selectedLabels={selectedLabels}
              onToggleLabel={toggleLabel}
              selectedLanguage={selectedLanguage}
              onChangeLanguage={setSelectedLanguage}
              showTags={viewMode === 'issues'}
            />
          </div>
        )}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
          {viewMode === 'issues' && (
            <div className="hidden md:block md:col-span-3">
              <FiltersPanel
                className="rounded-md md:sticky md:top-4"
                selectedLabels={selectedLabels}
                onToggleLabel={toggleLabel}
                selectedLanguage={selectedLanguage}
                onChangeLanguage={setSelectedLanguage}
              />
            </div>
          )}
          {viewMode === 'repositories' && (
            <div className="hidden md:block md:col-span-3">
              <FiltersPanel
                className="rounded-md md:sticky md:top-4"
                selectedLabels={[]}
                onToggleLabel={() => {}}
                selectedLanguage={selectedLanguage}
                onChangeLanguage={setSelectedLanguage}
                showTags={false}
              />
            </div>
          )}
          <div className={viewMode === 'issues' ? 'md:col-span-9' : 'md:col-span-9'}>
            {viewMode === 'issues' ? (
              <IssueList className="rounded-md" query={query} />
            ) : (
              <RepositoryList className="rounded-md" language={selectedLanguage} />
            )}
          </div>
        </div>
      </main>
      <Footer
        githubUrl="https://github.com/devlopersumit"
        linkedinUrl="https://www.linkedin.com/in/sumit-jha?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
        twitterUrl="https://x.com/_sumitjha_?t=4nSWLPjfWOEhS06PoX9-Lg&s=09"
      />
    </div>
  )
}

export default App
