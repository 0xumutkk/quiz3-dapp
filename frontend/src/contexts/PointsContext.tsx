import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Category } from '@/types';

interface Q3PContextType {
  earnedQ3P: number; // Quiz sonrası kazanılan ama henüz claim edilmemiş Q3P
  claimedQ3P: number; // Claim edilmiş Q3P
  addEarnedQ3P: (q3pAmount: number, category: Category) => void;
  claimEarnedQ3P: () => Promise<boolean>;
  resetEarnedQ3P: () => void;
  getTotalEarnedQ3P: () => number;
  getClaimedQ3P: () => number;
  getNFTThreshold: () => number; // NFT claim için gereken Q3P miktarı
}

const Q3PContext = createContext<Q3PContextType | undefined>(undefined);

const EARNED_Q3P_KEY = 'quiz3_earned_q3p';
const CLAIMED_Q3P_KEY = 'quiz3_claimed_q3p';
const NFT_THRESHOLD = 3000; // NFT claim için gereken Q3P miktarı

interface EarnedQ3PData {
  amount: number;
  category: Category;
  timestamp: Date;
  quizSessionId: string;
}

export function Q3PProvider({ children }: { children: ReactNode }) {
  const [earnedQ3P, setEarnedQ3P] = useState<number>(0);
  const [claimedQ3P, setClaimedQ3P] = useState<number>(0);
  const [earnedSessions, setEarnedSessions] = useState<EarnedQ3PData[]>([]);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedEarned = localStorage.getItem(EARNED_Q3P_KEY);
    const savedClaimed = localStorage.getItem(CLAIMED_Q3P_KEY);

    if (savedEarned) {
      try {
        const parsed = JSON.parse(savedEarned);
        const totalEarned = parsed.reduce((sum: number, item: EarnedQ3PData) => sum + item.amount, 0);
        setEarnedQ3P(totalEarned);
        setEarnedSessions(parsed.map((item: any) => ({
          ...item,
          timestamp: new Date(item.timestamp),
        })));
      } catch (error) {
        console.error('Error loading earned Q3P from localStorage:', error);
      }
    }

    if (savedClaimed) {
      try {
        const parsed = parseInt(savedClaimed, 10);
        setClaimedQ3P(parsed);
      } catch (error) {
        console.error('Error loading claimed Q3P from localStorage:', error);
      }
    }

    // Development mode test data
    if (import.meta.env.DEV && !savedEarned && !savedClaimed) {
      const testEarnedQ3P = 3200;
      setEarnedQ3P(testEarnedQ3P);
      setEarnedSessions([{
        amount: testEarnedQ3P,
        category: 'aptos',
        timestamp: new Date(),
        quizSessionId: 'test_session'
      }]);
      localStorage.setItem(EARNED_Q3P_KEY, JSON.stringify([{
        amount: testEarnedQ3P,
        category: 'aptos',
        timestamp: new Date(),
        quizSessionId: 'test_session'
      }]));
    }
  }, []);

  // Save earned Q3P to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(EARNED_Q3P_KEY, JSON.stringify(earnedSessions));
  }, [earnedSessions]);

  // Save claimed Q3P to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(CLAIMED_Q3P_KEY, claimedQ3P.toString());
  }, [claimedQ3P]);

  const addEarnedQ3P = (q3pAmount: number, category: Category) => {
    const quizSessionId = `quiz_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const newEarnedData: EarnedQ3PData = {
      amount: q3pAmount,
      category,
      timestamp: new Date(),
      quizSessionId,
    };

    setEarnedSessions(prev => [...prev, newEarnedData]);
    setEarnedQ3P(prev => prev + q3pAmount);
  };

  const claimEarnedQ3P = async (): Promise<boolean> => {
    if (earnedQ3P === 0) return false;

    try {
      // For now, just simulate the claim until contract is deployed
      console.log(`Claiming ${earnedQ3P} Q3P tokens...`);

      // TODO: Replace with actual blockchain call when contract is deployed
      // const { claimEarnedPoints } = useToken();
      // await claimEarnedPoints(earnedQ3P);

      setClaimedQ3P(prev => prev + earnedQ3P);
      setEarnedQ3P(0);
      setEarnedSessions([]);

      return true;
    } catch (error) {
      console.error('Failed to claim Q3P:', error);
      return false;
    }
  };

  const resetEarnedQ3P = () => {
    setEarnedQ3P(0);
    setEarnedSessions([]);
    localStorage.removeItem(EARNED_Q3P_KEY);
  };

  const getTotalEarnedQ3P = () => {
    return earnedQ3P;
  };

  const getClaimedQ3P = () => {
    return claimedQ3P;
  };

  const getNFTThreshold = () => {
    return NFT_THRESHOLD;
  };

  const value: Q3PContextType = {
    earnedQ3P,
    claimedQ3P,
    addEarnedQ3P,
    claimEarnedQ3P,
    resetEarnedQ3P,
    getTotalEarnedQ3P,
    getClaimedQ3P,
    getNFTThreshold,
  };

  return (
    <Q3PContext.Provider value={value}>
      {children}
    </Q3PContext.Provider>
  );
}

export function useQ3P() {
  const context = useContext(Q3PContext);
  if (context === undefined) {
    throw new Error('useQ3P must be used within a Q3PProvider');
  }
  return context;
}

// Legacy PointsProvider for backward compatibility
export function PointsProvider({ children }: { children: ReactNode }) {
  return <Q3PProvider>{children}</Q3PProvider>;
}

export function usePoints() {
  const q3pContext = useQ3P();
  return {
    // Legacy compatibility
    userPoints: {
      totalPoints: q3pContext.earnedQ3P,
      categoryPoints: {
        aptos: 0,
        defi: 0,
        nft: 0,
        zk: 0,
      },
      lastUpdated: new Date(),
    },
    addPoints: (category: Category, points: number) => q3pContext.addEarnedQ3P(points, category),
    collectAllPoints: () => {},
    resetPoints: () => q3pContext.resetEarnedQ3P(),
    getTotalPoints: () => q3pContext.getTotalEarnedQ3P(),
    getCategoryPoints: () => 0,
    // New Q3P functions
    earnedQ3P: q3pContext.earnedQ3P,
    claimedQ3P: q3pContext.claimedQ3P,
    claimEarnedQ3P: q3pContext.claimEarnedQ3P,
    getTotalEarnedQ3P: q3pContext.getTotalEarnedQ3P,
    getNFTThreshold: q3pContext.getNFTThreshold,
  };
}
