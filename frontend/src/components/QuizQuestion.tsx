import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, BookOpen, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Question } from '@/types';
import { shuffleArray, cn } from '@/lib/utils';
import { getEducationalContent } from '@/data/questions';

interface QuizQuestionProps {
  question: Question;
  onAnswer: (choiceIndex: number, originalIndex: number) => void;
  selectedAnswer?: number;
  showResult: boolean;
  disabled?: boolean;
}

export function QuizQuestion({ 
  question, 
  onAnswer, 
  selectedAnswer, 
  showResult, 
  disabled = false 
}: QuizQuestionProps) {
  const [shuffledChoices, setShuffledChoices] = useState<Array<{text: string, originalIndex: number}>>([]);
  const [canProceed, setCanProceed] = useState(false);

  // Shuffle choices on question change while preserving original indices
  useEffect(() => {
    const choicesWithIndex = question.choices.map((text, index) => ({ text, originalIndex: index }));
    setShuffledChoices(shuffleArray(choicesWithIndex));
    setCanProceed(false);
  }, [question]);

  // Enable "Next" button after delay when answer is wrong
  useEffect(() => {
    if (showResult && selectedAnswer !== undefined) {
      const isCorrect = shuffledChoices[selectedAnswer]?.originalIndex === question.answer_idx;
      if (!isCorrect) {
        const timer = setTimeout(() => {
          setCanProceed(true);
        }, 1200); // 1.2 second delay as specified
        return () => clearTimeout(timer);
      } else {
        setCanProceed(true);
      }
    }
  }, [showResult, selectedAnswer, shuffledChoices, question.answer_idx]);

  const getChoiceVariant = (choiceIndex: number) => {
    if (!showResult || selectedAnswer === undefined) return 'quiz';
    
    const isSelected = selectedAnswer === choiceIndex;
    const isCorrect = shuffledChoices[choiceIndex]?.originalIndex === question.answer_idx;
    const selectedIsCorrect = shuffledChoices[selectedAnswer]?.originalIndex === question.answer_idx;
    
    if (isCorrect) return 'quiz correct';
    if (isSelected && !selectedIsCorrect) return 'quiz incorrect';
    return 'quiz';
  };

  const getChoiceIcon = (choiceIndex: number) => {
    if (!showResult || selectedAnswer === undefined) return null;
    
    const isSelected = selectedAnswer === choiceIndex;
    const isCorrect = shuffledChoices[choiceIndex]?.originalIndex === question.answer_idx;
    const selectedIsCorrect = shuffledChoices[selectedAnswer]?.originalIndex === question.answer_idx;
    
    if (isCorrect) {
      return <CheckCircle className="h-5 w-5 text-green-400" />;
    }
    if (isSelected && !selectedIsCorrect) {
      return <XCircle className="h-5 w-5 text-red-400" />;
    }
    return null;
  };

  const educationalContent = showResult && selectedAnswer !== undefined 
    ? getEducationalContent(question.category, question.id)
    : null;

  const isWrongAnswer = showResult && selectedAnswer !== undefined && 
    shuffledChoices[selectedAnswer]?.originalIndex !== question.answer_idx;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Question */}
      <Card className="card-glow">
        <CardContent className="p-8">
          <div className="flex items-start gap-4 mb-6">
            <div className="h-8 w-8 rounded-full bg-gradient-primary flex items-center justify-center text-white font-bold text-sm">
              ?
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white leading-relaxed flex-1 quiz-question-mobile-responsive">
              {question.text}
            </h2>
          </div>

          {/* Difficulty indicator */}
          <div className="flex items-center gap-2 mb-6">
            <span className="text-xs text-slate-400 uppercase tracking-wider">
              Difficulty:
            </span>
            <span className={cn(
              "text-xs font-medium px-2 py-1 rounded-full",
              {
                "bg-green-500/20 text-green-400": question.difficulty === 'easy',
                "bg-yellow-500/20 text-yellow-400": question.difficulty === 'medium',
                "bg-red-500/20 text-red-400": question.difficulty === 'hard',
              }
            )}>
              {question.difficulty}
            </span>
          </div>

          {/* Choices */}
          <div className="grid gap-3">
            {shuffledChoices.map((choice, index) => (
              <Button
                key={index}
                variant="quiz"
                size="quiz"
                className={cn(
                  "quiz-option transition-all duration-300",
                  getChoiceVariant(index),
                  {
                    "cursor-not-allowed": disabled,
                    "transform scale-[0.98]": showResult && selectedAnswer === index,
                  }
                )}
                onClick={() => !disabled && !showResult && onAnswer(index, choice.originalIndex)}
                disabled={disabled || showResult}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-slate-700 flex items-center justify-center text-slate-300 font-semibold text-sm">
                      {String.fromCharCode(65 + index)}
                    </div>
                    <span className="text-left">{choice.text}</span>
                  </div>
                  {getChoiceIcon(index)}
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Educational Card - Shows when answer is wrong */}
      {isWrongAnswer && educationalContent && (
        <Card className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border-blue-500/30 animate-slide-up">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-blue-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-blue-300 mb-2 flex items-center gap-2">
                  Learn More
                  <div className="h-1 w-8 bg-gradient-primary rounded-full"></div>
                </h3>
                <p className="text-slate-300 mb-3 leading-relaxed">
                  <strong className="text-green-400">Correct Answer:</strong> {question.choices[question.answer_idx]}
                </p>
                <p className="text-slate-300 leading-relaxed mb-4">
                  {question.explanation || educationalContent.explanation}
                </p>
                {educationalContent.relatedTopics && (
                  <div className="flex flex-wrap gap-2">
                    {educationalContent.relatedTopics.map((topic, index) => (
                      <span 
                        key={index}
                        className="text-xs px-2 py-1 bg-blue-500/20 text-blue-300 rounded-lg"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Next Button - appears after delay for wrong answers */}
      {showResult && (
        <div className="flex justify-center">
          <Button 
            size="lg"
            disabled={!canProceed}
            className={cn(
              "min-w-32 transition-all duration-300",
              canProceed ? "button-gradient" : "opacity-50 cursor-not-allowed"
            )}
          >
            Next Question
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
