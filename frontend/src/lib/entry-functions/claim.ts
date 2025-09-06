import { aptosClient } from '../aptos';

export interface ClaimParams {
  season: number;
  amount: string;
  merkleProof: string[];
  merkleRoot: string;
}

export interface ClaimResult {
  success: boolean;
  transactionHash?: string;
  error?: string;
}

/**
 * Claim rewards for a user using Merkle proof
 */
export async function claimRewards(
  userAccount: any, // Account from wallet adapter
  claimParams: ClaimParams
): Promise<ClaimResult> {
  try {
    const moduleAddress = import.meta.env.VITE_MODULE_ADDRESS;
    if (!moduleAddress) {
      throw new Error('Module address not configured');
    }

    const transaction = await aptosClient.transaction.build.simple({
      sender: userAccount.address,
      data: {
        function: `${moduleAddress}::quiz3::claim_rewards`,
        typeArguments: [],
        functionArguments: [
          claimParams.season.toString(),
          claimParams.amount,
          claimParams.merkleProof,
          claimParams.merkleRoot,
        ],
      },
    });

    // Submit and wait for transaction
    const result = await aptosClient.signAndSubmitTransaction({
      signer: userAccount,
      transaction,
    });
    
    return {
      success: true,
      transactionHash: result.hash,
    };
  } catch (error) {
    console.error('Error claiming rewards:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * Set season merkle root (admin only)
 */
export async function setSeasonMerkleRoot(
  adminAccount: any, // Account from wallet adapter
  season: number,
  merkleRoot: string
): Promise<ClaimResult> {
  try {
    const moduleAddress = import.meta.env.VITE_MODULE_ADDRESS;
    if (!moduleAddress) {
      throw new Error('Module address not configured');
    }

    const transaction = await aptosClient.transaction.build.simple({
      sender: adminAccount.address,
      data: {
        function: `${moduleAddress}::quiz3::set_season_root`,
        typeArguments: [],
        functionArguments: [season.toString(), merkleRoot],
      },
    });

    // Submit and wait for transaction
    const result = await aptosClient.signAndSubmitTransaction({
      signer: adminAccount,
      transaction,
    });
    
    return {
      success: true,
      transactionHash: result.hash,
    };
  } catch (error) {
    console.error('Error setting season merkle root:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * Initialize new season (admin only)
 */
export async function initializeSeason(
  adminAccount: any, // Account from wallet adapter
  season: number,
  totalRewards: string,
  startTime: string,
  endTime: string
): Promise<ClaimResult> {
  try {
    const moduleAddress = import.meta.env.VITE_MODULE_ADDRESS;
    if (!moduleAddress) {
      throw new Error('Module address not configured');
    }

    const transaction = await aptosClient.transaction.build.simple({
      sender: adminAccount.address,
      data: {
        function: `${moduleAddress}::quiz3::initialize_season`,
        typeArguments: [],
        functionArguments: [
          season.toString(),
          totalRewards,
          startTime,
          endTime,
        ],
      },
    });

    // Submit and wait for transaction
    const result = await aptosClient.signAndSubmitTransaction({
      signer: adminAccount,
      transaction,
    });
    
    return {
      success: true,
      transactionHash: result.hash,
    };
  } catch (error) {
    console.error('Error initializing season:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}