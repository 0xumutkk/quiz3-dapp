// Core game types
export type Category = 'aptos' | 'defi' | 'nft' | 'zk';

export interface Question {
  id: string;
  category: Category;
  text: string;
  choices: [string, string, string, string];
  answer_idx: number;
  difficulty: 'easy' | 'medium' | 'hard';
  explanation?: string;
}

export interface QuizSession {
  id: string;
  user: string;
  season_id: string;
  category: Category;
  questions: Question[];
  responses: QuizResponse[];
  started_at: Date;
  finished_at?: Date;
  total_score: number;
  device_fp?: string;
}

export interface QuizResponse {
  id: string;
  session_id: string;
  question_id: string;
  chosen_idx: number;
  elapsed_ms: number;
  correct: boolean;
  points_earned: number;
}

// Leaderboard types
export interface LeaderboardEntry {
  rank: number;
  user: string;
  total_points: number;
  total_time_ms: number;
  category_scores: Record<Category, number>;
}

export interface SeasonStats {
  total_participants: number;
  total_questions_answered: number;
  average_score: number;
  top_category: Category;
}

// Season and rewards
export interface GameSeason {
  id: string;
  start_at: Date;
  end_at: Date;
  status: 'active' | 'ended' | 'claims_open';
  merkle_root?: string;
  reward_pool?: number;
}

export interface UserReward {
  season_id: string;
  wallet: string;
  amount: number;
  claimed: boolean;
  claimed_tx?: string;
  merkle_proof?: string[];
}

// API response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

// Game flow types
export interface GameState {
  currentSeason?: GameSeason;
  userSession?: QuizSession;
  currentQuestion?: Question;
  currentQuestionIndex: number;
  timeLeft: number;
  streak: number;
  isLoading: boolean;
  error?: string;
}

// Wallet and user types
export interface User {
  wallet: string;
  total_score: number;
  games_played: number;
  current_streak: number;
  best_category: Category;
  joined_at: Date;
}

// Component prop types
export interface CategoryCardProps {
  category: Category;
  title: string;
  description: string;
  questionsCount: number;
  isCompleted: boolean;
  onClick: () => void;
}

export interface QuizTimerProps {
  timeLeft: number;
  maxTime: number;
  onTimeUp: () => void;
}

export interface QuizQuestionProps {
  question: Question;
  onAnswer: (choiceIndex: number) => void;
  selectedAnswer?: number;
  showResult: boolean;
  disabled?: boolean;
}

export interface LeaderboardTabsProps {
  activeTab: 'general' | Category;
  onTabChange: (tab: 'general' | Category) => void;
}

// Educational content
export interface EducationalContent {
  title: string;
  explanation: string;
  learnMoreUrl?: string;
  relatedTopics?: string[];
}

// Anti-cheat types
export interface SessionValidation {
  device_fingerprint: string;
  response_pattern: number[];
  suspicious_activity: boolean;
  flagged_responses: string[];
}

// Analytics types
export interface QuizAnalytics {
  session_id: string;
  category: Category;
  completion_rate: number;
  average_response_time: number;
  difficulty_performance: Record<string, number>;
  streak_achievements: number;
}
