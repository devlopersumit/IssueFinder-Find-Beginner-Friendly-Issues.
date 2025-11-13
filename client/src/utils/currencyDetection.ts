export type Currency = 'USD' | 'EUR' | 'GBP' | 'JPY' | 'CNY' | 'INR' | 'CAD' | 'AUD' | 'CHF' | 'SEK' | 'NOK' | 'DKK' | 'PLN' | 'BRL' | 'MXN' | 'KRW' | 'SGD' | 'HKD' | 'NZD' | 'ZAR' | 'RUB' | 'TRY' | 'AED' | 'SAR' | 'BTC' | 'ETH' | 'OTHER'

export const CURRENCY_NAMES: Record<Currency, string> = {
  USD: 'US Dollar ($)',
  EUR: 'Euro (€)',
  GBP: 'British Pound (£)',
  JPY: 'Japanese Yen (¥)',
  CNY: 'Chinese Yuan (¥)',
  INR: 'Indian Rupee (₹)',
  CAD: 'Canadian Dollar ($)',
  AUD: 'Australian Dollar ($)',
  CHF: 'Swiss Franc (CHF)',
  SEK: 'Swedish Krona (kr)',
  NOK: 'Norwegian Krone (kr)',
  DKK: 'Danish Krone (kr)',
  PLN: 'Polish Złoty (zł)',
  BRL: 'Brazilian Real (R$)',
  MXN: 'Mexican Peso ($)',
  KRW: 'South Korean Won (₩)',
  SGD: 'Singapore Dollar ($)',
  HKD: 'Hong Kong Dollar ($)',
  NZD: 'New Zealand Dollar ($)',
  ZAR: 'South African Rand (R)',
  RUB: 'Russian Ruble (₽)',
  TRY: 'Turkish Lira (₺)',
  AED: 'UAE Dirham (د.إ)',
  SAR: 'Saudi Riyal (﷼)',
  BTC: 'Bitcoin (₿)',
  ETH: 'Ethereum (Ξ)',
  OTHER: 'Other'
}

/**
 * Maps country codes to default currencies
 */
const COUNTRY_TO_CURRENCY: Record<string, Currency> = {
  'US': 'USD',
  'GB': 'GBP',
  'CA': 'CAD',
  'AU': 'AUD',
  'DE': 'EUR',
  'FR': 'EUR',
  'IT': 'EUR',
  'ES': 'EUR',
  'NL': 'EUR',
  'BE': 'EUR',
  'AT': 'EUR',
  'PT': 'EUR',
  'IE': 'EUR',
  'FI': 'EUR',
  'GR': 'EUR',
  'LU': 'EUR',
  'MT': 'EUR',
  'CY': 'EUR',
  'SK': 'EUR',
  'SI': 'EUR',
  'EE': 'EUR',
  'LV': 'EUR',
  'LT': 'EUR',
  'JP': 'JPY',
  'CN': 'CNY',
  'IN': 'INR',
  'BR': 'BRL',
  'MX': 'MXN',
  'KR': 'KRW',
  'SG': 'SGD',
  'HK': 'HKD',
  'NZ': 'NZD',
  'ZA': 'ZAR',
  'RU': 'RUB',
  'TR': 'TRY',
  'AE': 'AED',
  'SA': 'SAR',
  'CH': 'CHF',
  'SE': 'SEK',
  'NO': 'NOK',
  'DK': 'DKK',
  'PL': 'PLN'
}

/**
 * Detects currency from country code
 */
export function detectCurrencyFromCountry(countryCode: string): Currency {
  return COUNTRY_TO_CURRENCY[countryCode.toUpperCase()] || 'USD'
}

/**
 * Detects currency from browser locale
 */
export function detectCurrencyFromLocale(): Currency {
  if (typeof navigator === 'undefined') {
    return 'USD'
  }

  try {
    const locale = navigator.language || 'en-US'
    const parts = locale.split('-')
    
    if (parts.length > 1) {
      const countryCode = parts[1].toUpperCase()
      return detectCurrencyFromCountry(countryCode)
    }
  } catch (error) {
    console.warn('Failed to detect currency from locale:', error)
  }

  return 'USD'
}

/**
 * Extracts currency from text content (bounty issue title/body)
 * Returns array of detected currencies
 */
