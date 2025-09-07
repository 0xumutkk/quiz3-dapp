import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { Aptos, AptosConfig, Network } from '@aptos-labs/ts-sdk';
import { ClaimableNFT, NFTClaim, ClaimResult } from '@/types';

interface NFTClaimContextType {
  claimableNFTs: ClaimableNFT[];
  userNFTs: NFTClaim[];
  claimNFT: (nftId: string) => Promise<ClaimResult>;
  getClaimableNFTs: (userPoints: number) => ClaimableNFT[];
  isLoading: boolean;
  error: string | null;
}

const NFTClaimContext = createContext<NFTClaimContextType | undefined>(undefined);

// NFT Collection Data
const NFT_COLLECTION: ClaimableNFT[] = [
  {
    id: 'aptos-bronze',
    name: 'Aptos Bronze Explorer',
    description: 'A bronze badge for completing your first Aptos quiz with 3000+ points',
    imageUrl: '/nfts/aptos-bronze.svg',
    requiredPoints: 3000,
    rarity: 'common',
    category: 'aptos',
    isClaimable: false,
    isClaimed: false,
  },
  {
    id: 'aptos-gold',
    name: 'Aptos Gold Master',
    description: 'A gold badge for mastering Aptos with 5000+ points',
    imageUrl: '/nfts/aptos-gold.svg',
    requiredPoints: 5000,
    rarity: 'rare',
    category: 'aptos',
    isClaimable: false,
    isClaimed: false,
  },
  {
    id: 'defi-bronze',
    name: 'DeFi Bronze Trader',
    description: 'A bronze badge for completing your first DeFi quiz with 3000+ points',
    imageUrl: '/nfts/defi-bronze.svg',
    requiredPoints: 3000,
    rarity: 'common',
    category: 'defi',
    isClaimable: false,
    isClaimed: false,
  },
  {
    id: 'defi-gold',
    name: 'DeFi Gold Master',
    description: 'A gold badge for mastering DeFi with 5000+ points',
    imageUrl: '/nfts/defi-gold.svg',
    requiredPoints: 5000,
    rarity: 'rare',
    category: 'defi',
    isClaimable: false,
    isClaimed: false,
  },
  {
    id: 'nft-bronze',
    name: 'NFT Bronze Collector',
    description: 'A bronze badge for completing your first NFT quiz with 3000+ points',
    imageUrl: '/nfts/nft-bronze.svg',
    requiredPoints: 3000,
    rarity: 'common',
    category: 'nft',
    isClaimable: false,
    isClaimed: false,
  },
  {
    id: 'nft-gold',
    name: 'NFT Gold Master',
    description: 'A gold badge for mastering NFTs with 5000+ points',
    imageUrl: '/nfts/nft-gold.svg',
    requiredPoints: 5000,
    rarity: 'rare',
    category: 'nft',
    isClaimable: false,
    isClaimed: false,
  },
  {
    id: 'zk-bronze',
    name: 'ZK Bronze Explorer',
    description: 'A bronze badge for completing your first ZK quiz with 3000+ points',
    imageUrl: '/nfts/zk-bronze.svg',
    requiredPoints: 3000,
    rarity: 'common',
    category: 'zk',
    isClaimable: false,
    isClaimed: false,
  },
  {
    id: 'zk-gold',
    name: 'ZK Gold Master',
    description: 'A gold badge for mastering ZK with 5000+ points',
    imageUrl: '/nfts/zk-gold.svg',
    requiredPoints: 5000,
    rarity: 'rare',
    category: 'zk',
    isClaimable: false,
    isClaimed: false,
  },
];

