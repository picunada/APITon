import type { WalletInfo } from '@tonconnect/sdk'

export interface WalletAppInfo {
  name: string
  imageUrl: string
  aboutUrl: string
  tondns: string
  bridgeUrl: string
  universalLink: string
  jsBridgeKey: string
  injected: boolean
  embedded: boolean
}

export type WalletApp = WalletAppInfo & WalletInfo
