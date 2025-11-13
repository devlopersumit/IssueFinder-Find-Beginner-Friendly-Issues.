import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import type { ReactNode } from 'react'
import type { NaturalLanguage } from '../utils/languageDetection'
import type { Currency } from '../utils/currencyDetection'
import type { LocationFilter } from '../utils/locationDetection'
import { getBrowserLanguage } from '../utils/languageDetection'
import { detectCurrencyFromLocale } from '../utils/currencyDetection'
import { detectLocationFromIP, getLocationFromLocale } from '../utils/locationDetection'

type FilterPreferences = {
  // Language filter
  naturalLanguages: NaturalLanguage[]
  
  // Location filter
  location: LocationFilter | null
  
  // Currency filter (for bounties)
  currency: Currency | null
  
  // Other filters (for future use)
  selectedLanguage: string | null
  selectedDifficulty: string | null
  selectedType: string | null
  selectedFramework: string | null
  selectedLastActivity: string | null
  selectedLicense: string | null
}

type FilterPreferencesContextType = {
  preferences: FilterPreferences
  updateNaturalLanguages: (languages: NaturalLanguage[]) => void
  updateLocation: (location: LocationFilter | null) => void
  updateCurrency: (currency: Currency | null) => void
  updateSelectedLanguage: (language: string | null) => void
  updateSelectedDifficulty: (difficulty: string | null) => void
  updateSelectedType: (type: string | null) => void
  updateSelectedFramework: (framework: string | null) => void
  updateSelectedLastActivity: (activity: string | null) => void
  updateSelectedLicense: (license: string | null) => void
  clearAllPreferences: () => void
  isDetectingLocation: boolean
}

const FilterPreferencesContext = createContext<FilterPreferencesContextType | undefined>(undefined)

const STORAGE_KEY = 'issueFinder_filterPreferences'

const DEFAULT_PREFERENCES: FilterPreferences = {
  naturalLanguages: [],
  location: null,
  currency: null,
  selectedLanguage: null,
  selectedDifficulty: null,
  selectedType: null,
  selectedFramework: null,
  selectedLastActivity: null,
  selectedLicense: null
}

/**
 * Loads preferences from localStorage
 */
function loadPreferences(): FilterPreferences {
  if (typeof window === 'undefined') {
    return DEFAULT_PREFERENCES
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      // Merge with defaults to handle missing fields
      return { ...DEFAULT_PREFERENCES, ...parsed }
    }
  } catch (error) {
    console.error('Error loading filter preferences:', error)
  }

  return DEFAULT_PREFERENCES
}

/**
 * Saves preferences to localStorage
 */
function savePreferences(preferences: FilterPreferences): void {
  if (typeof window === 'undefined') {
    return
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences))
  } catch (error) {
    console.error('Error saving filter preferences:', error)
  }
}

