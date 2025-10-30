import React from 'react'

type FiltersPanelProps = {
  className?: string
  selectedLabels: string[]
  onToggleLabel: (label: string) => void
  selectedLanguage: string | null
  onChangeLanguage: (language: string | null) => void
}

const FiltersPanel: React.FC<FiltersPanelProps> = ({ className = '', selectedLabels, onToggleLabel, selectedLanguage, onChangeLanguage }) => {
  return (
    <aside className={`border-r bg-white ${className}`}>
      <div className="p-4">
        <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Filters</h2>
        <div className="mt-4 space-y-6">
          <div>
            <p className="text-xs font-medium text-gray-500">Labels</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {['good first issue', 'help wanted'].map((l) => {
                const active = selectedLabels.includes(l)
                return (
                  <button
                    key={l}
                    type="button"
                    onClick={() => onToggleLabel(l)}
                    className={`rounded-full px-3 py-1 text-xs ${active ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                  >
                    {l}
                  </button>
                )
              })}
            </div>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500">Languages</p>
            <div className="mt-2 space-y-2">
              {[
                { key: 'javascript', label: 'JavaScript' },
                { key: 'typescript', label: 'TypeScript' },
                { key: null as unknown as string, label: 'Any' }
              ].map((opt) => (
                <label key={String(opt.key)} className="flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="radio"
                    name="language"
                    className="h-4 w-4"
                    checked={(selectedLanguage ?? '') === (opt.key ?? '')}
                    onChange={() => onChangeLanguage(opt.key ?? null)}
                  />
                  {opt.label}
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}

export default FiltersPanel


