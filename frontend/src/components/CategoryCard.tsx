import { CheckCircle, Play, Lock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Category } from '@/types';
import { getCategoryEmoji, cn, getCategoryTheme } from '@/lib/utils';

interface CategoryCardProps {
  category: Category;
  title: string;
  description: string;
  questionsCount: number;
  isCompleted: boolean;
  isLocked?: boolean;
  onClick: () => void;
}

export function CategoryCard({
  category,
  title,
  description,
  questionsCount,
  isCompleted,
  isLocked = false,
  onClick,
}: CategoryCardProps) {
  const theme = getCategoryTheme(category);
  
  return (
    <Card 
      className={cn(
        'category-card transition-all duration-300 cursor-pointer group backdrop-blur-sm',
        `category-card ${category}`,
        {
          'opacity-50 cursor-not-allowed': isLocked,
          [`ring-2 ring-${theme.accent}/50`]: isCompleted,
        }
      )}
      onClick={!isLocked ? onClick : undefined}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="text-3xl">
              {getCategoryEmoji(category)}
            </div>
            <div>
              <h3 className="text-xl font-bold category-title mb-1">
                {title}
              </h3>
              <p className="text-sm category-description leading-relaxed">
                {description}
              </p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            {isCompleted && (
              <CheckCircle className="h-6 w-6 text-green-500" />
            )}
            {isLocked && (
              <Lock className="h-5 w-5 text-slate-400" />
            )}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm category-questions">
            <span className="font-medium category-questions-count">
              {questionsCount} Questions
            </span>
            {isCompleted && (
              <span className="ml-2 category-questions-count">✓ Completed</span>
            )}
          </div>
          
          <Button 
            size="sm" 
            disabled={isLocked}
            className={cn(
              "category-button transition-all duration-200 group-hover:scale-105",
              isCompleted && "completed"
            )}
          >
            {isLocked ? (
              <Lock className="h-4 w-4 mr-2" />
            ) : (
              <Play className="h-4 w-4 mr-2" />
            )}
            {isLocked ? 'Locked' : isCompleted ? 'Retry' : 'Start'}
          </Button>
        </div>

        {/* Progress indicator */}
        {!isLocked && (
          <div className="mt-4 h-1 category-progress-bg rounded-full overflow-hidden">
            <div 
              className={cn(
                "h-full rounded-full transition-all duration-500 category-progress-fill",
                isCompleted ? "w-full completed" : "w-0"
              )}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