export function extractCurrenciesFromText(text: string): Currency[] {
  if (!text || text.trim().length === 0) {
    return []
  }

  const textLower = text.toLowerCase()
  const detectedCurrencies: Set<Currency> = new Set()

  // Currency symbols and patterns
  const currencyPatterns: Array<{ pattern: RegExp; currency: Currency }> = [
    { pattern: /\$|usd|dollar/i, currency: 'USD' },
    { pattern: /€|eur|euro/i, currency: 'EUR' },
    { pattern: /£|gbp|pound/i, currency: 'GBP' },
    { pattern: /¥|jpy|yen/i, currency: 'JPY' },
    { pattern: /¥|cny|yuan/i, currency: 'CNY' },
    { pattern: /₹|inr|rupee/i, currency: 'INR' },
    { pattern: /cad|canadian dollar/i, currency: 'CAD' },
    { pattern: /aud|australian dollar/i, currency: 'AUD' },
    { pattern: /chf|swiss franc/i, currency: 'CHF' },
    { pattern: /sek|swedish krona/i, currency: 'SEK' },
    { pattern: /nok|norwegian krone/i, currency: 'NOK' },
    { pattern: /dkk|danish krone/i, currency: 'DKK' },
    { pattern: /pln|polish złoty|zł/i, currency: 'PLN' },
    { pattern: /r\$|brl|brazilian real/i, currency: 'BRL' },
    { pattern: /mxn|mexican peso/i, currency: 'MXN' },
    { pattern: /₩|krw|korean won/i, currency: 'KRW' },
    { pattern: /sgd|singapore dollar/i, currency: 'SGD' },
    { pattern: /hkd|hong kong dollar/i, currency: 'HKD' },
    { pattern: /nzd|new zealand dollar/i, currency: 'NZD' },
    { pattern: /zar|south african rand/i, currency: 'ZAR' },
    { pattern: /₽|rub|russian ruble/i, currency: 'RUB' },
    { pattern: /₺|try|turkish lira/i, currency: 'TRY' },
    { pattern: /د\.إ|aed|uae dirham/i, currency: 'AED' },
    { pattern: /﷼|sar|saudi riyal/i, currency: 'SAR' },
    { pattern: /₿|btc|bitcoin/i, currency: 'BTC' },
    { pattern: /Ξ|eth|ethereum/i, currency: 'ETH' }
  ]

  // Check for currency patterns
  for (const { pattern, currency } of currencyPatterns) {
    if (pattern.test(text)) {
      detectedCurrencies.add(currency)
    }
  }

  // Also check for explicit currency mentions with amounts
  const amountPattern = /(\d+[,\d]*\.?\d*)\s*(usd|eur|gbp|jpy|cny|inr|cad|aud|chf|sek|nok|dkk|pln|brl|mxn|krw|sgd|hkd|nzd|zar|rub|try|aed|sar|btc|eth|dollar|euro|pound|yen|yuan|rupee|franc|krona|krone|złoty|real|peso|won|dirham|riyal|bitcoin|ethereum)/i
  const matches = text.match(new RegExp(amountPattern, 'g'))
  if (matches) {
    for (const match of matches) {
      const currencyMatch = match.match(/(usd|eur|gbp|jpy|cny|inr|cad|aud|chf|sek|nok|dkk|pln|brl|mxn|krw|sgd|hkd|nzd|zar|rub|try|aed|sar|btc|eth|dollar|euro|pound|yen|yuan|rupee|franc|krona|krone|złoty|real|peso|won|dirham|riyal|bitcoin|ethereum)/i)
      if (currencyMatch) {
        const currencyText = currencyMatch[0].toUpperCase()
        // Map text to currency code
        if (currencyText.includes('DOLLAR') && !currencyText.includes('CANADIAN') && !currencyText.includes('AUSTRALIAN') && !currencyText.includes('SINGAPORE') && !currencyText.includes('HONG KONG') && !currencyText.includes('NEW ZEALAND')) {
          detectedCurrencies.add('USD')
        } else if (currencyText.includes('EURO')) {
          detectedCurrencies.add('EUR')
        } else if (currencyText.includes('POUND')) {
          detectedCurrencies.add('GBP')
        } else if (currencyText.includes('YEN')) {
          detectedCurrencies.add('JPY')
        } else if (currencyText.includes('YUAN')) {
          detectedCurrencies.add('CNY')
        } else if (currencyText.includes('RUPEE')) {
          detectedCurrencies.add('INR')
        } else if (currencyText.includes('CANADIAN')) {
          detectedCurrencies.add('CAD')
        } else if (currencyText.includes('AUSTRALIAN')) {
          detectedCurrencies.add('AUD')
        } else if (currencyText.includes('SWISS')) {
          detectedCurrencies.add('CHF')
        } else if (currencyText.includes('SWEDISH')) {
          detectedCurrencies.add('SEK')
        } else if (currencyText.includes('NORWEGIAN')) {
          detectedCurrencies.add('NOK')
        } else if (currencyText.includes('DANISH')) {
          detectedCurrencies.add('DKK')
        } else if (currencyText.includes('POLISH') || currencyText.includes('ZŁOTY')) {
          detectedCurrencies.add('PLN')
        } else if (currencyText.includes('BRAZILIAN')) {
          detectedCurrencies.add('BRL')
        } else if (currencyText.includes('MEXICAN')) {
          detectedCurrencies.add('MXN')
        } else if (currencyText.includes('KOREAN') || currencyText.includes('WON')) {
          detectedCurrencies.add('KRW')
        } else if (currencyText.includes('SINGAPORE')) {
          detectedCurrencies.add('SGD')
        } else if (currencyText.includes('HONG KONG')) {
          detectedCurrencies.add('HKD')
        } else if (currencyText.includes('NEW ZEALAND')) {
          detectedCurrencies.add('NZD')
        } else if (currencyText.includes('SOUTH AFRICAN')) {
          detectedCurrencies.add('ZAR')
        } else if (currencyText.includes('RUSSIAN')) {
          detectedCurrencies.add('RUB')
        } else if (currencyText.includes('TURKISH')) {
          detectedCurrencies.add('TRY')
        } else if (currencyText.includes('UAE') || currencyText.includes('DIRHAM')) {
          detectedCurrencies.add('AED')
        } else if (currencyText.includes('SAUDI')) {
          detectedCurrencies.add('SAR')
        } else if (currencyText.includes('BITCOIN')) {
          detectedCurrencies.add('BTC')
        } else if (currencyText.includes('ETHEREUM')) {
          detectedCurrencies.add('ETH')
        }
      }
    }
  }

  return Array.from(detectedCurrencies)
}

