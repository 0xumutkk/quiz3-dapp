import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserPoints, PointsTransaction, Category } from '@/types';

interface PointsContextType {
  userPoints: UserPoints;
  addPoints: (category: Category, points: number, source?: 'quiz' | 'bonus' | 'claim' | 'article') => void;
  collectAllPoints: () => void;
  resetPoints: () => void;
  getTotalPoints: () => number;
  getCategoryPoints: (category: Category) => number;
}

const PointsContext = createContext<PointsContextType | undefined>(undefined);

const STORAGE_KEY = 'quiz3_user_points';
const TRANSACTIONS_KEY = 'quiz3_points_transactions';

const initialPoints: UserPoints = {
  totalPoints: 0,
  categoryPoints: {
    aptos: 0,
    defi: 0,
    nft: 0,
    zk: 0,
  },
  lastUpdated: new Date(),
};

// Seed some test points (in development mode)
const isDevelopment = import.meta.env.DEV;
const testPoints: UserPoints = {
  totalPoints: 3200, // 3000+ points to test NFT claim
  categoryPoints: {
    aptos: 1200,
    defi: 800,
    nft: 700,
    zk: 500,
  },
  lastUpdated: new Date(),
};

export function PointsProvider({ children }: { children: ReactNode }) {
  const [userPoints, setUserPoints] = useState<UserPoints>(initialPoints);
  const [transactions, setTransactions] = useState<PointsTransaction[]>([]);

  // Load points from localStorage on mount
  useEffect(() => {
    const savedPoints = localStorage.getItem(STORAGE_KEY);
    const savedTransactions = localStorage.getItem(TRANSACTIONS_KEY);
    
    if (savedPoints) {
      try {
        const parsed = JSON.parse(savedPoints);
        setUserPoints({
          ...parsed,
          lastUpdated: new Date(parsed.lastUpdated),
        });
      } catch (error) {
        console.error('Error loading points from localStorage:', error);
      }
    } else if (isDevelopment) {
      // Use test points in development mode
      setUserPoints(testPoints);
    }
    
    if (savedTransactions) {
      try {
        const parsed = JSON.parse(savedTransactions);
        setTransactions(parsed.map((t: any) => ({
          ...t,
          timestamp: new Date(t.timestamp),
        })));
      } catch (error) {
        console.error('Error loading transactions from localStorage:', error);
      }
    }
  }, []);

  // Save points to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userPoints));
  }, [userPoints]);

  // Save transactions to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions));
  }, [transactions]);

  const addPoints = (category: Category, points: number, source: 'quiz' | 'bonus' | 'claim' = 'quiz') => {
    setUserPoints(prev => {
      const newCategoryPoints = prev.categoryPoints[category] + points;
      const newTotalPoints = prev.totalPoints + points;
      
      return {
        totalPoints: newTotalPoints,
        categoryPoints: {
          ...prev.categoryPoints,
          [category]: newCategoryPoints,
        },
        lastUpdated: new Date(),
      };
    });

    // Add transaction record
    const newTransaction: PointsTransaction = {
      id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      category,
      points,
      timestamp: new Date(),
      source,
    };

    setTransactions(prev => [...prev, newTransaction]);
  };

  const collectAllPoints = () => {
    // This function can be used to "collect" all pending points
    // For now, it just updates the lastUpdated timestamp
    setUserPoints(prev => ({
      ...prev,
      lastUpdated: new Date(),
    }));
  };

  const resetPoints = () => {
    setUserPoints(initialPoints);
    setTransactions([]);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(TRANSACTIONS_KEY);
  };

  const getTotalPoints = () => {
    return userPoints.totalPoints;
  };

  const getCategoryPoints = (category: Category) => {
    return userPoints.categoryPoints[category];
  };

  const value: PointsContextType = {
    userPoints,
    addPoints,
    collectAllPoints,
    resetPoints,
    getTotalPoints,
    getCategoryPoints,
  };

  return (
    <PointsContext.Provider value={value}>
      {children}
    </PointsContext.Provider>
  );
}

export function usePoints() {
  const context = useContext(PointsContext);
  if (context === undefined) {
    throw new Error('usePoints must be used within a PointsProvider');
  }
  return context;
}
