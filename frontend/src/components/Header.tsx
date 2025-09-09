import { useNavigate } from 'react-router-dom';
import { WalletButton } from './WalletButton';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { useToken } from '@/contexts/TokenContext';

export function Header() {
  const navigate = useNavigate();
  const { connected } = useWallet();
  const { balance: q3pBalance } = useToken();

  const handleLogoClick = () => {
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-slate-900/50 backdrop-blur-lg border-b border-slate-800">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <div 
          className="flex items-center gap-2 cursor-pointer"
          onClick={handleLogoClick}
        >
          <img src="/logo.svg" alt="Quiz3 Logo" className=" w-24" />
        </div>

        {/* Q3P Balance and Wallet Button */}
        <div className="flex items-center gap-4">
          {connected && (
            <div className="hidden sm:flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-2 bg-slate-800/70 rounded-md border border-slate-700">
                <span className="text-sm text-slate-400">Q3P:</span>
                <span className="font-bold text-trivia-cyan">{q3pBalance !== null ? q3pBalance.toLocaleString() : '...'}</span>
              </div>
            </div>
          )}
          <WalletButton />
        </div>
      </div>
      {/* Mobile Q3P Display */}
      {connected && (
        <div className="sm:hidden pb-3 px-4 flex justify-center items-center gap-4 border-t border-slate-800 mt-2 pt-2">
            <div className="flex items-center gap-2 px-3 py-1 bg-slate-800/70 rounded-md border border-slate-700">
              <span className="text-xs text-slate-400">Q3P:</span>
              <span className="font-semibold text-sm text-trivia-cyan">{q3pBalance !== null ? q3pBalance.toLocaleString() : '...'}</span>
            </div>
        </div>
      )}
    </header>
  );
}
