import { useState, useEffect } from 'react';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { Gift, Clock, CheckCircle, AlertCircle, ExternalLink, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getActiveSeason, getUserClaimStatus, type SeasonInfo, type UserClaimStatus } from '@/lib/view-functions/season';
import { claimRewards, type ClaimParams } from '@/lib/entry-functions/claim';
import { generateSeasonMerkleTree, createSampleRewards } from '@/lib/merkle-tree';

// Dummy claim data
const DUMMY_CLAIMS = [
  {
    season_id: '42',
    week: 'Nov 6-12, 2024',
    amount: 150.5,
    claimed: true,
    tx_hash: '0x1a2b3c4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890',
    rank: 8,
  },
  {
    season_id: '43',
    week: 'Nov 13-19, 2024',
    amount: 0,
    claimed: false,
    tx_hash: null,
    rank: 0,
    status: 'active' // current week
  },
  {
    season_id: '44',
    week: 'Nov 20-26, 2024',
    amount: 0,
    claimed: false,
    tx_hash: null,
    rank: 0,
    status: 'upcoming'
  }
];

export function ClaimPage() {
  const { connected, account } = useWallet();
  const [claimingSeasonId, setClaimingSeasonId] = useState<string | null>(null);
  const [, setSeasonInfo] = useState<SeasonInfo | null>(null);
  const [, setUserClaimStatus] = useState<UserClaimStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch season and user data
  useEffect(() => {
    const fetchData = async () => {
      if (!connected || !account?.address) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Fetch active season info
        const season = await getActiveSeason();
        setSeasonInfo(season);

        // Fetch user claim status
        const claimStatus = await getUserClaimStatus(account.address);
        setUserClaimStatus(claimStatus);

      } catch (err) {
        console.error('Error fetching claim data:', err);
        setError('Failed to load claim data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [connected, account?.address]);

  const handleClaim = async (seasonId: string, amount: number) => {
    if (!connected || !account?.address) return;

    setClaimingSeasonId(seasonId);
    
    try {
      // Generate Merkle proof for the user
      const sampleRewards = createSampleRewards(parseInt(seasonId));
      const { proofs } = generateSeasonMerkleTree(sampleRewards);
      
      // Find user's proof (in real app, this would come from backend)
      const userProof = proofs.get(account.address);
      if (!userProof) {
        throw new Error('No rewards found for this address');
      }

      // Prepare claim parameters
      const claimParams: ClaimParams = {
        season: parseInt(seasonId),
        amount: amount.toString(),
        merkleProof: userProof.proof,
        merkleRoot: userProof.root,
      };

      // Execute claim transaction
      const result = await claimRewards(account, claimParams);
      
      if (result.success) {
        alert(`Successfully claimed ${amount} APT for season ${seasonId}!`);
        // Refresh data
        const claimStatus = await getUserClaimStatus(account.address);
        setUserClaimStatus(claimStatus);
      } else {
        throw new Error(result.error || 'Claim failed');
      }
      
    } catch (error) {
      console.error('Claim failed:', error);
      alert(`Claim failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setClaimingSeasonId(null);
    }
  };

  const openExplorerLink = (txHash: string) => {
    window.open(`https://explorer.aptoslabs.com/txn/${txHash}?network=testnet`, '_blank');
  };

  if (!connected) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card className="text-center">
          <CardContent className="p-12">
            <Gift className="h-16 w-16 text-trivia-purple mx-auto mb-6" />
            <h2 className="text-2xl font-bold gradient-text mb-4">
              Connect Wallet to View Claims
            </h2>
            <p className="text-slate-400 mb-6">
              Connect your wallet to view and claim your weekly trivia rewards.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card className="text-center">
          <CardContent className="p-12">
            <Loader2 className="h-16 w-16 text-trivia-purple mx-auto mb-6 animate-spin" />
            <h2 className="text-2xl font-bold gradient-text mb-4">
              Loading Claim Data
            </h2>
            <p className="text-slate-400 mb-6">
              Fetching your reward information from the blockchain...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card className="text-center">
          <CardContent className="p-12">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-red-500 mb-4">
              Error Loading Data
            </h2>
            <p className="text-slate-400 mb-6">
              {error}
            </p>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Gift className="h-10 w-10 text-trivia-purple" />
          <h1 className="text-4xl font-bold gradient-text">
            Claim Rewards
          </h1>
        </div>
        <p className="text-slate-400 max-w-2xl mx-auto">
          Claim your weekly APT rewards based on your leaderboard performance. 
          Rewards are distributed every Monday at 00:00 UTC.
        </p>
      </div>

      {/* User Info */}
      <Card className="bg-gradient-to-r from-trivia-purple/20 to-trivia-blue/20 border-trivia-purple/30">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-white mb-1">Connected Wallet</h3>
              <p className="font-mono text-sm text-slate-300">{account?.address}</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-trivia-cyan">350.5 APT</div>
              <div className="text-sm text-slate-400">Total Claimed</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Claims List */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white mb-4">Season Rewards</h2>
        
        {DUMMY_CLAIMS.map((claim) => (
          <Card 
            key={claim.season_id}
            className={claim.status === 'active' ? 'ring-1 ring-trivia-blue/50' : ''}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-xl bg-gradient-primary flex items-center justify-center text-white font-bold">
                    {claim.season_id}
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">
                      Season {claim.season_id}
                      {claim.status === 'active' && (
                        <span className="ml-2 px-2 py-1 text-xs bg-blue-500/20 text-blue-300 rounded-lg">
                          Active
                        </span>
                      )}
                      {claim.status === 'upcoming' && (
                        <span className="ml-2 px-2 py-1 text-xs bg-slate-600/20 text-slate-400 rounded-lg">
                          Upcoming
                        </span>
                      )}
                    </h3>
                    <p className="text-sm text-slate-400 mb-2">{claim.week}</p>
                    {claim.rank > 0 && (
                      <p className="text-sm text-trivia-cyan">
                        Rank #{claim.rank} • Eligible for rewards
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-xl font-bold text-white mb-1">
                      {claim.amount > 0 ? `${claim.amount} APT` : '—'}
                    </div>
                    
                    {claim.claimed && (
                      <div className="flex items-center gap-1 text-green-400">
                        <CheckCircle className="h-4 w-4" />
                        <span className="text-sm">Claimed</span>
                      </div>
                    )}
                    
                    {claim.status === 'active' && (
                      <div className="flex items-center gap-1 text-blue-400">
                        <Clock className="h-4 w-4" />
                        <span className="text-sm">In Progress</span>
                      </div>
                    )}
                    
                    {claim.status === 'upcoming' && (
                      <div className="flex items-center gap-1 text-slate-400">
                        <Clock className="h-4 w-4" />
                        <span className="text-sm">Upcoming</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Action Button */}
                  {claim.claimed && claim.tx_hash ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openExplorerLink(claim.tx_hash!)}
                      className="flex items-center gap-2"
                    >
                      View TX
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  ) : claim.amount > 0 && !claim.claimed && claim.status !== 'active' ? (
                    <Button
                      onClick={() => handleClaim(claim.season_id, claim.amount)}
                      disabled={claimingSeasonId === claim.season_id}
                      className="min-w-24"
                    >
                      {claimingSeasonId === claim.season_id ? 'Claiming...' : 'Claim'}
                    </Button>
                  ) : (
                    <div className="w-24"></div> // Placeholder for alignment
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Info Card */}
      <Card className="bg-blue-500/10 border-blue-500/30">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <AlertCircle className="h-6 w-6 text-blue-400 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-blue-300 mb-2">How Rewards Work</h3>
              <ul className="space-y-1 text-sm text-slate-300">
                <li>• Top 10 players each week earn APT rewards</li>
                <li>• Rewards are distributed every Monday at 00:00 UTC</li>
                <li>• You must be connected with the same wallet to claim</li>
                <li>• Unclaimed rewards expire after 30 days</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
