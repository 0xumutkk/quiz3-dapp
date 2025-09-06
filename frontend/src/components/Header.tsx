import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { WalletButton } from './WalletButton';
import { getSeasonDates } from '@/lib/utils';

export function Header() {
  const [timeLeft, setTimeLeft] = useState<string>('');

  useEffect(() => {
    const updateCountdown = () => {
      const { end } = getSeasonDates();
      const now = new Date().getTime();
      const distance = end.getTime() - now;

      if (distance > 0) {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        if (days > 0) {
          setTimeLeft(`${days}d ${hours}h ${minutes}m`);
        } else if (hours > 0) {
          setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
        } else {
          setTimeLeft(`${minutes}m ${seconds}s`);
        }
      } else {
        setTimeLeft('Season Ended');
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-700/50 bg-slate-900/80 backdrop-blur-xl header-mobile-responsive">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <img src="/logo.svg" alt="Quiz3" className="h-10 w-auto header-logo-mobile-responsive" />
          </div>
          <div>
            <div className="text-xs text-slate-400 -mt-1">
              Web3 Knowledge Arena
            </div>
          </div>
        </div>

        {/* Season Countdown */}
        <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800/50 border border-slate-700/50">
          <Clock className="h-4 w-4 text-trivia-blue" />
          <div className="text-sm">
            <div className="text-xs text-slate-400">Season Ends In</div>
            <div className="font-mono font-medium text-trivia-blue">
              {timeLeft}
            </div>
          </div>
        </div>

        {/* Mobile Season Display */}
        <div className="sm:hidden flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-800/50 header-countdown-mobile-responsive">
          <Clock className="h-3 w-3 text-trivia-blue" />
          <span className="text-xs font-mono text-trivia-blue">
            {timeLeft}
          </span>
        </div>

        {/* Wallet Connection */}
        <WalletButton />
      </div>
    </header>
  );
}
