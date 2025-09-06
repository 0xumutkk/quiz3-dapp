/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_MODULE_ADDRESS: string
  readonly VITE_APP_NETWORK: string
  readonly VITE_NODE_URL: string
  readonly VITE_FAUCET_URL: string
  readonly VITE_API_BASE_URL: string
  readonly VITE_WS_URL: string
  readonly VITE_APP_NAME: string
  readonly VITE_APP_DESCRIPTION: string
  readonly VITE_APP_URL: string
  readonly VITE_ENABLE_ANALYTICS: string
  readonly VITE_ENABLE_REWARDS: string
  readonly VITE_ENABLE_LEADERBOARD: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