export function NFTClaimProvider({ children }: { children: ReactNode }) {
  const { account, signAndSubmitTransaction } = useWallet();
  const [userNFTs, setUserNFTs] = useState<NFTClaim[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Aptos SDK configuration
  const config = new AptosConfig({ network: Network.TESTNET });
  const aptos = new Aptos(config);

  // Load user NFTs from localStorage
  useEffect(() => {
    const savedNFTs = localStorage.getItem('quiz3_user_nfts');
    if (savedNFTs) {
      try {
        const parsedNFTs = JSON.parse(savedNFTs);
        setUserNFTs(parsedNFTs);
      } catch (err) {
        console.error('Error loading user NFTs:', err);
      }
    }
  }, []);

  // Save user NFTs to localStorage
  useEffect(() => {
    if (userNFTs.length > 0) {
      localStorage.setItem('quiz3_user_nfts', JSON.stringify(userNFTs));
    }
  }, [userNFTs]);

  const getClaimableNFTs = (userPoints: number): ClaimableNFT[] => {
    return NFT_COLLECTION.map(nft => {
      const isClaimable = userPoints >= nft.requiredPoints;
      const isClaimed = userNFTs.some(userNFT => userNFT.id === nft.id);
      
      return {
        ...nft,
        isClaimable: isClaimable && !isClaimed,
        isClaimed,
      };
    });
  };

  const claimNFT = async (nftId: string): Promise<ClaimResult> => {
    if (!account || !signAndSubmitTransaction) {
      return {
        success: false,
        error: 'Wallet not connected',
      };
    }

    setIsLoading(true);
    setError(null);

    try {
      // Find the NFT to claim
      const nftToClaim = NFT_COLLECTION.find(nft => nft.id === nftId);
      if (!nftToClaim) {
        throw new Error('NFT not found');
      }

      // Check if already claimed
      const alreadyClaimed = userNFTs.some(nft => nft.id === nftId);
      if (alreadyClaimed) {
        throw new Error('NFT already claimed');
      }

      // Get current user points for logging
      const userPoints = JSON.parse(localStorage.getItem('quiz3_user_points') || '{"totalPoints": 0}').totalPoints;

      // Create NFT using Aptos Coin Transfer - Real Testnet Blockchain Transaction
      // For hackathon demo, we'll use a simple coin transfer to show real blockchain interaction
      console.log('🚀 Starting NFT claim transaction on TESTNET...');
      console.log('User address:', account.address);
      console.log('Network:', 'TESTNET');
      console.log('NFT to claim:', nftToClaim.name);
      console.log('Required points:', nftToClaim.requiredPoints);
      console.log('Current user points:', userPoints);
      console.log('Aptos config network:', aptos.config.network);
      
      const transactionPayload = {
        function: "0x1::aptos_account::transfer" as `${string}::${string}::${string}`,
        typeArguments: [],
        functionArguments: [
          account.address, // to (self-transfer for demo on testnet)
          "100", // amount (0.000001 APT - very small amount for testnet)
        ],
      };

      // Sign and submit transaction to real blockchain
      const response = await signAndSubmitTransaction({
        data: {
          function: transactionPayload.function,
          typeArguments: transactionPayload.typeArguments,
          functionArguments: transactionPayload.functionArguments,
        },
      });
      
      // Wait for transaction confirmation on blockchain
      const result = await aptos.waitForTransaction({
        transactionHash: response.hash,
      });

      if (result.success) {
        console.log('✅ TESTNET transaction successful!');
        console.log('Transaction hash:', response.hash);
        console.log('Explorer URL:', `https://explorer.aptoslabs.com/txn/${response.hash}?network=testnet`);
        
        // Add NFT to user's collection
        const newNFT: NFTClaim = {
          ...nftToClaim,
          claimed: true,
          claimDate: new Date(),
          transactionHash: response.hash,
        };

        setUserNFTs(prev => [...prev, newNFT]);

        return {
          success: true,
          transactionHash: response.hash,
          nftId: nftId,
        };
      } else {
        throw new Error('TESTNET blockchain transaction failed');
      }

    } catch (err) {
      console.error('❌ TESTNET NFT claim error:', err);
      console.log('Make sure you have testnet APT in your wallet!');
      console.log('Get testnet APT from: https://aptos.dev/network/faucet');
      
      const errorMessage = err instanceof Error ? err.message : 'Failed to claim NFT on TESTNET. Make sure you have testnet APT!';
      setError(errorMessage);
      
      return {
        success: false,
        error: errorMessage,
      };
    } finally {
      setIsLoading(false);
    }
  };

  const value: NFTClaimContextType = {
    claimableNFTs: NFT_COLLECTION,
    userNFTs,
    claimNFT,
    getClaimableNFTs,
    isLoading,
    error,
  };

  return (
    <NFTClaimContext.Provider value={value}>
      {children}
    </NFTClaimContext.Provider>
  );
}

export function useNFTClaim() {
  const context = useContext(NFTClaimContext);
  if (context === undefined) {
    throw new Error('useNFTClaim must be used within a NFTClaimProvider');
  }
  return context;
}
