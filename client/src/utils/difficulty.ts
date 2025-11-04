export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced' | null

const BEGINNER_LABELS = [
  'good first issue',
  'good-first-issue',
  'first-timers-only',
  'first timers only',
  'beginner',
  'easy',
  'starter',
  'newcomer',
  'good-for-beginners',
  'good for beginners'
]

const INTERMEDIATE_LABELS = [
  'help wanted',
  'help-wanted',
  'medium',
  'intermediate',
  'moderate'
]

const ADVANCED_LABELS = [
  'expert',
  'advanced',
  'hard',
  'difficult',
  'complex',
  'challenging'
]

/**
 * Detects difficulty level from issue labels
 * @param labels - Array of label objects with name property
 * @returns Difficulty level or null if not detected
 */
export function detectDifficulty(labels: Array<{ name?: string; color?: string }>): DifficultyLevel {
  if (!labels || labels.length === 0) {
    return null
  }

  // Check all labels (case-insensitive)
  const labelNames = labels.map(l => l.name?.toLowerCase() || '')

  // Check for advanced first (more specific)
  for (const label of labelNames) {
    if (ADVANCED_LABELS.some(adv => label.includes(adv))) {
      return 'advanced'
    }
  }

  // Check for beginner
  for (const label of labelNames) {
    if (BEGINNER_LABELS.some(beg => label.includes(beg))) {
      return 'beginner'
    }
  }

  // Check for intermediate
  for (const label of labelNames) {
    if (INTERMEDIATE_LABELS.some(int => label.includes(int))) {
      return 'intermediate'
    }
  }

  return null
}
