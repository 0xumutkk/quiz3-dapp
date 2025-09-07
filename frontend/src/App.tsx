import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AptosWalletAdapterProvider } from '@aptos-labs/wallet-adapter-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { Header } from '@/components/Header';
import { HomePage } from '@/pages/HomePage';
import { QuizPage } from '@/pages/QuizPage';
import { ResultsPage } from '@/pages/ResultsPage';
import { LeaderboardPage } from '@/pages/LeaderboardPage';
import { ClaimPage } from '@/pages/ClaimPage';
import { ArticlePage } from '@/pages/ArticlePage';
import { PointsProvider } from '@/contexts/PointsContext';
import { NFTClaimProvider } from '@/contexts/NFTClaimContext';

import '@/globals.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AptosWalletAdapterProvider 
        autoConnect={true}
        onError={(error) => {
          console.error('Wallet adapter error:', error);
        }}
      >
        <PointsProvider>
          <NFTClaimProvider>
            <Router>
              <div className="min-h-screen bg-hero-gradient">
                <Header />
                <main className="container mx-auto px-4 py-8">
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/quiz/:category" element={<QuizPage />} />
                    <Route path="/results" element={<ResultsPage />} />
                    <Route path="/leaderboard" element={<LeaderboardPage />} />
                    <Route path="/claim" element={<ClaimPage />} />
                    <Route path="/article" element={<ArticlePage />} />
                    <Route path="*" element={<div className="text-center py-20">
                      <h1 className="text-4xl font-bold gradient-text mb-4">404</h1>
                      <p className="text-slate-400">Page not found</p>
                    </div>} />
                  </Routes>
                </main>

                {/* Background decoration */}
                <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
                  <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-trivia-purple/10 rounded-full blur-3xl animate-pulse"></div>
                  <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-trivia-blue/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
                  <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-trivia-cyan/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
                </div>
              </div>
            </Router>
          </NFTClaimProvider>
        </PointsProvider>
      </AptosWalletAdapterProvider>
    </QueryClientProvider>
  );
}

export default App;
