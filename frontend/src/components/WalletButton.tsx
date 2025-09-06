import { useState } from 'react';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { Wallet, LogOut, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatAddress } from '@/lib/utils';

export function WalletButton() {
  const { connected, account, connect, disconnect, wallets } = useWallet();
  const [isConnecting, setIsConnecting] = useState(false);
  const [showWallets, setShowWallets] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleConnect = async () => {
    if (wallets && wallets.length === 1) {
      setIsConnecting(true);
      try {
        await connect(wallets[0].name as any);
      } catch (error) {
        console.error('Failed to connect:', error);
      } finally {
        setIsConnecting(false);
      }
    } else {
      setShowWallets(!showWallets);
    }
  };

  const handleWalletSelect = async (walletName: string) => {
    setIsConnecting(true);
    setShowWallets(false);
    try {
      await connect(walletName as any);
    } catch (error) {
      console.error('Failed to connect to', walletName, ':', error);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnect();
    } catch (error) {
      console.error('Failed to disconnect:', error);
    }
  };

  const handleCopyAddress = async () => {
    if (account?.address) {
      await navigator.clipboard.writeText(account.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (connected && account) {
    return (
      <div className="relative">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyAddress}
            className="flex items-center gap-2 text-xs"
          >
            <span className="text-trivia-blue font-mono">
              {formatAddress(account.address)}
            </span>
            {copied ? (
              <Check className="h-3 w-3 text-green-500" />
            ) : (
              <Copy className="h-3 w-3" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDisconnect}
            className="p-2"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <Button
        onClick={handleConnect}
        disabled={isConnecting}
        className="flex items-center gap-2 wallet-button-mobile-responsive"
      >
        <Wallet className="h-4 w-4" />
        {isConnecting ? 'Connecting...' : 'Connect Wallet'}
      </Button>

      {showWallets && wallets && wallets.length > 0 && (
        <div className="absolute top-full right-0 mt-2 w-64 bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl z-50 overflow-hidden">
          <div className="p-4 border-b border-slate-700">
            <h3 className="font-semibold text-sm text-slate-200">Choose Wallet</h3>
          </div>
          <div className="max-h-60 overflow-y-auto">
            {wallets.map((wallet) => (
              <button
                key={wallet.name}
                onClick={() => handleWalletSelect(wallet.name)}
                disabled={isConnecting}
                className="w-full flex items-center gap-3 p-4 hover:bg-slate-700/50 transition-colors duration-200 text-left disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <img
                  src={wallet.icon}
                  alt={wallet.name}
                  className="h-8 w-8 rounded-lg"
                />
                <div className="flex-1">
                  <div className="font-medium text-sm text-slate-200">
                    {wallet.name}
                  </div>
                  <div className="text-xs text-slate-400">
                    {wallet.url}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
