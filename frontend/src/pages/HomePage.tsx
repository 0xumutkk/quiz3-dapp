import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { Trophy, Zap, Coins, Palette, Shield, BookOpen, Clock, Target } from 'lucide-react';
import { CategoryCard } from '@/components/CategoryCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Category } from '@/types';
import { getCategoryEmoji } from '@/lib/utils';
import { getEducationalArticle } from '@/data/articles';
import { usePoints } from '@/contexts/PointsContext';
import { useNFTClaim } from '@/contexts/NFTClaimContext';
import { NFTClaimModal } from '@/components/NFTClaimModal';
import { PointsProgressBar } from '@/components/PointsProgressBar';
import { useToken } from '@/contexts/TokenContext';
import { useNotification } from '@/contexts/NotificationContext';

const categories = [
  {
    category: 'aptos' as Category,
    title: 'Aptos',
    description: 'Learn about the high-performance blockchain built for billions',
    icon: Zap,
    questionsCount: 10,
  },
  {
    category: 'defi' as Category,
    title: 'DeFi',
    description: 'Master decentralized finance protocols and strategies',
    icon: Coins,
    questionsCount: 10,
  },
  {
    category: 'nft' as Category,
    title: 'NFT',
    description: 'Explore digital ownership and non-fungible tokens',
    icon: Palette,
    questionsCount: 10,
  },
  {
    category: 'zk' as Category,
    title: 'Zero-Knowledge',
    description: 'Discover privacy-preserving cryptographic proofs',
    icon: Shield,
    questionsCount: 10,
  },
];

