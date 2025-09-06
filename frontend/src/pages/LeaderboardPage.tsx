import { useState } from 'react';
import { Trophy, Medal, Award, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Category, LeaderboardEntry } from '@/types';
import { formatAddress, getCategoryEmoji } from '@/lib/utils';

// Dummy leaderboard data
const generateDummyLeaderboard = (): LeaderboardEntry[] => {
  const dummyUsers = [
    { wallet: '0x1a2b3c4d5e6f7890abcdef1234567890abcdef12', name: 'CryptoMaster' },
    { wallet: '0x2b3c4d5e6f7890abcdef1234567890abcdef1234', name: 'BlockchainPro' },
    { wallet: '0x3c4d5e6f7890abcdef1234567890abcdef123456', name: 'DeFiExpert' },
    { wallet: '0x4d5e6f7890abcdef1234567890abcdef12345678', name: 'NFTCollector' },
    { wallet: '0x5e6f7890abcdef1234567890abcdef1234567890', name: 'ZKWizard' },
    { wallet: '0x6f7890abcdef1234567890abcdef123456789012', name: 'Web3Pioneer' },
    { wallet: '0x7890abcdef1234567890abcdef12345678901234', name: 'AptosBuilder' },
    { wallet: '0x890abcdef1234567890abcdef123456789012345', name: 'SmartContractDev' },
    { wallet: '0x90abcdef1234567890abcdef1234567890123456', name: 'ConsensusKing' },
    { wallet: '0x0abcdef1234567890abcdef12345678901234567', name: 'DecentralizedDAO' },
  ];

  return dummyUsers.map((user, index) => ({
    rank: index + 1,
    user: user.wallet,
    total_points: Math.floor(Math.random() * 8000) + 2000 - index * 200,
    total_time_ms: Math.floor(Math.random() * 300000) + 60000,
    category_scores: {
      aptos: Math.floor(Math.random() * 2000) + 500,
      defi: Math.floor(Math.random() * 2000) + 500,
      nft: Math.floor(Math.random() * 2000) + 500,
      zk: Math.floor(Math.random() * 2000) + 500,
    }
  }));
};

const DUMMY_LEADERBOARD = generateDummyLeaderboard();

export function LeaderboardPage() {
  const [activeTab, setActiveTab] = useState<'general' | Category>('general');

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 2: return <Medal className="h-5 w-5 text-gray-400" />;
      case 3: return <Award className="h-5 w-5 text-amber-600" />;
      default: return <div className="h-5 w-5 flex items-center justify-center text-slate-400 font-bold text-sm">#{rank}</div>;
    }
  };

  const getLeaderboardData = (category?: Category) => {
    if (!category) return DUMMY_LEADERBOARD;
    
    // Sort by category scores
    return [...DUMMY_LEADERBOARD]
      .sort((a, b) => b.category_scores[category] - a.category_scores[category])
      .map((entry, index) => ({ ...entry, rank: index + 1 }));
  };

  const renderLeaderboard = (data: LeaderboardEntry[], category?: Category) => (
    <div className="space-y-3">
      {data.slice(0, 10).map((entry, index) => (
        <Card 
          key={entry.user}
          className={`leaderboard-card ${index < 3 ? 'ring-1 ring-trivia-purple/30' : ''}`}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {getRankIcon(entry.rank)}
                <div>
                  <div className="font-semibold text-white">
                    {formatAddress(entry.user)}
                  </div>
                  <div className="text-sm text-slate-400">
                    {(entry.total_time_ms / 1000 / 60).toFixed(1)} min total time
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-xl font-bold text-trivia-cyan">
                  {category 
                    ? entry.category_scores[category].toLocaleString()
                    : entry.total_points.toLocaleString()
                  }
                </div>
                <div className="text-xs text-slate-400">points</div>
              </div>
            </div>
            
            {!category && (
              <div className="mt-3 grid grid-cols-4 gap-2 text-center text-xs">
                {(['aptos', 'defi', 'nft', 'zk'] as Category[]).map(cat => (
                  <div key={cat} className="bg-slate-700/30 rounded-lg py-1">
                    <div className="text-slate-300">
                      {getCategoryEmoji(cat)} {entry.category_scores[cat]}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Trophy className="h-10 w-10 text-trivia-purple" />
          <h1 className="text-4xl font-bold gradient-text">
            Leaderboard
          </h1>
        </div>
        <p className="text-slate-400 max-w-2xl mx-auto">
          See how you rank against other Web3 enthusiasts. Top performers earn weekly APT rewards!
        </p>
      </div>

      {/* Weekly Race Info */}
      <Card className="bg-gradient-to-r from-trivia-purple/20 to-trivia-blue/20 border-trivia-purple/30">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-white mb-1">Current Weekly Race</h3>
              <p className="text-sm text-slate-300">Week 42 • Nov 13-19, 2024</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-trivia-cyan">5,000 APT</div>
              <div className="text-sm text-slate-400">Reward Pool</div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-white">1,247</div>
              <div className="text-sm text-slate-400">Players</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as typeof activeTab)}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="aptos" className="flex items-center gap-2">
            {getCategoryEmoji('aptos')} Aptos
          </TabsTrigger>
          <TabsTrigger value="defi" className="flex items-center gap-2">
            {getCategoryEmoji('defi')} DeFi
          </TabsTrigger>
          <TabsTrigger value="nft" className="flex items-center gap-2">
            {getCategoryEmoji('nft')} NFT
          </TabsTrigger>
          <TabsTrigger value="zk" className="flex items-center gap-2">
            {getCategoryEmoji('zk')} ZK
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-trivia-purple" />
                Overall Rankings
              </CardTitle>
            </CardHeader>
            <CardContent>
              {renderLeaderboard(getLeaderboardData())}
            </CardContent>
          </Card>
        </TabsContent>

        {(['aptos', 'defi', 'nft', 'zk'] as Category[]).map(category => (
          <TabsContent key={category} value={category} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 capitalize">
                  <span className="text-xl">{getCategoryEmoji(category)}</span>
                  {category} Rankings
                </CardTitle>
              </CardHeader>
              <CardContent>
                {renderLeaderboard(getLeaderboardData(category), category)}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      {/* Reward Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-trivia-orange" />
            Weekly Reward Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
            <div className="space-y-2">
              <div className="text-3xl">🥇</div>
              <div className="text-lg font-bold text-yellow-500">1st Place</div>
              <div className="text-2xl font-bold text-white">2,000 APT</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl">🥈</div>
              <div className="text-lg font-bold text-gray-400">2nd Place</div>
              <div className="text-2xl font-bold text-white">1,200 APT</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl">🥉</div>
              <div className="text-lg font-bold text-amber-600">3rd Place</div>
              <div className="text-2xl font-bold text-white">800 APT</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl">🏆</div>
              <div className="text-lg font-bold text-trivia-purple">Top 10</div>
              <div className="text-2xl font-bold text-white">100 APT</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}