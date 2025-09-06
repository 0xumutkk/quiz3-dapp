import { useState, useEffect } from 'react';
import { Timer, AlertTriangle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { getTimerColor, cn } from '@/lib/utils';

interface QuizTimerProps {
  timeLeft: number;
  maxTime: number;
  onTimeUp: () => void;
  isPaused?: boolean;
}

export function QuizTimer({ timeLeft, maxTime, onTimeUp, isPaused = false }: QuizTimerProps) {
  const [isWarning, setIsWarning] = useState(false);
  const percentage = (timeLeft / maxTime) * 100;
  const timerColorClass = getTimerColor(timeLeft, maxTime);

  useEffect(() => {
    // Show warning when less than 5 seconds left
    setIsWarning(timeLeft <= 5 && timeLeft > 0);
  }, [timeLeft]);

  useEffect(() => {
    if (timeLeft <= 0 && !isPaused) {
      onTimeUp();
    }
  }, [timeLeft, isPaused, onTimeUp]);

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Timer Display */}
      <div className="flex items-center justify-center gap-3 mb-4">
        <div className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-xl border transition-all duration-300 quiz-timer-mobile-responsive",
          {
            "bg-red-500/20 border-red-500/50 animate-pulse": isWarning,
            "bg-slate-800/50 border-slate-700/50": !isWarning,
          }
        )}>
          {isWarning ? (
            <AlertTriangle className="h-5 w-5 text-red-400" />
          ) : (
            <Timer className="h-5 w-5 text-trivia-blue" />
          )}
          
          <div className="text-center">
            <div className="text-xs text-slate-400 uppercase tracking-wider">
              Time Left
            </div>
            <div className={cn(
              "text-2xl font-bold font-mono transition-colors duration-300",
              timerColorClass,
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
          className="h-3 shadow-lg"
        />
        
        {/* Pulsing effect for low time */}
        {isWarning && (
          <div className="absolute inset-0 rounded-full bg-red-500/30 animate-pulse" />
        )}
      </div>

      {/* Time indicators */}
      <div className="flex justify-between text-xs text-slate-500 mt-2">
        <span>0s</span>
        <span className="text-slate-400">
          {Math.floor(maxTime / 2)}s
        </span>
        <span>{maxTime}s</span>
      </div>
    </div>
  );
}
