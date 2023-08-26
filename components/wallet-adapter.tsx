"use client"
"use client"

import { ReactNode, useMemo } from "react"
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react"
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui"
import { BackpackWalletAdapter, PhantomWalletAdapter, SolflareWalletAdapter } from "@solana/wallet-adapter-wallets"

import { SOLANA_RPC } from "@/config/constants"

interface WalletAdapterProps {
  children: ReactNode
}

export default function WalletAdapter(props: WalletAdapterProps) {
  const endpoint = SOLANA_RPC
  const wallets = useMemo(
    () => [new PhantomWalletAdapter(), new BackpackWalletAdapter(), new SolflareWalletAdapter()],
    []
  )

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{props.children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}
