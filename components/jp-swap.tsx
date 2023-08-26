import { useWallet } from "@solana/wallet-adapter-react"
import { Replace } from "lucide-react"

import { SOLANA_RPC } from "@/config/constants"

import { Button } from "./ui/button"

export default function JpSwap() {
  const { wallet } = useWallet()

  const initJupiter = () => {
    if (wallet) {
      window.Jupiter.init({
        endpoint: SOLANA_RPC,
        passThroughWallet: wallet,
        defaultExplorer: "SolanaFM",
        displayMode: "modal",
      })
    }
  }

  return (
    <Button variant={"outline"} className="space-x-2" onClick={initJupiter}>
      <Replace size={18} />
      <span className="text-sm font-normal">Swap</span>
    </Button>
  )
}
