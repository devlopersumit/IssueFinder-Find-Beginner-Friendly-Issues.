import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import BountyIssues from '../components/BountyIssues'
import FiltersPanel from '../components/FiltersPanel'
import { useSearch } from '../contexts/SearchContext'
import { useFilterPreferences } from '../contexts/FilterPreferencesContext'

const BountyIssuesPage: React.FC = () => {
  const [refreshKey, setRefreshKey] = useState(0)
  const [showMobileFilters, setShowMobileFilters] = useState<boolean>(false)
  const { submittedSearch } = useSearch()
  const { 
    preferences,
    updateCurrency,
    updateLocation
  } = useFilterPreferences()
  
  // Get filters from preferences
  const currencyFilter = preferences.currency
  const locationFilter = preferences.location

  // Force remount when component mounts
  useEffect(() => {
    setRefreshKey(prev => prev + 1)
  }, [])

  // If user has searched, show a message suggesting they use the search page
  useEffect(() => {
    if (submittedSearch && submittedSearch.trim()) {
      // Search is handled globally - if they want to search, they should use the search page
      // But we can still show bounty issues filtered by search if needed
    }
  }, [submittedSearch])

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Bounty Issues
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Discover unsolved bounty issues with cash prizes and rewards. Fix them and earn money!
          </p>
          {submittedSearch && (
            <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
              💡 Looking for "{submittedSearch}"? Try the <Link to="/search" className="underline font-semibold">search page</Link> for more results.
            </p>
          )}
        </div>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Home
        </Link>
      </div>

      <div className="mb-4 md:hidden">
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-1.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
          onClick={() => setShowMobileFilters((v) => !v)}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          {showMobileFilters ? 'Hide Filters' : 'Show Filters'}
        </button>
      </div>

      {showMobileFilters && (
        <div className="md:hidden mb-4">
          <FiltersPanel
            className="rounded-md"
            selectedLabels={[]}
            onToggleLabel={() => {}}
            selectedLanguage={null}
            onChangeLanguage={() => {}}
            showTags={false}
            selectedLocation={locationFilter}
            onChangeLocation={updateLocation}
            selectedCurrency={currencyFilter}
            onChangeCurrency={updateCurrency}
            showCurrencyFilter={true}
          />
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
        <div className="hidden md:block md:col-span-3">
          <FiltersPanel
            className="rounded-md md:sticky md:top-4"
            selectedLabels={[]}
            onToggleLabel={() => {}}
            selectedLanguage={null}
            onChangeLanguage={() => {}}
            showTags={false}
            selectedLocation={locationFilter}
            onChangeLocation={updateLocation}
            selectedCurrency={currencyFilter}
            onChangeCurrency={updateCurrency}
            showCurrencyFilter={true}
          />
        </div>
        <div className="md:col-span-9">
          {/* Key ensures component remounts and fetches fresh data */}
          <BountyIssues 
            key={`bounty-${refreshKey}`} 
            currencyFilter={currencyFilter}
            locationFilter={locationFilter}
          />
        </div>
      </div>
    </main>
  )
}

export default BountyIssuesPage

