import { Trophy, Zap, Target } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface PointsProgressBarProps {
  currentPoints: number;
  targetPoints: number;
  onClaimNFT: () => void;
  isLoading?: boolean;
  onAddTestPoints?: () => void;
  showTestButton?: boolean;
}

export function PointsProgressBar({
  currentPoints, 
  targetPoints, 
  onClaimNFT, 
  isLoading = false,
  onAddTestPoints,
  showTestButton = false
}: PointsProgressBarProps) {
  const progress = Math.min((currentPoints / targetPoints) * 100, 100);
  const pointsNeeded = Math.max(targetPoints - currentPoints, 0);
  const isComplete = currentPoints >= targetPoints;

  return (
    <Card className="bg-gradient-to-r from-slate-800/50 to-slate-900/50 border-slate-700/50">
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-trivia-orange/20 to-trivia-cyan/20 flex items-center justify-center">
                <Trophy className="h-5 w-5 text-trivia-orange" />
              </div>
              <div>
                <h3 className="font-semibold text-white">NFT Progress</h3>
                <p className="text-sm text-slate-400">
                  Earn {targetPoints.toLocaleString()} points to unlock your first NFT
                </p>
              </div>
            </div>
            
            {isComplete && (
              <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-green-500/20 border border-green-500/30">
                <Zap className="h-4 w-4 text-green-400" />
                <span className="text-sm font-semibold text-green-400">Ready!</span>
              </div>
            )}
          </div>

          {/* Progress Section */}
          <div className="space-y-3">
            {/* Points Display */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-trivia-orange" />
                <span className="text-sm text-slate-300">Current Points</span>
              </div>
              <div className="text-right">
                <span className="text-lg font-bold text-white">
                  {currentPoints.toLocaleString()}
                </span>
                <span className="text-sm text-slate-400 ml-1">
                  / {targetPoints.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="relative">
              <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-trivia-orange to-trivia-cyan rounded-full transition-all duration-1000 ease-out relative"
                  style={{ width: `${progress}%` }}
                >
                  {/* Animated shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
                  
                  {/* Fuel-like bubbles effect */}
                  {progress > 0 && (
                    <div className="absolute inset-0">
                      <div className="absolute top-0 left-1/4 w-1 h-1 bg-white/40 rounded-full animate-bounce delay-100"></div>
                      <div className="absolute top-0 left-1/2 w-1 h-1 bg-white/40 rounded-full animate-bounce delay-300"></div>
                      <div className="absolute top-0 left-3/4 w-1 h-1 bg-white/40 rounded-full animate-bounce delay-500"></div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Progress percentage */}
              <div className="absolute -top-6 right-0 text-xs text-slate-400">
                {Math.round(progress)}%
              </div>
            </div>

            {/* Status Message */}
            <div className="text-center">
              {isComplete ? (
                <p className="text-sm text-green-400 font-semibold">
                  🎉 Congratulations! You can now claim your NFT!
                </p>
              ) : (
                <p className="text-sm text-slate-400">
                  {pointsNeeded > 0 ? (
                    <>
                      <span className="text-trivia-orange font-semibold">{pointsNeeded.toLocaleString()}</span> more points needed
                    </>
                  ) : (
                    "Complete more quizzes to earn points!"
                  )}
                </p>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="pt-2 space-y-2">
            {/* Claim Button */}
            {isComplete && (
              <button
                onClick={onClaimNFT}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-trivia-orange to-trivia-cyan hover:from-trivia-cyan hover:to-trivia-orange text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Claiming NFT...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <Trophy className="h-5 w-5" />
                    <span>Claim Your NFT</span>
                  </div>
                )}
              </button>
            )}
            
            {/* Test Points Button */}
            {showTestButton && onAddTestPoints && !isComplete && (
              <button
                onClick={onAddTestPoints}
                className="w-full bg-slate-700 hover:bg-slate-600 text-slate-300 font-medium py-2 px-4 rounded-lg transition-colors duration-200 text-sm"
              >
                + Add 200 Test Points
              </button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
