import { useState } from "react"
import Link from "next/link"
import { useAirdrop } from "@/hook/use-airdrop"
import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import { LAMPORTS_PER_SOL } from "@solana/web3.js"
import { Coins, Loader2, Search } from "lucide-react"

import { createExplorerURL } from "@/lib/utils"

import { useToast } from "../hook/use-toast"
import { Button } from "./ui/button"

export default function AirdropSol() {
  const [loading, setLoading] = useState(false)

  const [airdroping, setAirdroping] = useAirdrop((s) => [s.airdroping, s.setAirdroping])
  const { connection } = useConnection()
  const { publicKey } = useWallet()
  const { toast } = useToast()

  const airdrop = async () => {
    if (!publicKey) return

    setLoading(true)
    setAirdroping(true)
    try {
      const tx = await connection.requestAirdrop(publicKey, 2 * LAMPORTS_PER_SOL)

      toast({
        title: "Successfully airdoped 100 USDC!",
        description: (
          <Link href={createExplorerURL(tx, "tx")} className=" flex items-center gap-2 space-x-1">
            <Search size={16} />
            View on Solana.FM
          </Link>
        ),
      })
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: error.message,
      })
    } finally {
      setLoading(false)
      setAirdroping(false)
    }
  }

  return (
    <Button variant={"outline"} className="space-x-2" onClick={airdrop} disabled={loading || airdroping}>
      {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Coins size={18} />}
      <span className="text-sm font-normal">{loading ? "Airdroping" : "Airdrop"} SOL</span>
    </Button>
  )
}
