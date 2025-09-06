import { useState, useEffect } from 'react';
import { Timer, AlertTriangle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { cn, getCategoryTheme } from '@/lib/utils';
import { Category } from '@/types';

interface QuizTimerProps {
  timeLeft: number;
  maxTime: number;
  category: Category;
}

export function QuizTimer({ timeLeft, maxTime, category }: QuizTimerProps) {
  const [isWarning, setIsWarning] = useState(false);
  const percentage = (timeLeft / maxTime) * 100;
  const theme = getCategoryTheme(category);

  useEffect(() => {
    // Show warning when less than 5 seconds left
    setIsWarning(timeLeft <= 5 && timeLeft > 0);
  }, [timeLeft]);

  // Note: onTimeUp is now handled in the parent component's timer countdown
  // to prevent race conditions and multiple calls

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Timer Display */}
      <div className="flex items-center justify-center gap-3 mb-4">
        <div className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-xl border transition-all duration-300 quiz-timer-mobile-responsive backdrop-blur-sm",
          {
            "bg-red-500/20 border-red-500/50 animate-pulse": isWarning,
            [`bg-${theme.surface}/80 border-${theme.border} shadow-${theme.shadow}`]: !isWarning,
          }
        )}>
          {isWarning ? (
            <AlertTriangle className="h-5 w-5 text-red-400" />
          ) : (
            <Timer className={`h-5 w-5 text-${theme.primary}`} />
          )}
          
          <div className="text-center">
            <div className={`text-xs text-${theme.light}/80 uppercase tracking-wider`}>
              Time Left
            </div>
            <div className={cn(
              "text-2xl font-bold font-mono transition-colors duration-300",
              isWarning ? "text-red-400" : `text-${theme.accent}`,
              {
                "animate-countdown": isWarning,
              }
            )}>
              {timeLeft}s
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative">
        <Progress 
          value={percentage} 
          variant="timer"
          className={`h-3 shadow-lg bg-${theme.dark}/30`}
          style={{
            '--progress-background': `linear-gradient(90deg, var(--tw-gradient-stops))`,
            '--progress-foreground': `var(--tw-gradient-stops)`,
          } as React.CSSProperties}
        />
        
        {/* Pulsing effect for low time */}
        {isWarning && (
          <div className="absolute inset-0 rounded-full bg-red-500/30 animate-pulse" />
        )}
      </div>

      {/* Time indicators */}
      <div className={`flex justify-between text-xs text-${theme.light}/60 mt-2`}>
        <span>0s</span>
        <span className={`text-${theme.light}/80`}>
          {Math.floor(maxTime / 2)}s
        </span>
        <span>{maxTime}s</span>
      </div>
    </div>
  );
}
