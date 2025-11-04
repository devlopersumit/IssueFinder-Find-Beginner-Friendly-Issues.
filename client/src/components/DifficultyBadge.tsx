import React from 'react'
import type { DifficultyLevel } from '../utils/difficulty'

type DifficultyBadgeProps = {
  difficulty: DifficultyLevel
  className?: string
}

const DifficultyBadge: React.FC<DifficultyBadgeProps> = ({ difficulty, className = '' }) => {
  if (!difficulty) {
    return null
  }

  const badgeConfig = {
    beginner: {
      label: 'Beginner',
      icon: '🌱',
      colors: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-300 dark:border-green-700'
    },
    intermediate: {
      label: 'Intermediate',
      icon: '⚡',
      colors: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 border-yellow-300 dark:border-yellow-700'
    },
    advanced: {
      label: 'Advanced',
      icon: '🔥',
      colors: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-300 dark:border-red-700'
    }
  }

  const config = badgeConfig[difficulty]

  return (
    <span 
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold ${config.colors} ${className}`}
      title={`Difficulty: ${config.label}`}
    >
      <span>{config.icon}</span>
      <span>{config.label}</span>
    </span>
  )
}

export default DifficultyBadge
