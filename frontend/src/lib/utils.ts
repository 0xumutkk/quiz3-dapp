import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatAddress(address: any): string {
  if (!address) return ""
  const addrStr = typeof address === 'string'
    ? address
    : (address?.toString ? address.toString() : String(address))
  if (!addrStr) return ""
  if (addrStr.length <= 10) return addrStr
  return `${addrStr.slice(0, 6)}...${addrStr.slice(-4)}`
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

// Category-specific color and styling utilities
export interface CategoryTheme {
  primary: string;
  secondary: string;
  accent: string;
  light: string;
  dark: string;
  bg: string;
  surface: string;
  gradient: string;
  bgGradient: string;
  textGradient: string;
  border: string;
  shadow: string;
}

export function getCategoryTheme(category: string): CategoryTheme {
  switch (category.toLowerCase()) {
    case 'aptos':
      return {
        primary: 'aptos-primary',
        secondary: 'aptos-secondary',
        accent: 'aptos-accent',
        light: 'aptos-light',
        dark: 'aptos-dark',
        bg: 'aptos-bg',
        surface: 'aptos-surface',
        gradient: 'aptos-gradient',
        bgGradient: 'aptos-bg-gradient',
        textGradient: 'from-aptos-primary to-aptos-secondary',
        border: 'border-aptos-primary/30',
        shadow: 'shadow-aptos-primary/20',
      };
    case 'defi':
      return {
        primary: 'defi-primary',
        secondary: 'defi-secondary',
        accent: 'defi-accent',
        light: 'defi-light',
        dark: 'defi-dark',
        bg: 'defi-bg',
        surface: 'defi-surface',
        gradient: 'defi-gradient',
        bgGradient: 'defi-bg-gradient',
        textGradient: 'from-defi-primary to-defi-secondary',
        border: 'border-defi-primary/30',
        shadow: 'shadow-defi-primary/20',
      };
    case 'nft':
      return {
        primary: 'nft-primary',
        secondary: 'nft-secondary',
        accent: 'nft-accent',
        light: 'nft-light',
        dark: 'nft-dark',
        bg: 'nft-bg',
        surface: 'nft-surface',
        gradient: 'nft-gradient',
        bgGradient: 'nft-bg-gradient',
        textGradient: 'from-nft-primary to-nft-secondary',
        border: 'border-nft-primary/30',
        shadow: 'shadow-nft-primary/20',
      };
    case 'zk':
      return {
        primary: 'zk-primary',
        secondary: 'zk-secondary',
        accent: 'zk-accent',
        light: 'zk-light',
        dark: 'zk-dark',
        bg: 'zk-bg',
        surface: 'zk-surface',
        gradient: 'zk-gradient',
        bgGradient: 'zk-bg-gradient',
        textGradient: 'from-zk-primary to-zk-secondary',
        border: 'border-zk-primary/30',
        shadow: 'shadow-zk-primary/20',
      };
    default:
      return {
        primary: 'slate-600',
        secondary: 'slate-500',
        accent: 'slate-400',
        light: 'slate-300',
        dark: 'slate-800',
        bg: 'slate-900',
        surface: 'slate-800',
        gradient: 'gradient-primary',
        bgGradient: 'hero-gradient',
        textGradient: 'from-slate-400 to-slate-300',
        border: 'border-slate-600/30',
        shadow: 'shadow-slate-600/20',
      };
  }
}

export function getCategoryClasses(category: string, element: 'background' | 'card' | 'button' | 'text' | 'border'): string {
  const theme = getCategoryTheme(category);
  
  switch (element) {
    case 'background':
      return `bg-${theme.bg} bg-${theme.bgGradient}`;
    case 'card':
      return `bg-${theme.surface}/80 border-${theme.border} shadow-${theme.shadow}`;
    case 'button':
      return `bg-${theme.gradient} hover:bg-${theme.primary} text-white border-${theme.border}`;
    case 'text':
      return `text-${theme.primary} bg-gradient-to-r ${theme.textGradient} bg-clip-text text-transparent`;
    case 'border':
      return `border-${theme.border}`;
    default:
      return '';
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