export const FilterPreferencesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [preferences, setPreferences] = useState<FilterPreferences>(loadPreferences)
  const [isDetectingLocation, setIsDetectingLocation] = useState<boolean>(false)

  // Auto-detect preferences on mount if not set
  // IMPORTANT: These are EDITABLE DEFAULTS, not enforced values
  // Once a user manually edits a preference, it's saved and won't be overwritten
  useEffect(() => {
    const initializePreferences = async () => {
      const currentPrefs = loadPreferences()
      let updated = false
      const newPrefs = { ...currentPrefs }

      // Step 1: Auto-detect location from IP (this is the primary source)
      // This happens automatically on the issues/home page - no opt-in required
      // User can always edit/change this value - it's just a helpful default
      if (!newPrefs.location) {
        setIsDetectingLocation(true)
        try {
          const detectedLocation = await detectLocationFromIP()
          if (detectedLocation) {
            newPrefs.location = {
              country: detectedLocation.country,
              countryCode: detectedLocation.countryCode
            }
            updated = true
            
            // Step 2: Use detected country to auto-configure currency (for bounty section)
            // This is an EDITABLE DEFAULT - user can change it anytime
            if (!newPrefs.currency) {
              const { detectCurrencyFromCountry } = await import('../utils/currencyDetection')
              const detectedCurrency = detectCurrencyFromCountry(detectedLocation.countryCode)
              newPrefs.currency = detectedCurrency
              updated = true
            }
            
            // Step 3: Use detected country to auto-configure language (for issues section)
            // This is an EDITABLE DEFAULT - user can change it anytime
            // Map country codes to common languages
            if (newPrefs.naturalLanguages.length === 0) {
              const countryToLanguage: Record<string, NaturalLanguage> = {
                'US': 'en', 'GB': 'en', 'CA': 'en', 'AU': 'en', 'NZ': 'en', 'IE': 'en',
                'CN': 'zh', 'TW': 'zh', 'HK': 'zh', 'SG': 'en', // Singapore uses English
                'JP': 'ja',
                'KR': 'ko',
                'ES': 'es', 'MX': 'es', 'AR': 'es', 'CO': 'es', 'CL': 'es', 'PE': 'es', 'VE': 'es',
                'FR': 'fr', 'BE': 'fr', 'CH': 'fr', 'CA': 'en', // Canada uses English primarily
                'DE': 'de', 'AT': 'de', 'CH': 'de', // Switzerland uses German
                'PT': 'pt', 'BR': 'pt',
                'RU': 'ru',
                'SA': 'ar', 'AE': 'ar', 'EG': 'ar', 'IQ': 'ar', 'JO': 'ar', 'KW': 'ar', 'LB': 'ar', 'OM': 'ar', 'QA': 'ar', 'SY': 'ar', 'YE': 'ar',
                'IN': 'hi',
              }
              
              const detectedLang = countryToLanguage[detectedLocation.countryCode] || getBrowserLanguage()
              newPrefs.naturalLanguages = [detectedLang]
              updated = true
            }
          } else {
            // Fallback to locale-based detection if IP detection fails
            const localeLocation = getLocationFromLocale()
            if (localeLocation) {
              newPrefs.location = {
                country: localeLocation.country,
                countryCode: localeLocation.countryCode
              }
              updated = true
              
              // Also set currency from locale
              if (!newPrefs.currency) {
                const { detectCurrencyFromCountry } = await import('../utils/currencyDetection')
                const detectedCurrency = detectCurrencyFromCountry(localeLocation.countryCode)
                newPrefs.currency = detectedCurrency
                updated = true
              }
            }
          }
        } catch (error) {
          console.warn('Failed to detect location from IP:', error)
          // Fallback to locale
          const localeLocation = getLocationFromLocale()
          if (localeLocation) {
            newPrefs.location = {
              country: localeLocation.country,
              countryCode: localeLocation.countryCode
            }
            updated = true
          }
        } finally {
          setIsDetectingLocation(false)
        }
      }

      // Fallback: Auto-detect browser language if still not set
      if (newPrefs.naturalLanguages.length === 0) {
        const browserLang = getBrowserLanguage()
        newPrefs.naturalLanguages = [browserLang]
        updated = true
      }

      // Fallback: Auto-detect currency from locale if still not set
      if (!newPrefs.currency) {
        const detectedCurrency = detectCurrencyFromLocale()
        newPrefs.currency = detectedCurrency
        updated = true
      }

      if (updated) {
        setPreferences(newPrefs)
        savePreferences(newPrefs)
      }
    }

    initializePreferences()
  }, [])

  // Save preferences whenever they change
  useEffect(() => {
    savePreferences(preferences)
  }, [preferences])

  const updateNaturalLanguages = useCallback((languages: NaturalLanguage[]) => {
    setPreferences(prev => ({ ...prev, naturalLanguages: languages }))
  }, [])

  const updateLocation = useCallback((location: LocationFilter | null) => {
    setPreferences(prev => ({ ...prev, location }))
    // User has manually edited location - this is fine, it's editable
  }, [])

  const updateCurrency = useCallback((currency: Currency | null) => {
    setPreferences(prev => ({ ...prev, currency }))
  }, [])

  const updateSelectedLanguage = useCallback((language: string | null) => {
    setPreferences(prev => ({ ...prev, selectedLanguage: language }))
  }, [])

  const updateSelectedDifficulty = useCallback((difficulty: string | null) => {
    setPreferences(prev => ({ ...prev, selectedDifficulty: difficulty }))
  }, [])

  const updateSelectedType = useCallback((type: string | null) => {
    setPreferences(prev => ({ ...prev, selectedType: type }))
  }, [])

  const updateSelectedFramework = useCallback((framework: string | null) => {
    setPreferences(prev => ({ ...prev, selectedFramework: framework }))
  }, [])

  const updateSelectedLastActivity = useCallback((activity: string | null) => {
    setPreferences(prev => ({ ...prev, selectedLastActivity: activity }))
  }, [])

  const updateSelectedLicense = useCallback((license: string | null) => {
    setPreferences(prev => ({ ...prev, selectedLicense: license }))
  }, [])

  const clearAllPreferences = useCallback(() => {
    const cleared = { ...DEFAULT_PREFERENCES }
    // Keep auto-detected values
    const browserLang = getBrowserLanguage()
    cleared.naturalLanguages = [browserLang]
    cleared.currency = detectCurrencyFromLocale()
    setPreferences(cleared)
    savePreferences(cleared)
  }, [])

  return (
    <FilterPreferencesContext.Provider
      value={{
        preferences,
        updateNaturalLanguages,
        updateLocation,
        updateCurrency,
        updateSelectedLanguage,
        updateSelectedDifficulty,
        updateSelectedType,
        updateSelectedFramework,
        updateSelectedLastActivity,
        updateSelectedLicense,
        clearAllPreferences,
        isDetectingLocation
      }}
    >
      {children}
    </FilterPreferencesContext.Provider>
  )
}

export const useFilterPreferences = () => {
  const context = useContext(FilterPreferencesContext)
  if (context === undefined) {
    throw new Error('useFilterPreferences must be used within a FilterPreferencesProvider')
  }
  return context
}

