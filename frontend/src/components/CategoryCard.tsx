import { CheckCircle, Play, Lock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Category } from '@/types';
import { getCategoryEmoji, cn } from '@/lib/utils';

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
  return (
    <Card 
      className={cn(
        'category-card transition-all duration-300 cursor-pointer group',
        `category-card ${category}`,
        {
          'opacity-50 cursor-not-allowed': isLocked,
          'ring-2 ring-green-500/50': isCompleted,
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
              <h3 className="text-xl font-bold text-white mb-1">
                {title}
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
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
          <div className="text-sm text-slate-400">
            <span className="font-medium text-trivia-cyan">
              {questionsCount} Questions
            </span>
            {isCompleted && (
              <span className="ml-2 text-green-400">✓ Completed</span>
            )}
          </div>
          
          <Button 
            size="sm" 
            disabled={isLocked}
            className={cn(
              "transition-all duration-200 group-hover:scale-105",
              isCompleted 
                ? "bg-green-600 hover:bg-green-700 text-white" 
                : "button-gradient"
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
          <div className="mt-4 h-1 bg-slate-700 rounded-full overflow-hidden">
            <div 
              className={cn(
                "h-full rounded-full transition-all duration-500",
                isCompleted ? "w-full bg-green-500" : "w-0 bg-gradient-primary"
              )}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
