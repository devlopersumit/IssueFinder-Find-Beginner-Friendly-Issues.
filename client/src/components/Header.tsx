import React from 'react'

type HeaderProps = {
  title?: string
  searchTerm: string
  onSearchTermChange: (value: string) => void
  onSubmitSearch: () => void
}

const Header: React.FC<HeaderProps> = ({ title = 'IssueHub', searchTerm, onSearchTermChange, onSubmitSearch }) => {
  return (
    <header className="w-full border-b bg-white">
      <div className="mx-auto max-w-7xl px-4 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">{title}</h1>
        <form
          className="flex items-center gap-3 w-full sm:w-auto"
          onSubmit={(e) => {
            e.preventDefault()
            onSubmitSearch()
          }}
        >
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchTermChange(e.target.value)}
            placeholder="Search issues..."
            className="w-full sm:w-56 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            Search
          </button>
        </form>
      </div>
    </header>
  )
}

export default Header