/**
 * Popular currencies for filter dropdown
 */
export const POPULAR_CURRENCIES: Array<{ code: Currency; name: string }> = [
  { code: 'USD', name: CURRENCY_NAMES.USD },
  { code: 'EUR', name: CURRENCY_NAMES.EUR },
  { code: 'GBP', name: CURRENCY_NAMES.GBP },
  { code: 'JPY', name: CURRENCY_NAMES.JPY },
  { code: 'CNY', name: CURRENCY_NAMES.CNY },
  { code: 'INR', name: CURRENCY_NAMES.INR },
  { code: 'CAD', name: CURRENCY_NAMES.CAD },
  { code: 'AUD', name: CURRENCY_NAMES.AUD },
  { code: 'CHF', name: CURRENCY_NAMES.CHF },
  { code: 'SEK', name: CURRENCY_NAMES.SEK },
  { code: 'NOK', name: CURRENCY_NAMES.NOK },
  { code: 'DKK', name: CURRENCY_NAMES.DKK },
  { code: 'PLN', name: CURRENCY_NAMES.PLN },
  { code: 'BRL', name: CURRENCY_NAMES.BRL },
  { code: 'MXN', name: CURRENCY_NAMES.MXN },
  { code: 'KRW', name: CURRENCY_NAMES.KRW },
  { code: 'SGD', name: CURRENCY_NAMES.SGD },
  { code: 'HKD', name: CURRENCY_NAMES.HKD },
  { code: 'NZD', name: CURRENCY_NAMES.NZD },
  { code: 'ZAR', name: CURRENCY_NAMES.ZAR },
  { code: 'RUB', name: CURRENCY_NAMES.RUB },
  { code: 'TRY', name: CURRENCY_NAMES.TRY },
  { code: 'AED', name: CURRENCY_NAMES.AED },
  { code: 'SAR', name: CURRENCY_NAMES.SAR },
  { code: 'BTC', name: CURRENCY_NAMES.BTC },
  { code: 'ETH', name: CURRENCY_NAMES.ETH },
  { code: 'OTHER', name: CURRENCY_NAMES.OTHER }
]

/**
 * Filters bounties by currency
 */
export function filterByCurrency<T extends { title?: string; body?: string }>(
  items: T[],
  currencyFilter: Currency | null
): T[] {
  if (!currencyFilter || currencyFilter === 'OTHER') {
    return items // Show all if no currency filter or "other" selected
  }

  return items.filter(item => {
    const text = `${item.title || ''} ${item.body || ''}`
    const detectedCurrencies = extractCurrenciesFromText(text)
    
    // If currency is detected in the text, include it
    if (detectedCurrencies.includes(currencyFilter)) {
      return true
    }

    // If no currency is detected and filter is not "other", exclude it
    // This is a heuristic - we assume bounties without explicit currency might be in the filtered currency
    if (detectedCurrencies.length === 0 && currencyFilter === 'USD') {
      // Default assumption: if no currency specified, might be USD
      return true
    }

    return false
  })
}

