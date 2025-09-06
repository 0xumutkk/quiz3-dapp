import { useLocation, useNavigate } from 'react-router-dom';
import { Trophy, Target, Clock, Zap, Home, Share2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Category, QuizResponse } from '@/types';
import { getCategoryEmoji } from '@/lib/utils';

interface LocationState {
  category: Category;
  responses: QuizResponse[];
  totalScore: number;
  totalTime: number;
}

export function ResultsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState;

  if (!state) {
    navigate('/');
    return null;
  }

  const { category, responses, totalScore, totalTime } = state;
  const correctAnswers = responses.filter(r => r.correct).length;
  const averageTime = totalTime / responses.length / 1000; // in seconds
  const accuracy = (correctAnswers / responses.length) * 100;

  // Estimated rank (placeholder)
  const estimatedRank = Math.floor(Math.random() * 100) + 1;

  const handleShare = async () => {
    const shareData = {
      title: 'Quiz3 Results',
      text: `I just scored ${totalScore.toLocaleString()} points in ${category.toUpperCase()} category! 🎯 ${correctAnswers}/${responses.length} correct answers`,
      url: window.location.origin
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback to clipboard
      await navigator.clipboard.writeText(
        `${shareData.text} ${shareData.url}`
      );
      alert('Results copied to clipboard!');
    }
  };

  const handlePlayAgain = () => {
    navigate(`/quiz/${category}`);
  };

  const handleBackHome = () => {
    navigate('/');
  };

  const handleViewLeaderboard = () => {
    navigate('/leaderboard');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="text-6xl mb-4">
          {correctAnswers === responses.length ? '🏆' : correctAnswers >= responses.length * 0.8 ? '🥇' : correctAnswers >= responses.length * 0.6 ? '🥈' : '📚'}
        </div>
        <h1 className="text-4xl font-bold gradient-text">
          {correctAnswers === responses.length 
            ? 'Perfect Score!' 
            : correctAnswers >= responses.length * 0.8 
            ? 'Excellent Work!' 
            : correctAnswers >= responses.length * 0.6 
            ? 'Well Done!' 
            : 'Keep Learning!'}
        </h1>
        <p className="text-slate-400">
          You completed the <span className="capitalize text-white font-semibold">{category}</span> {getCategoryEmoji(category)} quiz
        </p>
      </div>

      {/* Score Summary */}
      <Card className="card-glow">
        <CardHeader>
          <CardTitle className="text-center gradient-text text-3xl">
            {totalScore.toLocaleString()} Points
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="space-y-2">
              <Target className="h-8 w-8 text-trivia-blue mx-auto" />
              <div className="text-2xl font-bold text-white">
                {correctAnswers}/{responses.length}
              </div>
              <div className="text-sm text-slate-400">Correct</div>
            </div>

            <div className="space-y-2">
              <Zap className="h-8 w-8 text-trivia-cyan mx-auto" />
              <div className="text-2xl font-bold text-white">
                {accuracy.toFixed(0)}%
              </div>
              <div className="text-sm text-slate-400">Accuracy</div>
            </div>

            <div className="space-y-2">
              <Clock className="h-8 w-8 text-trivia-orange mx-auto" />
              <div className="text-2xl font-bold text-white">
                {averageTime.toFixed(1)}s
              </div>
              <div className="text-sm text-slate-400">Avg Time</div>
            </div>

            <div className="space-y-2">
              <Trophy className="h-8 w-8 text-trivia-purple mx-auto" />
              <div className="text-2xl font-bold text-white">
                #{estimatedRank}
              </div>
              <div className="text-sm text-slate-400">Est. Rank</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Question Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Question Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {responses.map((response, index) => (
              <div 
                key={response.id}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-800/30"
              >
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-slate-700 flex items-center justify-center text-sm font-semibold">
                    {index + 1}
                  </div>
                  <div className="flex items-center gap-2">
                    {response.correct ? (
                      <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                    ) : (
                      <div className="h-2 w-2 bg-red-500 rounded-full"></div>
                    )}
                    <span className={response.correct ? 'text-green-400' : 'text-red-400'}>
                      {response.correct ? 'Correct' : 'Incorrect'}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 text-sm text-slate-400">
                  <span>{(response.elapsed_ms / 1000).toFixed(1)}s</span>
                  <span className="font-semibold text-trivia-cyan">
                    +{response.points_earned}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button onClick={handlePlayAgain} size="lg" className="flex items-center gap-2">
          <Zap className="h-4 w-4" />
          Play Again
        </Button>
        
        <Button onClick={handleShare} variant="secondary" size="lg" className="flex items-center gap-2">
          <Share2 className="h-4 w-4" />
          Share Results
        </Button>
        
        <Button onClick={handleViewLeaderboard} variant="outline" size="lg" className="flex items-center gap-2">
          <Trophy className="h-4 w-4" />
          Leaderboard
        </Button>
        
        <Button onClick={handleBackHome} variant="ghost" size="lg" className="flex items-center gap-2">
          <Home className="h-4 w-4" />
          Back Home
        </Button>
      </div>
    </div>
  );
}
