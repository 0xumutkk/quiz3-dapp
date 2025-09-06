import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Target, BookOpen, CheckCircle, Home } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Category, EducationalArticle } from '@/types';
import { getCategoryTheme, getCategoryEmoji } from '@/lib/utils';

interface LocationState {
  article: EducationalArticle;
  category: Category;
}

export function ArticlePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState;

  if (!state) {
    navigate('/');
    return null;
  }

  const { article, category } = state;
  const theme = getCategoryTheme(category);

  const handleBackToResults = () => {
    navigate(-1);
  };

  const handleBackHome = () => {
    navigate('/');
  };

  return (
    <div className={`min-h-screen bg-${theme.bgGradient} transition-all duration-500`}>
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
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
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
      </div>
    </div>
  );
}
