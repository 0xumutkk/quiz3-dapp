import { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { aptos, MODULE_ADDRESS, Q3P_TOKEN_MODULE } from '@/lib/aptos';
import { useNotification } from '@/contexts/NotificationContext';
// import { toast } from 'react-hot-toast';

interface TokenContextType {
  balance: number | null;
  fetchBalance: () => Promise<void>;
  registerToken: () => Promise<any>;
  claimTokens: () => Promise<any>;
  claimEarnedPoints: (amount: number) => Promise<any>;
  isRegistered: boolean | null;
  loading: boolean;
}

const TokenContext = createContext<TokenContextType | undefined>(undefined);

export const useToken = () => {
  const context = useContext(TokenContext);
  if (!context) {
    throw new Error('useToken must be used within a TokenProvider');
  }
  return context;
};

export const TokenProvider = ({ children }: { children: ReactNode }) => {
  const { account, signAndSubmitTransaction } = useWallet();
  const { showNotification } = useNotification();
  const [balance, setBalance] = useState<number | null>(null);
  const [isRegistered, setIsRegistered] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);

  const tokenType = `${MODULE_ADDRESS}::q3p_token::Q3PToken`;

  const fetchBalance = useCallback(async () => {
    if (!account?.address) return;
    setLoading(true);
    try {
      const payload = {
        function: `${MODULE_ADDRESS}::${Q3P_TOKEN_MODULE}::get_balance` as const,
        functionArguments: [account.address],
      };
      const result = await aptos.view<[string]>({ payload });
      const newBalance = parseInt(result[0], 10);
      console.log('Fetched Q3P balance:', newBalance);
      setBalance(newBalance);
    } catch (error: any) {
      // If view fails (e.g., module not published or other error), default to 0 and re-check registration.
      await checkRegistration();
      setBalance(0);
    } finally {
      setLoading(false);
    }
  }, [account?.address]);

  const checkRegistration = useCallback(async () => {
    if (!account?.address) return;
    try {
      const result = await aptos.view<[boolean]>({
        payload: {
          function: '0x1::coin::is_account_registered',
          typeArguments: [tokenType],
          functionArguments: [account.address],
        },
      });
      setIsRegistered(!!result[0]);
    } catch (error) {
      setIsRegistered(false);
    }
  }, [account?.address, tokenType]);
  

  const registerToken = async () => {
    if (!account?.address) throw new Error('Wallet not connected');
    setLoading(true);
    const payload = {
      function: `${MODULE_ADDRESS}::${Q3P_TOKEN_MODULE}::register` as const,
      functionArguments: [],
    };
    try {
      const result = await signAndSubmitTransaction({ data: payload });
      console.log('Registration transaction submitted:', result.hash);
      
      // Show success message immediately after submission
      console.log(`Q3P Token registered! Hash: ${result.hash}`);
      showNotification(`Q3P Token registered! Transaction Hash: ${result.hash}\n\nView on Explorer: https://explorer.aptoslabs.com/txn/${result.hash}?network=testnet`, 'success');
      
      // Update registration status and balance immediately
      setIsRegistered(true);
      fetchBalance();
      return result;
    } catch (error: any) {
      console.error('Token registration failed', error);

      // Spesifik error handling
      if (error.message?.includes('User has rejected') || error.message?.includes('User rejected')) {
        console.error('Registration cancelled. Please approve the transaction to register for tokens.');
      } else if (error.message?.includes('insufficient') || error.message?.includes('INSUFFICIENT_BALANCE')) {
        console.error('Insufficient balance for gas fees. Please add some APT to your wallet.');
      } else {
        console.error('Token registration failed. Please try again.');
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const claimTokens = async () => {
    if (!account?.address) throw new Error('Wallet not connected');

    setLoading(true);
    // The `claim_points` function on-chain now handles registration internally.
    const payload = {
      function: `${MODULE_ADDRESS}::${Q3P_TOKEN_MODULE}::claim_points` as const,
      functionArguments: [],
    };
    try {
      const result = await signAndSubmitTransaction({ data: payload });
      console.log('Claim transaction submitted:', result.hash);
      
      // Show success message immediately after submission
      console.log(`100 Q3P Tokens claimed! Hash: ${result.hash}`);
      showNotification(`100 Q3P Tokens claimed! Transaction Hash: ${result.hash}\n\nView on Explorer: https://explorer.aptoslabs.com/txn/${result.hash}?network=testnet`, 'success');
      
      // Update balance and registration status immediately
      fetchBalance();
      setIsRegistered(true);
      return result;
    } catch (error: any) {
      console.error('Token claim failed', error);

      // Daha spesifik error handling
      if (error.message?.includes('User has rejected') || error.message?.includes('User rejected')) {
        console.error('Transaction was cancelled. Please approve the transaction in your wallet to claim tokens.');
      } else if (error.message?.includes('insufficient') || error.message?.includes('INSUFFICIENT_BALANCE')) {
        console.error('Insufficient balance for gas fees. Please add some APT to your wallet.');
      } else if (error.message?.includes('timeout') || error.message?.includes('TIMEOUT')) {
        console.error('Transaction timed out. Please check your connection and try again.');
      } else {
        console.error(`Token claim failed: ${error.message || 'Please try again.'}`);
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const claimEarnedPoints = async (amount: number) => {
    if (!account?.address) throw new Error('Wallet not connected');
    if (amount <= 0) throw new Error('Invalid amount');

    setLoading(true);
    console.log('Using MODULE_ADDRESS:', MODULE_ADDRESS);
    console.log('Full function string:', `${MODULE_ADDRESS}::${Q3P_TOKEN_MODULE}::claim_earned_points`);
    const payload = {
      function: `${MODULE_ADDRESS}::${Q3P_TOKEN_MODULE}::claim_earned_points` as const,
      functionArguments: [amount.toString()],
    };
    try {
      const result = await signAndSubmitTransaction({ data: payload });
      console.log('Transaction submitted:', result.hash);
      
      // Show success message immediately after submission
      console.log(`${amount} Q3P Tokens claimed! Hash: ${result.hash}`);
      showNotification(`${amount} Q3P Tokens claimed! Transaction Hash: ${result.hash}\n\nView on Explorer: https://explorer.aptoslabs.com/txn/${result.hash}?network=testnet`, 'success');
      
      // Update balance and registration status immediately
      fetchBalance();
      setIsRegistered(true);
      return result;
    } catch (error: any) {
      console.error('Earned points claim failed', error);

      // Daha spesifik error handling
      if (error.message?.includes('User has rejected') || error.message?.includes('User rejected')) {
        console.error('Transaction was cancelled. Please approve the transaction in your wallet to claim tokens.');
      } else if (error.message?.includes('insufficient') || error.message?.includes('INSUFFICIENT_BALANCE')) {
        console.error('Insufficient balance for gas fees. Please add some APT to your wallet.');
      } else if (error.message?.includes('timeout') || error.message?.includes('TIMEOUT')) {
        console.error('Transaction timed out. Please check your connection and try again.');
      } else {
        console.error(`Token claim failed: ${error.message || 'Please try again.'}`);
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    if (account?.address) {
      fetchBalance();
      checkRegistration();
    } else {
      setBalance(null);
      setIsRegistered(null);
    }
  }, [account?.address, fetchBalance, checkRegistration]);

  return (
    <TokenContext.Provider value={{ balance, fetchBalance, registerToken, claimTokens, claimEarnedPoints, isRegistered, loading }}>
      {children}
    </TokenContext.Provider>
  );
};