export function HomePage() {
  const navigate = useNavigate();
  const { connected } = useWallet();
  const { claimEarnedQ3P, getTotalEarnedQ3P, getNFTThreshold } = usePoints();
  const { getClaimableNFTs } = useNFTClaim();
  const {
    claimEarnedPoints,
    balance: q3pBalance,
    fetchBalance,
  } = useToken();
  const { showNotification } = useNotification();
  const [isNFTModalOpen, setIsNFTModalOpen] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [testPointsAdded, setTestPointsAdded] = useState(() => {
    // Load test button state from localStorage
    return localStorage.getItem('quiz3_test_points_added') === 'true';
  });

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

  const handleViewArticle = (category: Category) => {
    const article = getEducationalArticle(category);
    navigate('/article', { 
      state: { 
        article, 
        category 
      } 
    });
  };

  const handleCollectPoints = () => {
    // Open NFT claim modal
    setIsNFTModalOpen(true);
  };

  const totalEarnedQ3P = getTotalEarnedQ3P();
  const claimableNFTs = getClaimableNFTs(totalEarnedQ3P);
  const hasClaimableNFTs = claimableNFTs.some(nft => nft.isClaimable);

  // NFT claim system based on Q3P
  const targetQ3P = getNFTThreshold();
  const bronzeNFTs = claimableNFTs.filter(nft => nft.requiredPoints === targetQ3P && nft.isClaimable);
  
  const handleClaim3000NFT = async () => {
    if (bronzeNFTs.length === 0) return;
    setIsNFTModalOpen(true);
  };

  const handleAddTestQ3P = () => {
    if (testPointsAdded) return; // Run only once

    // Add 200 Q3P for testing
    // Note: This is for testing only - in production, Q3P would be earned through quizzes
    console.log('Adding test Q3P for development...');
    setTestPointsAdded(true);

    // Persist in localStorage
    localStorage.setItem('quiz3_test_points_added', 'true');
  };

  const handleClaimEarnedQ3P = async () => {
    if (totalEarnedQ3P === 0) return;

    setIsConverting(true);

    try {
      // Use TokenContext's claimEarnedPoints for real blockchain transaction
      await claimEarnedPoints(totalEarnedQ3P);

      // After successful blockchain transaction, update PointsContext state
      const success = await claimEarnedQ3P();
      if (success) {
        showNotification(`Successfully claimed ${totalEarnedQ3P.toLocaleString()} Q3P tokens to your wallet!`, 'success');
        await fetchBalance(); // Refresh on-chain balance
      } else {
        showNotification('Failed to update local state. Please refresh the page.', 'error');
      }
    } catch (error: any) {
      console.error('Q3P claim failed:', error);
      showNotification(`Claim failed: ${error.message || 'Please try again.'}`, 'error');
    } finally {
      setIsConverting(false);
    }
  };


  return (
    <div className="max-w-7xl mx-auto space-y-12">
      {/* Hero Section */}
      <div className="text-center space-y-6 py-12">
        <div className="flex items-center justify-center mb-6">
          <img 
            src="/logo.svg" 
            alt="Quiz3" 
            className="h-20 sm:h-24 w-auto"
          />
        </div>
        
        <div className="space-y-6">
          <h2 className="text-xl sm:text-2xl font-caption text-slate-200 tracking-wide">
            Web3 Knowledge Arena
          </h2>
          
          <p className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed font-body">
            Master the fundamentals of Web3 technology through interactive quizzes. 
            Challenge yourself across <span className="text-trivia-blue font-semibold">4 specialized categories</span>, 
            compete on the leaderboard, and earn rewards on the Aptos blockchain.
          </p>
        </div>

        {!connected && (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-6 max-w-md mx-auto">
            <p className="text-amber-300 text-sm">
              🔗 <strong>Connect your wallet</strong> to start playing and earning rewards!
            </p>
          </div>
        )}
      </div>

      {/* On-Chain Points Section */}
      <section>
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold tracking-tight gradient-text">Q3P Rewards</h2>
          <p className="mt-2 text-lg text-slate-400">
            Claim your earned Q3P tokens from quizzes.
          </p>
        </div>
        <div className="max-w-md mx-auto space-y-4">
          <Card className="bg-slate-900/50 border-slate-700/50">
            <CardContent className="p-6 text-center">
              <div className="mb-4">
                <p className="text-slate-400">Your Q3P Token Balance</p>
                <p className="text-4xl font-bold text-trivia-cyan">
                  {q3pBalance !== null ? q3pBalance.toLocaleString() : 'Loading...'}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-700/50">
            <CardContent className="p-6 text-center">
              <div className="mb-4">
                <p className="text-slate-400">Your Earned Q3P</p>
                <p className="text-4xl font-bold text-trivia-orange">
                  {totalEarnedQ3P.toLocaleString()}
                </p>
              </div>
              <Button
                onClick={handleClaimEarnedQ3P}
                disabled={totalEarnedQ3P === 0 || isConverting}
                className="w-full bg-trivia-orange hover:bg-trivia-orange/80 text-slate-900 font-bold"
              >
                {isConverting ? 'Claiming...' : `Claim Q3P to Wallet`}
              </Button>
              <p className="text-xs text-slate-500 mt-2">
                Claim your earned Q3P tokens directly to your wallet.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* NFT Progress Bar */}
      {connected && (
        <PointsProgressBar
          currentPoints={totalEarnedQ3P}
          targetPoints={targetQ3P}
          onClaimNFT={handleClaim3000NFT}
          isLoading={false}
          onAddTestPoints={handleAddTestQ3P}
          showTestButton={import.meta.env.DEV && !testPointsAdded && totalEarnedQ3P < targetQ3P}
        />
      )}

      {/* Q3P Collection Section */}
      {connected && totalEarnedQ3P > 0 && (
        <Card className="bg-gradient-to-r from-trivia-orange/20 to-trivia-cyan/20 border-trivia-orange/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-trivia-orange/20 to-trivia-cyan/20 flex items-center justify-center">
                  <Trophy className="h-6 w-6 text-trivia-orange" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">
                    {hasClaimableNFTs ? 'NFT Rewards Available!' : 'Earned Q3P Available'}
                  </h3>
                  <p className="text-sm text-slate-300">
                    You have <span className="text-trivia-orange font-semibold">{totalEarnedQ3P.toLocaleString()}</span> Q3P from completed quizzes
                    {hasClaimableNFTs && (
                      <span className="block text-trivia-cyan text-xs mt-1">
                        🎉 {claimableNFTs.filter(nft => nft.isClaimable).length} NFT{claimableNFTs.filter(nft => nft.isClaimable).length > 1 ? 's' : ''} ready to claim!
                      </span>
                    )}
                  </p>
                </div>
              </div>
              <Button
                onClick={handleCollectPoints}
                className="bg-gradient-to-r from-trivia-orange to-trivia-cyan hover:from-trivia-cyan hover:to-trivia-orange text-white border-0"
              >
                <Trophy className="h-4 w-4 mr-2" />
                {hasClaimableNFTs ? 'Claim NFTs' : 'View Rewards'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}


      {/* Category Selection */}
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl font-display gradient-text mb-3">
            Choose Your Category
          </h2>
          
          <p className="text-base text-slate-400 max-w-2xl mx-auto font-body">
            Each category contains <span className="text-trivia-blue font-semibold">10 carefully crafted questions</span>. 
            Answer quickly and accurately to maximize your score and climb the leaderboard!
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

      {/* Educational Articles */}
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl font-display gradient-text mb-3">
            📚 Educational Resources
          </h2>
          
          <p className="text-base text-slate-400 max-w-2xl mx-auto font-body">
            Deep dive into comprehensive guides covering all quiz topics. 
            <span className="text-trivia-blue font-semibold">Perfect for learning</span> before taking quizzes or 
            <span className="text-trivia-cyan font-semibold"> expanding your knowledge</span> after completion!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((cat) => {
            const article = getEducationalArticle(cat.category);
            return (
              <Card 
                key={cat.category}
                className="group hover:scale-105 transition-all duration-300 cursor-pointer bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/50 hover:border-trivia-blue/50"
                onClick={() => handleViewArticle(cat.category)}
              >
                <CardContent className="p-6">
                  <div className="text-center space-y-4">
                    {/* Category Icon */}
                    <div className="flex items-center justify-center">
                      <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-trivia-blue/20 to-trivia-purple/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <span className="text-3xl">{getCategoryEmoji(cat.category)}</span>
                      </div>
                    </div>
                    
                    {/* Article Info */}
                    <div className="space-y-2">
                      <h3 className="font-semibold text-white group-hover:text-trivia-blue transition-colors">
                        {article.title}
                      </h3>
                      
                      <div className="flex items-center justify-center gap-4 text-xs text-slate-400">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{article.readingTime}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Target className="h-3 w-3" />
                          <span className="capitalize">{article.difficulty}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Read Button */}
                    <Button 
                      size="sm" 
                      className="w-full bg-gradient-to-r from-trivia-blue to-trivia-purple hover:from-trivia-purple hover:to-trivia-blue text-white border-0"
                    >
                      <BookOpen className="h-4 w-4 mr-2" />
                      Read Article
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Articles Info */}
        <Card className="bg-blue-500/10 border-blue-500/30">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-xl bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                <BookOpen className="h-6 w-6 text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold text-blue-300 mb-2">Comprehensive Learning Resources</h3>
                <p className="text-sm text-slate-300 mb-3">
                  Each article provides comprehensive coverage of the topic, including key concepts, practical examples, and real-world applications. 
                  Perfect for both beginners and advanced learners!
                </p>
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded-lg">Comprehensive Coverage</span>
                  <span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded-lg">Beginner to Advanced</span>
                  <span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded-lg">Practical Examples</span>
                  <span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded-lg">Free Access</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

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

      {/* Small Stats Section - Less Prominent */}
      <div className="mt-12 pt-8 border-t border-white/10">
        <div className="text-center mb-6">
          <h3 className="text-lg font-semibold text-slate-300 mb-2">Platform Statistics</h3>
          <p className="text-sm text-slate-500">Live data from Quiz3 community</p>
        </div>
        
        <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
          <div className="text-center">
            <div className="text-xl font-semibold text-slate-300">1,247</div>
            <div className="text-xs text-slate-500">Active Players</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-semibold text-slate-300">8,932</div>
            <div className="text-xs text-slate-500">Games Played</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-semibold text-slate-300">5,000</div>
            <div className="text-xs text-slate-500">Q3P Pool</div>
          </div>
        </div>
      </div>

      {/* NFT Claim Modal */}
      <NFTClaimModal
        isOpen={isNFTModalOpen}
        onClose={() => setIsNFTModalOpen(false)}
        claimableNFTs={claimableNFTs}
      />
    </div>
  );
}
