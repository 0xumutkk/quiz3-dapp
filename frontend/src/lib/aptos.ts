import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";

// Aptos client configuration
const aptosConfig = new AptosConfig({
  network: Network.TESTNET,
});

export const aptos = new Aptos(aptosConfig);
export const aptosClient = aptos; // Alias for compatibility

// Contract configuration
export const MODULE_ADDRESS = import.meta.env.VITE_MODULE_ADDRESS || "0x1"; // Will be updated after deployment
export const MODULE_NAME = "trivia_game";

// Contract functions
export const FUNCTIONS = {
  SET_SEASON_ROOT: `${MODULE_ADDRESS}::${MODULE_NAME}::set_season_root`,
  CLAIM: `${MODULE_ADDRESS}::${MODULE_NAME}::claim`,
  CREATE_SEASON: `${MODULE_ADDRESS}::${MODULE_NAME}::create_season`,
};

// View functions
export const VIEW_FUNCTIONS = {
  GET_CURRENT_SEASON: `${MODULE_ADDRESS}::${MODULE_NAME}::get_current_season`,
  GET_SEASON: `${MODULE_ADDRESS}::${MODULE_NAME}::get_season`,
  HAS_CLAIMED: `${MODULE_ADDRESS}::${MODULE_NAME}::has_claimed`,
  GET_USER_CLAIM: `${MODULE_ADDRESS}::${MODULE_NAME}::get_user_claim`,
  GET_CURRENT_SEASON_ID: `${MODULE_ADDRESS}::${MODULE_NAME}::get_current_season_id`,
};

// Type definitions
export interface Season {
  id: string;
  start_at: string;
  end_at: string;
  status: number;
  merkle_root: number[];
}

export interface ClaimRecord {
  user: string;
  amount: string;
  claimed: boolean;
  claimed_tx: number[];
}

// Utility functions
export function formatAptosAddress(address: string): string {
  if (!address.startsWith('0x')) {
    return `0x${address}`;
  }
  return address;
}

export function parseAptosAmount(amount: string | number): number {
  return typeof amount === 'string' ? parseInt(amount) : amount;
}
