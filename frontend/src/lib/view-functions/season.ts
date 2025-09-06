import { aptosClient } from '../aptos';

export interface SeasonInfo {
  active_season: number;
  merkle_root: string;
  total_rewards: string;
  start_time: string;
  end_time: string;
}

export interface UserClaimStatus {
  has_claimed: boolean;
  claim_amount: string;
  season: number;
}

/**
 * Get current active season information
 */
export async function getActiveSeason(): Promise<SeasonInfo | null> {
  try {
    const moduleAddress = import.meta.env.VITE_MODULE_ADDRESS;
    if (!moduleAddress) {
      throw new Error('Module address not configured');
    }

    const result = await aptosClient.view({
      payload: {
        function: `${moduleAddress}::quiz3::get_active_season`,
        functionArguments: [],
      },
    });
    
    if (result && result.length >= 5) {
      return {
        active_season: Number(result[0]),
        merkle_root: result[1] as string,
        total_rewards: result[2] as string,
        start_time: result[3] as string,
        end_time: result[4] as string,
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching active season:', error);
    return null;
  }
}

/**
 * Get user's claim status for a specific season
 */
export async function getUserClaimStatus(userAddress: string, season?: number): Promise<UserClaimStatus | null> {
  try {
    const moduleAddress = import.meta.env.VITE_MODULE_ADDRESS;
    if (!moduleAddress) {
      throw new Error('Module address not configured');
    }

    const seasonToCheck = season || 0; // Default to current season

    const result = await aptosClient.view({
      payload: {
        function: `${moduleAddress}::quiz3::get_user_claim_status`,
        functionArguments: [userAddress, seasonToCheck.toString()],
      },
    });
    
    if (result && result.length >= 3) {
      return {
        has_claimed: result[0] as boolean,
        claim_amount: result[1] as string,
        season: Number(result[2]),
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching user claim status:', error);
    return null;
  }
}

/**
 * Get merkle root for a specific season
 */
export async function getSeasonMerkleRoot(season: number): Promise<string | null> {
  try {
    const moduleAddress = import.meta.env.VITE_MODULE_ADDRESS;
    if (!moduleAddress) {
      throw new Error('Module address not configured');
    }

    const result = await aptosClient.view({
      payload: {
        function: `${moduleAddress}::quiz3::get_season_merkle_root`,
        functionArguments: [season.toString()],
      },
    });
    
    if (result && result.length > 0) {
      return result[0] as string;
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching season merkle root:', error);
    return null;
  }
}

/**
 * Get total rewards pool for current season
 */
export async function getTotalRewardsPool(): Promise<string | null> {
  try {
    const moduleAddress = import.meta.env.VITE_MODULE_ADDRESS;
    if (!moduleAddress) {
      throw new Error('Module address not configured');
    }

    const result = await aptosClient.view({
      payload: {
        function: `${moduleAddress}::quiz3::get_total_rewards_pool`,
        functionArguments: [],
      },
    });
    
    if (result && result.length > 0) {
      return result[0] as string;
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching total rewards pool:', error);
    return null;
  }
}
