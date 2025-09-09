import { useState, useEffect } from 'react';
import { X, Trophy, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ClaimableNFT, ClaimResult } from '@/types';
import { useNFTClaim } from '@/contexts/NFTClaimContext';

interface NFTClaimModalProps {
  isOpen: boolean;
  onClose: () => void;
  claimableNFTs: ClaimableNFT[];
}

export function NFTClaimModal({ isOpen, onClose, claimableNFTs }: NFTClaimModalProps) {
  const { claimNFT, isLoading } = useNFTClaim();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);
  const [claimingNFT, setClaimingNFT] = useState<string | null>(null);
  const [claimResult, setClaimResult] = useState<ClaimResult | null>(null);

  // Only render if modal is open and component is mounted (prevents provider issues during hot reload)
  if (!isOpen || !isMounted) return null;

  const handleClaimNFT = async (nftId: string) => {
    setClaimingNFT(nftId);
    setClaimResult(null);
    
    const result = await claimNFT(nftId);
    setClaimResult(result);
    setClaimingNFT(null);
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-gray-400 border-gray-400';
      case 'rare': return 'text-blue-400 border-blue-400';
      case 'epic': return 'text-purple-400 border-purple-400';
      case 'legendary': return 'text-yellow-400 border-yellow-400';
      default: return 'text-gray-400 border-gray-400';
    }
  };

  const getRarityBg = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-500/10';
      case 'rare': return 'bg-blue-500/10';
      case 'epic': return 'bg-purple-500/10';
      case 'legendary': return 'bg-yellow-500/10';
      default: return 'bg-gray-500/10';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 rounded-2xl border border-slate-700 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-trivia-orange/20 to-trivia-cyan/20 flex items-center justify-center">
              <Trophy className="h-5 w-5 text-trivia-orange" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">Claim Your NFTs</h2>
              <p className="text-sm text-slate-400">Earned through your quiz achievements</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-slate-400 hover:text-white"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6">
          {claimResult && (
            <div className={`mb-6 p-4 rounded-xl border ${
              claimResult.success 
                ? 'bg-green-500/10 border-green-500/30 text-green-300' 
                : 'bg-red-500/10 border-red-500/30 text-red-300'
            }`}>
              <div className="flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                <span className="font-semibold">
                  {claimResult.success ? 'NFT Claimed Successfully!' : 'Claim Failed'}
                </span>
              </div>
              <p className="text-sm mt-1">
                {claimResult.success 
                  ? `Transaction: ${claimResult.transactionHash?.slice(0, 10)}...`
                  : claimResult.error
                }
              </p>
            </div>
          )}

          {claimableNFTs.length === 0 ? (
            <div className="text-center py-12">
              <Trophy className="h-16 w-16 text-slate-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-300 mb-2">No NFTs Available</h3>
              <p className="text-slate-400">
                Complete more quizzes to earn points and unlock NFT rewards!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {claimableNFTs.map((nft) => (
                <Card 
                  key={nft.id}
                  className={`relative overflow-hidden transition-all duration-300 ${
                    nft.isClaimable 
                      ? 'hover:scale-105 cursor-pointer border-trivia-orange/30' 
                      : 'opacity-60'
                  } ${getRarityBg(nft.rarity)}`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg text-white">{nft.name}</CardTitle>
                      <span className={`px-2 py-1 rounded-lg text-xs font-semibold border ${getRarityColor(nft.rarity)}`}>
                        {nft.rarity.toUpperCase()}
                      </span>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {/* NFT Image */}
                    <div className="aspect-square bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl overflow-hidden border border-slate-700">
                      <img 
                        src={nft.imageUrl} 
                        alt={nft.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Fallback to placeholder if image fails to load
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const parent = target.parentElement;
                          if (parent) {
                            parent.innerHTML = `
                              <div class="flex items-center justify-center h-full">
                                <div class="text-center">
                                  <svg class="h-12 w-12 text-trivia-orange mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd"/>
                                  </svg>
                                  <p class="text-xs text-slate-400">NFT Image</p>
                                </div>
                              </div>
                            `;
                          }
                        }}
                      />
                    </div>

                    {/* Description */}
                    <p className="text-sm text-slate-300">{nft.description}</p>

                    {/* Requirements */}
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">Required Points:</span>
                      <span className="text-trivia-orange font-semibold">{nft.requiredPoints.toLocaleString()}</span>
                    </div>

                    {/* Status */}
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-400 capitalize">
                        {nft.category} Category
                      </span>
                      {nft.isClaimed ? (
                        <span className="text-xs text-green-400 font-semibold">✓ Claimed</span>
                      ) : nft.isClaimable ? (
                        <span className="text-xs text-trivia-orange font-semibold">Ready to Claim</span>
                      ) : (
                        <span className="text-xs text-slate-500">Not Available</span>
                      )}
                    </div>

                    {/* Claim Button */}
                    {nft.isClaimable && !nft.isClaimed && (
                      <Button
                        onClick={() => handleClaimNFT(nft.id)}
                        disabled={isLoading || claimingNFT === nft.id}
                        className="w-full bg-gradient-to-r from-trivia-orange to-trivia-cyan hover:from-trivia-cyan hover:to-trivia-orange text-white border-0"
                      >
                        {claimingNFT === nft.id ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Claiming...
                          </>
                        ) : (
                          <>
                            <Trophy className="h-4 w-4 mr-2" />
                            Claim NFT
                          </>
                        )}
                      </Button>
                    )}

                    {nft.isClaimed && (
                      <Button
                        variant="outline"
                        className="w-full border-green-500/30 text-green-400"
                        disabled
                      >
                        <Trophy className="h-4 w-4 mr-2" />
                        Claimed
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-700 bg-slate-800/50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-slate-400">
              NFTs are minted on the Aptos blockchain
            </div>
            <Button
              variant="outline"
              onClick={onClose}
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
