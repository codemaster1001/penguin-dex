import { WalletAdapterNetwork } from "@solana/wallet-adapter-base"

export type TransferResponse = {
  success: boolean
  message: string
  result: {
    encoded_transaction: string
    signers: Array<string>
  }
}

export type TransferTokenPayload = {
  network: WalletAdapterNetwork
  from_address: string
  to_address: string
  token_address: string
  amount: number
  fee_payer: string
}
