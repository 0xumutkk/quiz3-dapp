import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatAddress(address: string): string {
  if (!address) return ""
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

export function calculateScore(
  correct: boolean,
  timeElapsed: number,
  maxTime: number,
  streak: number
): number {
  if (!correct) return 0
  
  const baseScore = 100
  const speedMultiplier = 0.5 + 0.5 * ((maxTime - timeElapsed) / maxTime)
  const streakBonus = 10 * Math.min(5, streak)
  
  return Math.round(baseScore * speedMultiplier + streakBonus)
}

export function getSeasonDates(): { start: Date; end: Date } {
  const now = new Date()
  // Using Europe/Istanbul timezone for season calculations
  
  // Get current week's Monday at 00:00
  const currentDay = now.getDay()
  const daysFromMonday = currentDay === 0 ? 6 : currentDay - 1
  
  const monday = new Date(now)
  monday.setDate(now.getDate() - daysFromMonday)
  monday.setHours(0, 0, 0, 0)
  
  // Get Sunday at 23:59
  const sunday = new Date(monday)
  sunday.setDate(monday.getDate() + 6)
  sunday.setHours(23, 59, 59, 999)
  
  return { start: monday, end: sunday }
}

export function formatLeaderboardRank(rank: number): string {
  if (rank === 1) return "🥇 1st"
  if (rank === 2) return "🥈 2nd" 
  if (rank === 3) return "🥉 3rd"
  return `#${rank}`
}

export function getCategoryColor(category: string): string {
  switch (category.toLowerCase()) {
    case 'aptos': return 'from-trivia-purple to-trivia-blue'
    case 'defi': return 'from-trivia-blue to-trivia-cyan'
    case 'nft': return 'from-trivia-cyan to-trivia-emerald'
    case 'zk': return 'from-trivia-pink to-trivia-orange'
    default: return 'from-slate-600 to-slate-500'
  }
}

export function getCategoryEmoji(category: string): string {
  switch (category.toLowerCase()) {
    case 'aptos': return '⚡'
    case 'defi': return '💰'
    case 'nft': return '🎨'
    case 'zk': return '🔒'
    default: return '❓'
  }
}

export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export function isValidAptosAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{1,64}$/.test(address)
}

export function getTimerColor(timeLeft: number, maxTime: number): string {
  const ratio = timeLeft / maxTime
  if (ratio > 0.6) return 'text-green-400'
  if (ratio > 0.3) return 'text-yellow-400' 
  return 'text-red-400'
}
