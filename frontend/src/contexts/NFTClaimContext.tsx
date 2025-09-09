import { createContext, useContext, ReactNode, useCallback, useState } from 'react';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { useNotification } from '@/contexts/NotificationContext';
// import { toast } from 'react-hot-toast';
import { aptos, MODULE_ADDRESS, Q3P_TOKEN_MODULE, NFT_MODULE } from '@/lib/aptos';
import { usePoints } from './PointsContext';
import { ClaimableNFT, ClaimResult } from '@/types';

interface NFTClaimContextType {
  claimableNFTs: ClaimableNFT[];
  claimNFT: (nftId: string) => Promise<ClaimResult>;
  getClaimableNFTs: (totalPoints: number) => ClaimableNFT[];
  isLoading: boolean;
}

const NFTClaimContext = createContext<NFTClaimContextType | undefined>(undefined);

// NFT Collection Data
const NFT_COLLECTION: ClaimableNFT[] = [
  {
    id: 'aptos-bronze',
    name: 'Aptos Bronze Explorer',
    description: 'A bronze badge for completing your first Aptos quiz with 3000+ Q3P',
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
    description: 'A gold badge for mastering Aptos with 5000+ Q3P',
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
    description: 'A bronze badge for completing your first DeFi quiz with 3000+ Q3P',
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
    description: 'A gold badge for mastering DeFi with 5000+ Q3P',
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
    description: 'A bronze badge for completing your first NFT quiz with 3000+ Q3P',
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
    description: 'A gold badge for mastering NFTs with 5000+ Q3P',
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
    description: 'A bronze badge for completing your first ZK quiz with 3000+ Q3P',
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
    description: 'A gold badge for mastering ZK with 5000+ Q3P',
    imageUrl: '/nfts/zk-gold.svg',
    requiredPoints: 5000,
    rarity: 'rare',
    category: 'zk',
    isClaimable: false,
    isClaimed: false,
  },
];

export const useNFTClaim = () => {
  const context = useContext(NFTClaimContext);
  if (!context) throw new Error('useNFTClaim must be used within a NFTClaimProvider');
  return context;
};

export const NFTClaimProvider = ({ children }: { children: ReactNode }) => {
  const { account, signAndSubmitTransaction } = useWallet();
  const { getTotalEarnedQ3P } = usePoints();
  const { showNotification } = useNotification();
  const [isLoading, setIsLoading] = useState(false);

  const getClaimableNFTs = useCallback((totalPoints: number): ClaimableNFT[] => {
    return NFT_COLLECTION.map(nft => ({
      ...nft,
      isClaimable: totalPoints >= nft.requiredPoints,
    }));
  }, []);

  const claimNFT = useCallback(async (nftId: string): Promise<ClaimResult> => {
    if (!account?.address) return { success: false, error: 'Wallet not connected' };

    const nftToClaim = NFT_COLLECTION.find(nft => nft.id === nftId);
    if (!nftToClaim) return { success: false, error: 'NFT not found' };

    const totalEarnedQ3P = getTotalEarnedQ3P();

    // 1. Check local Q3P instead of on-chain Q3P balance for the demo
    if (totalEarnedQ3P < nftToClaim.requiredPoints) {
      return { success: false, error: `Not enough Q3P. You need ${nftToClaim.requiredPoints}.` };
    }

    setIsLoading(true);

    try {
      // 2. Burn the required Q3P tokens
      const burnResult = await signAndSubmitTransaction({
        data: {
          function: `${MODULE_ADDRESS}::${Q3P_TOKEN_MODULE}::burn` as const,
          functionArguments: [nftToClaim.requiredPoints.toString()],
        },
      });
      await aptos.waitForTransaction({ transactionHash: burnResult.hash });
      
      showNotification(`Successfully burned ${nftToClaim.requiredPoints} Q3P!`, 'success');

      // 3. Mint the NFT via a backend service

      try {
        // In a real application, this request would be sent to a secure backend
        // that holds the admin key to call the `mint_nft` function.
        // Mint NFT directly using the contract
        const mintPayload = {
          function: `${MODULE_ADDRESS}::${NFT_MODULE}::mint_nft` as const,
          functionArguments: [
            nftToClaim.name,
            nftToClaim.description,
            new URL(nftToClaim.imageUrl, window.location.origin).href,
          ],
        };

        const mintResult = await signAndSubmitTransaction({
          data: mintPayload,
        });
        await aptos.waitForTransaction({ transactionHash: mintResult.hash });

        console.log(`NFT minted successfully! Hash: ${mintResult.hash}`);
        showNotification(`NFT minted successfully! Transaction Hash: ${mintResult.hash}\n\nView on Explorer: https://explorer.aptoslabs.com/txn/${mintResult.hash}?network=testnet`, 'success');

        return { success: true, transactionHash: mintResult.hash };

      } catch (error: any) {
        console.error('NFT minting failed', error);
        showNotification(`Minting failed: ${error.message || 'An unknown error occurred.'}`, 'error');
        // NOTE: In a production app, a failure here should trigger a process
        // to refund the user's burned Q3P tokens.
        return { success: false, error: error.message };
      }

    } catch (error: any) {
      console.error('NFT claim process failed', error);
      showNotification(`Claim failed: ${error.message || 'Please try again.'}`, 'error');
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  }, [account?.address, signAndSubmitTransaction, getTotalEarnedQ3P, showNotification]);

  return (
    <NFTClaimContext.Provider value={{ claimableNFTs: NFT_COLLECTION, claimNFT, getClaimableNFTs, isLoading }}>
      {children}
    </NFTClaimContext.Provider>
  );
};
