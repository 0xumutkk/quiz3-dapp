import { useNavigate } from 'react-router-dom';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { Trophy, Zap, Coins, Palette, Shield, TrendingUp } from 'lucide-react';
import { CategoryCard } from '@/components/CategoryCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Category } from '@/types';

const categories = [
  {
    category: 'aptos' as Category,
    title: 'Aptos',
    description: 'Learn about the high-performance blockchain built for billions',
    icon: Zap,
    questionsCount: 5,
  },
  {
    category: 'defi' as Category,
    title: 'DeFi',
    description: 'Master decentralized finance protocols and strategies',
    icon: Coins,
    questionsCount: 5,
  },
  {
    category: 'nft' as Category,
    title: 'NFT',
    description: 'Explore digital ownership and non-fungible tokens',
    icon: Palette,
    questionsCount: 5,
  },
  {
    category: 'zk' as Category,
    title: 'Zero-Knowledge',
    description: 'Discover privacy-preserving cryptographic proofs',
    icon: Shield,
    questionsCount: 5,
  },
];

export function HomePage() {
  const navigate = useNavigate();
  const { connected } = useWallet();

  const handleCategorySelect = (category: Category) => {
    if (!connected) {
      // TODO: Show connect wallet modal
      return;
    }
    navigate(`/quiz/${category}`);
  };

  const handleViewLeaderboard = () => {
    navigate('/leaderboard');
  };

  const handleViewClaim = () => {
    navigate('/claim');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-12">
      {/* Hero Section */}
      <div className="text-center space-y-6 py-12">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Trophy className="h-12 w-12 text-trivia-blue" />
          <h1 className="text-4xl sm:text-6xl font-bold gradient-text">
            Quiz3
          </h1>
        </div>
        
        <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Test your Web3 knowledge across 4 exciting categories. Earn points, climb the leaderboard, 
          and claim weekly rewards on the Aptos blockchain.
        </p>

        {!connected && (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-6 max-w-md mx-auto">
            <p className="text-amber-300 text-sm">
              🔗 <strong>Connect your wallet</strong> to start playing and earning rewards!
            </p>
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="text-center">
          <CardContent className="p-6">
            <TrendingUp className="h-8 w-8 text-trivia-blue mx-auto mb-3" />
            <div className="text-3xl font-bold text-white mb-2">1,247</div>
            <div className="text-sm text-slate-400">Active Players</div>
          </CardContent>
        </Card>
        
        <Card className="text-center">
          <CardContent className="p-6">
            <Trophy className="h-8 w-8 text-trivia-cyan mx-auto mb-3" />
            <div className="text-3xl font-bold text-white mb-2">8,932</div>
            <div className="text-sm text-slate-400">Games Played</div>
          </CardContent>
        </Card>
        
        <Card className="text-center">
          <CardContent className="p-6">
            <Coins className="h-8 w-8 text-trivia-orange mx-auto mb-3" />
            <div className="text-3xl font-bold text-white mb-2">5,000</div>
            <div className="text-sm text-slate-400">APT Rewards Pool</div>
          </CardContent>
        </Card>
      </div>

      {/* Category Selection */}
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold gradient-text mb-3">
            Choose Your Category
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Each category contains 5 carefully crafted questions. Answer quickly and accurately to maximize your score!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {categories.map((cat) => (
            <CategoryCard
              key={cat.category}
              category={cat.category}
              title={cat.title}
              description={cat.description}
              questionsCount={cat.questionsCount}
              isCompleted={false} // TODO: Track completion status
              isLocked={!connected}
              onClick={() => handleCategorySelect(cat.category)}
            />
          ))}
        </div>
      </div>

      {/* Weekly Challenge */}
      <Card className="bg-gradient-to-r from-trivia-purple/20 to-trivia-blue/20 border-trivia-purple/30">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl gradient-text mb-2">
            🏆 Weekly Challenge
          </CardTitle>
          <CardDescription className="text-slate-300">
            Complete all categories to earn bonus rewards and climb the leaderboard!
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="flex items-center justify-center gap-8 text-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">4</div>
              <div className="text-slate-400">Categories</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">20</div>
              <div className="text-slate-400">Total Questions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">2,000</div>
              <div className="text-slate-400">Max Points</div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={handleViewLeaderboard} variant="outline">
              View Leaderboard
            </Button>
            <Button onClick={handleViewClaim} variant="secondary">
              Claim Rewards
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* How to Play */}
      <Card>
        <CardHeader>
          <CardTitle className="gradient-text">How to Play</CardTitle>
          <CardDescription>
            Master the game mechanics and maximize your rewards
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="h-8 w-8 rounded-full bg-gradient-primary flex items-center justify-center text-white font-bold text-sm">
                  1
                </div>
                <div>
                  <h4 className="font-semibold text-white">Connect & Choose</h4>
                  <p className="text-sm text-slate-400">Connect your wallet and select a category to start</p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <div className="h-8 w-8 rounded-full bg-gradient-primary flex items-center justify-center text-white font-bold text-sm">
                  2
                </div>
                <div>
                  <h4 className="font-semibold text-white">Answer Quickly</h4>
                  <p className="text-sm text-slate-400">You have 15 seconds per question. Speed affects your score!</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="h-8 w-8 rounded-full bg-gradient-primary flex items-center justify-center text-white font-bold text-sm">
                  3
                </div>
                <div>
                  <h4 className="font-semibold text-white">Build Streaks</h4>
                  <p className="text-sm text-slate-400">Consecutive correct answers earn bonus points</p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <div className="h-8 w-8 rounded-full bg-gradient-primary flex items-center justify-center text-white font-bold text-sm">
                  4
                </div>
                <div>
                  <h4 className="font-semibold text-white">Claim Rewards</h4>
                  <p className="text-sm text-slate-400">Top performers earn APT tokens at the end of each week</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
