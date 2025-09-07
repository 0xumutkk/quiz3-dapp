import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { ArrowLeft, Clock, Target, BookOpen, CheckCircle, Home, Trophy } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Category, EducationalArticle } from '@/types';
import { getCategoryTheme, getCategoryEmoji } from '@/lib/utils';
import { usePoints } from '@/contexts/PointsContext';

interface LocationState {
  article: EducationalArticle;
  category: Category;
}

export function ArticlePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState;
  const { addPoints } = usePoints();
  
  const [hasReachedEnd, setHasReachedEnd] = useState(false);
  const [pointsAwarded, setPointsAwarded] = useState(false);
  const [showPointsNotification, setShowPointsNotification] = useState(false);
  const endOfArticleRef = useRef<HTMLDivElement>(null);

  if (!state) {
    navigate('/');
    return null;
  }

  const { article, category } = state;
  const theme = getCategoryTheme(category);
  
  // Generate unique key for this article to track if points were already awarded
  const articleKey = `article_${category}_${article.title.replace(/\s+/g, '_').toLowerCase()}`;

  const handleBackToResults = () => {
    navigate(-1);
  };

  const handleBackHome = () => {
    navigate('/');
  };

  // Check if points were already awarded for this article
  useEffect(() => {
    const alreadyAwarded = localStorage.getItem(`quiz3_${articleKey}`) === 'true';
    setPointsAwarded(alreadyAwarded);
  }, [articleKey]);

  // Scroll detection for end of article
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasReachedEnd && !pointsAwarded) {
          setHasReachedEnd(true);
          
          // Award points for reading the article
          addPoints(category, 200, 'article');
          setPointsAwarded(true);
          setShowPointsNotification(true);
          
          // Save to localStorage to prevent duplicate awards
          localStorage.setItem(`quiz3_${articleKey}`, 'true');
          
          // Hide notification after 5 seconds
          setTimeout(() => {
            setShowPointsNotification(false);
          }, 5000);
        }
      },
      {
        threshold: 0.8, // Trigger when 80% of the element is visible
      }
    );

    if (endOfArticleRef.current) {
      observer.observe(endOfArticleRef.current);
    }

    return () => {
      if (endOfArticleRef.current) {
        observer.unobserve(endOfArticleRef.current);
      }
    };
  }, [hasReachedEnd, pointsAwarded, category, addPoints, articleKey]);

  return (
    <div className={`min-h-screen bg-${theme.bgGradient} transition-all duration-500`}>
      {/* Points Notification */}
      {showPointsNotification && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right-full duration-500">
          <Card className={`bg-gradient-to-r from-trivia-orange/90 to-trivia-cyan/90 border-trivia-orange/50 shadow-2xl backdrop-blur-sm`}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
                  <Trophy className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-white font-semibold">Article Completed!</p>
                  <p className="text-white/90 text-sm">+200 points earned</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button 
            variant="ghost" 
            onClick={handleBackToResults}
            className={`flex items-center gap-2 text-${theme.light} hover:bg-${theme.surface}/50 hover:text-white transition-colors`}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Results
          </Button>

          <div className={`flex items-center gap-2 px-4 py-2 bg-${theme.surface}/80 rounded-xl border-${theme.border} shadow-${theme.shadow} backdrop-blur-sm`}>
            <span className="text-xl">{getCategoryEmoji(category)}</span>
            <span className={`font-semibold text-${theme.light} capitalize`}>{category}</span>
          </div>
        </div>

        {/* Article Header */}
        <Card className={`bg-${theme.surface}/80 border-${theme.border} shadow-${theme.shadow} backdrop-blur-sm`}>
          <CardHeader className="text-center">
            <div className={`flex items-center justify-center gap-3 mb-4`}>
              <div className={`h-12 w-12 rounded-xl bg-${theme.primary}/20 flex items-center justify-center`}>
                <BookOpen className={`h-6 w-6 text-${theme.primary}`} />
              </div>
              <div>
                <h1 className={`text-3xl font-bold text-${theme.light} mb-2`}>
                  {article.title}
                </h1>
                <p className={`text-xl text-${theme.light}/80`}>
                  {article.subtitle}
                </p>
              </div>
            </div>
            
            <div className="flex items-center justify-center gap-6 text-sm">
              <div className={`flex items-center gap-2 text-${theme.light}/80`}>
                <Clock className="h-4 w-4" />
                <span>{article.readingTime}</span>
              </div>
              <div className={`flex items-center gap-2 text-${theme.light}/80`}>
                <Target className="h-4 w-4" />
                <span className="capitalize">{article.difficulty}</span>
              </div>
              <div className={`flex items-center gap-2 text-${theme.light}/80`}>
                <CheckCircle className="h-4 w-4" />
                <span>Comprehensive learning guide</span>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Introduction */}
        <Card className={`bg-${theme.surface}/80 border-${theme.border} shadow-${theme.shadow} backdrop-blur-sm`}>
          <CardContent className="p-8">
            <h2 className={`text-2xl font-bold text-${theme.primary} mb-4`}>Introduction</h2>
            <p className={`text-${theme.light}/90 leading-relaxed text-lg`}>
              {article.content.introduction}
            </p>
          </CardContent>
        </Card>

        {/* Main Content Sections */}
        {article.content.sections.map((section, index) => (
          <Card key={index} className={`bg-${theme.surface}/80 border-${theme.border} shadow-${theme.shadow} backdrop-blur-sm`}>
            <CardContent className="p-8">
              <h2 className={`text-2xl font-bold text-${theme.primary} mb-6`}>
                {section.title}
              </h2>
              <p className={`text-${theme.light}/90 leading-relaxed text-lg mb-6`}>
                {section.content}
              </p>
              
              {/* Key Points */}
              <div className={`bg-${theme.bg}/50 rounded-xl p-6 border-${theme.border}`}>
                <h3 className={`text-lg font-semibold text-${theme.accent} mb-4`}>Key Points:</h3>
                <ul className="space-y-2">
                  {section.keyPoints.map((point, pointIndex) => (
                    <li key={pointIndex} className={`flex items-start gap-3 text-${theme.light}/90`}>
                      <CheckCircle className={`h-5 w-5 text-${theme.accent} mt-0.5 flex-shrink-0`} />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        ))}


        {/* Conclusion */}
        <Card className={`bg-${theme.surface}/80 border-${theme.border} shadow-${theme.shadow} backdrop-blur-sm`}>
          <CardContent className="p-8">
            <h2 className={`text-2xl font-bold text-${theme.primary} mb-4`}>Conclusion</h2>
            <p className={`text-${theme.light}/90 leading-relaxed text-lg mb-6`}>
              {article.content.conclusion}
            </p>
            
            {/* Related Topics */}
            <div className={`bg-${theme.bg}/50 rounded-xl p-6 border-${theme.border}`}>
              <h3 className={`text-lg font-semibold text-${theme.accent} mb-4`}>Related Topics:</h3>
              <div className="flex flex-wrap gap-2">
                {article.content.relatedTopics.map((topic, index) => (
                  <span 
                    key={index}
                    className={`text-sm px-3 py-1 bg-${theme.primary}/20 text-${theme.primary} rounded-lg`}
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center" ref={endOfArticleRef}>
          <Button 
            onClick={handleBackToResults}
            size="lg" 
            className={`bg-${theme.gradient} hover:bg-${theme.primary} text-white border-${theme.border}`}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Results
          </Button>
          
          <Button 
            onClick={handleBackHome}
            variant="outline" 
            size="lg"
            className={`border-${theme.border} text-${theme.light} hover:bg-${theme.surface}/50`}
          >
            <Home className="h-4 w-4 mr-2" />
            Back Home
          </Button>
        </div>
        
        {/* Reading Completion Indicator */}
        {pointsAwarded && (
          <div className={`text-center py-4`}>
            <div className={`inline-flex items-center gap-2 px-4 py-2 bg-${theme.primary}/20 text-${theme.primary} rounded-xl border border-${theme.primary}/30`}>
              <Trophy className="h-4 w-4" />
              <span className="text-sm font-medium">Article completed - 200 points earned!</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
