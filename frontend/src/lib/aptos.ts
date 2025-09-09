import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";

// Aptos client configuration
const aptosConfig = new AptosConfig({
  network: Network.TESTNET,
  fullnode: "https://fullnode.testnet.aptoslabs.com/v1",
  faucet: "https://faucet.testnet.aptoslabs.com",
});

export const aptos = new Aptos(aptosConfig);
export const aptosClient = aptos; // Alias for compatibility

// Contract configuration
export const MODULE_ADDRESS = "0x9cc9a9afd4c0466f5bcdba723c02d35b7f771ed880ca75e6addb9432c77b5af9"; // Deployed address
export const Q3P_TOKEN_MODULE = "q3p_token";
export const NFT_MODULE = "quiz_nft";

// Contract functions
export const FUNCTIONS = {
  CLAIM_POINTS: `${MODULE_ADDRESS}::${Q3P_TOKEN_MODULE}::claim_points`,
  CLAIM_EARNED_POINTS: `${MODULE_ADDRESS}::${Q3P_TOKEN_MODULE}::claim_earned_points`,
  REGISTER: `${MODULE_ADDRESS}::${Q3P_TOKEN_MODULE}::register`,
  BURN: `${MODULE_ADDRESS}::${Q3P_TOKEN_MODULE}::burn`,
  MINT_NFT: `${MODULE_ADDRESS}::${NFT_MODULE}::mint_nft`,
};

// View functions
export const VIEW_FUNCTIONS = {
  GET_BALANCE: `${MODULE_ADDRESS}::${Q3P_TOKEN_MODULE}::get_balance`,
};

// Type definitions for Q3P and NFT contracts
export interface NFTMetadata {
  name: string;
  description: string;
  uri: string;
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
