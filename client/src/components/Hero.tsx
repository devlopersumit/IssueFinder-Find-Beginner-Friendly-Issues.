import React from 'react'

const Hero: React.FC = () => {
  return (
    <section className="bg-slate-50 dark:bg-gray-950 border-b border-gray-300 dark:border-gray-700 transition-colors duration-200">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:py-12">
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-3">
            Start Your <span className="text-slate-700 dark:text-slate-300">Open Source</span> Journey
          </h2>
          <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto mb-6">
            Discover the best GitHub issues and repositories to contribute to. Whether you're a beginner or an experienced developer, 
            IssueFinder helps you find the perfect opportunities filtered by category, language, and your interests.
          </p>
          <div className="flex flex-wrap justify-center gap-3 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-2 bg-white dark:bg-gray-900 px-3 py-2 rounded border border-gray-300 dark:border-gray-700 transition-colors duration-200">
              <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>All Issue Types</span>
            </div>
            <div className="flex items-center gap-2 bg-white dark:bg-gray-900 px-3 py-2 rounded border border-gray-300 dark:border-gray-700 transition-colors duration-200">
              <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
              </svg>
              <span>Unassigned Only</span>
            </div>
            <div className="flex items-center gap-2 bg-white dark:bg-gray-900 px-3 py-2 rounded border border-gray-300 dark:border-gray-700 transition-colors duration-200">
              <svg className="w-4 h-4 text-slate-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
              </svg>
              <span>20+ Languages</span>
            </div>
            <div className="flex items-center gap-2 bg-white dark:bg-gray-900 px-3 py-2 rounded border border-gray-300 dark:border-gray-700 transition-colors duration-200">
              <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              <span>Curated Repositories</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero

