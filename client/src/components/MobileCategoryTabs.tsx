import React from 'react'

const ISSUE_CATEGORIES = [
  { key: 'all', label: 'All', icon: '🔍' },
  { key: 'good first issue', label: 'Good First', icon: '✨' },
  { key: 'help wanted', label: 'Help Wanted', icon: '🤝' },
  { key: 'bug', label: 'Bug', icon: '⚠️' },
  { key: 'enhancement', label: 'Enhancement', icon: '⚡' },
  { key: 'feature', label: 'Feature', icon: '🚀' },
  { key: 'documentation', label: 'Docs', icon: '📝' },
  { key: 'refactor', label: 'Refactor', icon: '♻️' },
  { key: 'performance', label: 'Performance', icon: '⚙️' },
  { key: 'testing', label: 'Testing', icon: '🧪' },
  { key: 'question', label: 'Question', icon: '❓' },
]

type MobileCategoryTabsProps = {
  selectedCategories: string[]
  onToggleCategory: (category: string) => void
}

const MobileCategoryTabs: React.FC<MobileCategoryTabsProps> = ({
  selectedCategories,
  onToggleCategory
}) => {
  const handleCategoryToggle = (category: string) => {
    if (category === 'all') {
      // Clear all categories
      selectedCategories.forEach(c => onToggleCategory(c))
    } else {
      // Toggle this category and remove 'all' if it was selected
      if (selectedCategories.includes('all')) {
        onToggleCategory('all')
      }
      onToggleCategory(category)
    }
  }

  return (
    <div className="md:hidden mb-4 -mx-4 px-4">
      <div className="overflow-x-auto pb-2 scrollbar-hide">
        <div className="flex gap-2 min-w-max">
          {ISSUE_CATEGORIES.map((cat) => {
            const active = selectedCategories.includes(cat.key) || (cat.key === 'all' && selectedCategories.length === 0)
            return (
              <button
                key={cat.key}
                type="button"
                onClick={() => handleCategoryToggle(cat.key)}
                className={`flex-shrink-0 flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-medium transition-colors whitespace-nowrap ${
                  active 
                    ? 'bg-slate-700 dark:bg-slate-600 text-white shadow-md' 
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600'
                }`}
              >
                <span className="text-sm">{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default MobileCategoryTabs
