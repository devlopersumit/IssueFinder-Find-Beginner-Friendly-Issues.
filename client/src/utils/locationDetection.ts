export type Location = {
  country: string
  countryCode: string
  region?: string
  city?: string
}

export type LocationFilter = {
  country?: string
  countryCode?: string
  region?: string
}

/**
 * Detects user location from IP address using a free geolocation API
 * Falls back to browser locale if API fails
 */
export async function detectLocationFromIP(): Promise<Location | null> {
  try {
    // Try using ipapi.co (free tier: 1000 requests/day)
    const response = await fetch('https://ipapi.co/json/', {
      method: 'GET',
      headers: {
        Accept: 'application/json'
      }
    })

    if (response.ok) {
      const data = await response.json()
      if (data.country_code && data.country_name) {
        return {
          country: data.country_name,
          countryCode: data.country_code,
          region: data.region,
          city: data.city
        }
      }
    }
  } catch (error) {
    console.warn('Failed to detect location from IP:', error)
  }

  // Fallback: try ip-api.com (free tier: 45 requests/minute)
  // Note: ip-api.com doesn't support HTTPS on free tier, so we skip this fallback
  // and rely on the first API or locale-based detection
  // If needed, a CORS proxy or alternative HTTPS service could be used here

  return null
}

/**
 * Gets location from browser locale as fallback
 */
export function getLocationFromLocale(): Location | null {
  if (typeof navigator === 'undefined') {
    return null
  }

  try {
    // Try to get country from timezone
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
    // This is a simple heuristic - timezone can give us region info
    const locale = navigator.language || 'en-US'
    const parts = locale.split('-')
    
    if (parts.length > 1) {
      const countryCode = parts[1].toUpperCase()
      // Map common country codes to country names
      const countryNames: Record<string, string> = {
        'US': 'United States',
        'GB': 'United Kingdom',
        'CA': 'Canada',
        'AU': 'Australia',
        'DE': 'Germany',
        'FR': 'France',
        'IT': 'Italy',
        'ES': 'Spain',
        'BR': 'Brazil',
        'IN': 'India',
        'CN': 'China',
        'JP': 'Japan',
        'KR': 'South Korea',
        'MX': 'Mexico',
        'NL': 'Netherlands',
        'SE': 'Sweden',
        'NO': 'Norway',
        'DK': 'Denmark',
        'FI': 'Finland',
        'PL': 'Poland',
        'RU': 'Russia',
        'TR': 'Turkey',
        'SA': 'Saudi Arabia',
        'AE': 'United Arab Emirates',
        'SG': 'Singapore',
        'NZ': 'New Zealand',
        'IE': 'Ireland',
        'PT': 'Portugal',
        'GR': 'Greece',
        'BE': 'Belgium',
        'CH': 'Switzerland',
        'AT': 'Austria',
        'CZ': 'Czech Republic',
        'HU': 'Hungary',
        'RO': 'Romania',
        'BG': 'Bulgaria',
        'HR': 'Croatia',
        'SK': 'Slovakia',
        'SI': 'Slovenia',
        'EE': 'Estonia',
        'LV': 'Latvia',
        'LT': 'Lithuania',
        'LU': 'Luxembourg',
        'IS': 'Iceland',
        'MT': 'Malta',
        'CY': 'Cyprus'
      }

      const countryName = countryNames[countryCode] || countryCode
      return {
        country: countryName,
        countryCode: countryCode
      }
    }
  } catch (error) {
    console.warn('Failed to get location from locale:', error)
  }

  return null
}

/**
 * Popular countries list for location filter dropdown
 */
export const POPULAR_COUNTRIES = [
  { code: '', name: 'Any Location' },
  { code: 'US', name: 'United States' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'CA', name: 'Canada' },
  { code: 'AU', name: 'Australia' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'IT', name: 'Italy' },
  { code: 'ES', name: 'Spain' },
  { code: 'BR', name: 'Brazil' },
  { code: 'IN', name: 'India' },
  { code: 'CN', name: 'China' },
  { code: 'JP', name: 'Japan' },
  { code: 'KR', name: 'South Korea' },
  { code: 'MX', name: 'Mexico' },
  { code: 'NL', name: 'Netherlands' },
  { code: 'SE', name: 'Sweden' },
  { code: 'NO', name: 'Norway' },
  { code: 'DK', name: 'Denmark' },
  { code: 'FI', name: 'Finland' },
  { code: 'PL', name: 'Poland' },
  { code: 'RU', name: 'Russia' },
  { code: 'TR', name: 'Turkey' },
  { code: 'SA', name: 'Saudi Arabia' },
  { code: 'AE', name: 'United Arab Emirates' },
  { code: 'SG', name: 'Singapore' },
  { code: 'NZ', name: 'New Zealand' },
  { code: 'IE', name: 'Ireland' },
  { code: 'PT', name: 'Portugal' },
  { code: 'GR', name: 'Greece' },
  { code: 'BE', name: 'Belgium' },
  { code: 'CH', name: 'Switzerland' },
  { code: 'AT', name: 'Austria' },
  { code: 'CZ', name: 'Czech Republic' },
  { code: 'HU', name: 'Hungary' },
  { code: 'RO', name: 'Romania' },
  { code: 'BG', name: 'Bulgaria' },
  { code: 'HR', name: 'Croatia' },
  { code: 'SK', name: 'Slovakia' },
  { code: 'SI', name: 'Slovenia' },
  { code: 'EE', name: 'Estonia' },
  { code: 'LV', name: 'Latvia' },
  { code: 'LT', name: 'Lithuania' },
  { code: 'LU', name: 'Luxembourg' },
  { code: 'IS', name: 'Iceland' },
  { code: 'MT', name: 'Malta' },
  { code: 'CY', name: 'Cyprus' }
]

/**
 * Filters issues/bounties by location
 * Note: Since GitHub issues don't have explicit location data,
 * this filters based on repository owner location or issue content mentions
 */
export function filterByLocation<T extends { repository_url?: string; title?: string; body?: string }>(
  items: T[],
  locationFilter: LocationFilter
): T[] {
  if (!locationFilter.countryCode || locationFilter.countryCode === '') {
    return items // Show all if no location filter
  }

  // For now, we'll filter based on repository URL patterns or content mentions
  // This is a heuristic approach since GitHub doesn't provide location data
  return items.filter(item => {
    // Check if repository URL or content mentions the country
    const searchText = `${item.repository_url || ''} ${item.title || ''} ${item.body || ''}`.toLowerCase()
    const countryName = POPULAR_COUNTRIES.find(c => c.code === locationFilter.countryCode)?.name.toLowerCase() || ''
    const countryCode = locationFilter.countryCode.toLowerCase()

    // Simple keyword matching (can be enhanced with better heuristics)
    return searchText.includes(countryName) || 
           searchText.includes(countryCode) ||
           // Also check for common country-specific terms
           (locationFilter.countryCode === 'US' && (searchText.includes('usa') || searchText.includes('united states'))) ||
           (locationFilter.countryCode === 'GB' && (searchText.includes('uk') || searchText.includes('united kingdom'))) ||
           (locationFilter.countryCode === 'CA' && searchText.includes('canada'))
  })
}

