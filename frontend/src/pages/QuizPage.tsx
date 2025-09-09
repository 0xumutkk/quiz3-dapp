import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { ArrowLeft, Flame } from 'lucide-react';

import { QuizTimer } from '@/components/QuizTimer';
import { QuizQuestion } from '@/components/QuizQuestion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { usePoints } from '@/contexts/PointsContext';

import { Category, Question, QuizResponse } from '@/types';
import { getRandomQuestions } from '@/data/questions';
import { getCategoryEmoji, getCategoryTheme } from '@/lib/utils';

const QUESTION_TIME_LIMIT = 15; // seconds

export function QuizPage() {
  const { category } = useParams<{ category: Category }>();
  const navigate = useNavigate();
  const { connected } = useWallet();
  const { addPoints } = usePoints();

  // Quiz state
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<QuizResponse[]>([]);
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME_LIMIT);
  const [selectedAnswer, setSelectedAnswer] = useState<number | undefined>();
  const [showResult, setShowResult] = useState(false);
  const [streak, setStreak] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Redirect if not connected or invalid category
  useEffect(() => {
    if (!connected) {
      navigate('/');
      return;
    }

    if (!category || !['aptos', 'defi', 'nft', 'zk'].includes(category)) {
      navigate('/');
      return;
    }

    // Load questions for the category
    const categoryQuestions = getRandomQuestions(category as Category, 10);
    setQuestions(categoryQuestions);
  }, [connected, category, navigate]);

  // Handle answer selection
  const handleAnswerSubmit = useCallback((shuffledIndex: number, originalIndex: number) => {
    if (showResult || isPaused) return;

    const startTime = Date.now() - (QUESTION_TIME_LIMIT - timeLeft) * 1000;
    const elapsedMs = Date.now() - startTime;
    const currentQuestion = questions[currentQuestionIndex];
    
    // If no answer was selected (timer ran out), treat as incorrect
    const isCorrect = originalIndex >= 0 && originalIndex === currentQuestion.answer_idx;

    // Calculate score
    let newStreak = streak;
    if (isCorrect) {
      newStreak = streak + 1;
    } else {
      newStreak = 0;
    }

    // Q3P calculation: 100 points for correct answer + streak bonus
    const baseQ3P = isCorrect ? 100 : 0;
    const streakBonus = isCorrect ? Math.min(newStreak * 10, 100) : 0; // Max 100 bonus for streak
    const q3pEarned = baseQ3P + streakBonus;

    // Create response record
    const response: QuizResponse = {
      id: `${currentQuestion.id}_${Date.now()}`,
      session_id: `session_${Date.now()}`, // TODO: Use real session ID
      question_id: currentQuestion.id,
      chosen_idx: originalIndex >= 0 ? originalIndex : -1, // -1 means no answer selected
      elapsed_ms: elapsedMs,
      correct: isCorrect,
      points_earned: q3pEarned,
    };

    // Update state
    setSelectedAnswer(shuffledIndex >= 0 ? shuffledIndex : undefined);
    setResponses(prev => [...prev, response]);
    setStreak(newStreak);
    setTotalScore(prev => prev + q3pEarned);
    setShowResult(true);
    setIsPaused(true);

    // Add earned Q3P to context
    if (q3pEarned > 0) {
      addPoints(category as Category, q3pEarned);
    }

    // Auto-advance after showing result
    setTimeout(() => {
      handleNextQuestion();
    }, isCorrect ? 1500 : 2500); // Longer delay for wrong answers to show educational content
  }, [currentQuestionIndex, questions, timeLeft, streak, showResult, isPaused]);

  // Handle next question
  const handleNextQuestion = useCallback(() => {
    if (currentQuestionIndex + 1 >= questions.length) {
      // Quiz completed - navigate to results (Q3P already added per question)
      navigate('/results', {
        state: {
          category,
          responses,
          totalScore: totalScore,
          totalTime: responses.reduce((sum, r) => sum + r.elapsed_ms, 0),
        }
      });
      return;
    }

    // Move to next question
    setCurrentQuestionIndex(prev => prev + 1);
    setSelectedAnswer(undefined);
    setShowResult(false);
    setTimeLeft(QUESTION_TIME_LIMIT);
    setIsPaused(false);
  }, [currentQuestionIndex, questions.length, navigate, category, responses, totalScore]);

  // Timer countdown
  useEffect(() => {
    if (isPaused || showResult || timeLeft <= 0) return;

    const timer = setTimeout(() => {
      setTimeLeft(time => {
        if (time <= 1) {
          // Timer reached 0, handle time up
          setTimeout(() => {
            if (selectedAnswer === undefined && !showResult && !isPaused) {
              // No answer was selected, treat as incorrect
              handleAnswerSubmit(-1, -1);
            }
          }, 0);
          return 0;
        }
        return time - 1;
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, isPaused, showResult, selectedAnswer, handleAnswerSubmit]);

  // Handle back button
  const handleBack = () => {
    if (window.confirm('Are you sure you want to leave the quiz? Your progress will be lost.')) {
      navigate('/');
    }
  };

  if (!questions.length) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <div className="h-8 w-8 border-2 border-trivia-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">Loading questions...</p>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const theme = getCategoryTheme(category!);

  return (
    <div className={`min-h-screen bg-${theme.bgGradient} transition-all duration-500`}>
      <div className="max-w-6xl mx-auto space-y-8 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button 
          variant="ghost" 
          onClick={handleBack} 
          className={`flex items-center gap-2 text-${theme.light} hover:bg-${theme.surface}/50 hover:text-white transition-colors`}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Categories
        </Button>

        <div className="flex items-center gap-4">
          {/* Category indicator */}
          <div className={`flex items-center gap-2 px-4 py-2 bg-${theme.surface}/80 rounded-xl border-${theme.border} shadow-${theme.shadow} backdrop-blur-sm`}>
            <span className="text-xl">{getCategoryEmoji(category!)}</span>
            <span className={`font-semibold text-${theme.light} capitalize`}>{category}</span>
          </div>

          {/* Streak indicator */}
          {streak > 0 && (
            <div className={`flex items-center gap-2 px-3 py-2 bg-${theme.accent}/20 border border-${theme.accent}/30 rounded-xl backdrop-blur-sm`}>
              <Flame className={`h-4 w-4 text-${theme.accent}`} />
              <span className={`text-${theme.accent} font-bold`}>{streak}x</span>
            </div>
          )}
        </div>
      </div>

      {/* Progress and Score */}
      <Card className={`bg-${theme.surface}/80 border-${theme.border} shadow-${theme.shadow} backdrop-blur-sm`}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className={`text-sm text-${theme.light}/80`}>
              Question <span className={`font-bold text-${theme.light}`}>{currentQuestionIndex + 1}</span> of{' '}
              <span className={`font-bold text-${theme.light}`}>{questions.length}</span>
            </div>
            <div className={`text-sm text-${theme.light}/80`}>
              Score: <span className={`font-bold text-${theme.accent}`}>{totalScore.toLocaleString()}</span>
            </div>
          </div>
          <Progress 
            value={progress} 
            className={`h-2 bg-${theme.dark}/30`}
            style={{
              '--progress-background': `linear-gradient(90deg, var(--tw-gradient-stops))`,
              '--progress-foreground': `var(--tw-gradient-stops)`,
            } as React.CSSProperties}
          />
        </CardContent>
      </Card>

      {/* Timer */}
      <QuizTimer
        timeLeft={timeLeft}
        maxTime={QUESTION_TIME_LIMIT}
        category={category!}
      />

      {/* Question */}
      <QuizQuestion
        question={currentQuestion}
        onAnswer={handleAnswerSubmit}
        selectedAnswer={selectedAnswer}
        showResult={showResult}
        disabled={isPaused}
        category={category!}
      />

      {/* Debug info (remove in production) */}
      {process.env.NODE_ENV === 'development' && (
        <Card className="bg-slate-900/50 border-slate-700">
          <CardContent className="p-4">
            <div className="text-xs text-slate-500 space-y-1">
              <div>Current Question: {currentQuestionIndex + 1}/{questions.length}</div>
              <div>Time Left: {timeLeft}s</div>
              <div>Streak: {streak}</div>
              <div>Score: {totalScore}</div>
              <div>Selected: {selectedAnswer !== undefined ? selectedAnswer : 'None'}</div>
              <div>Show Result: {showResult ? 'Yes' : 'No'}</div>
            </div>
          </CardContent>
        </Card>
      )}
      </div>
    </div>
  );
}
