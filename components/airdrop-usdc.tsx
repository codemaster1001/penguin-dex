/* eslint-disable camelcase */

import { useState } from "react"
import Link from "next/link"
import { useAirdrop } from "@/hook/use-airdrop"
import { useShyft } from "@/hook/use-shyft"
import { NodeWallet } from "@metaplex/js"
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base"
import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import { Keypair, Transaction } from "@solana/web3.js"
import { decode } from "bs58"
import { Coins, Loader2, Search } from "lucide-react"

import { PEGUIN_MASTER_PRIVATE_KEY, USDC_MINT } from "@/config/constants"
import { createExplorerURL } from "@/lib/utils"

import { useToast } from "../hook/use-toast"
import { Button } from "./ui/button"

export default function AirdropUsdc() {
  const [loading, setLoading] = useState(false)

  const [airdroping, setAirdroping] = useAirdrop((s) => [s.airdroping, s.setAirdroping])
  const { connection } = useConnection()
  const { publicKey } = useWallet()
  const { transferToken } = useShyft()
  const { toast } = useToast()

  const airdrop = async () => {
    if (!publicKey) return

    setLoading(true)
    setAirdroping(true)

    const peguin = Keypair.fromSecretKey(decode(PEGUIN_MASTER_PRIVATE_KEY))
    const wallet = new NodeWallet(peguin)

    try {
      const { result } = await transferToken({
        network: WalletAdapterNetwork.Devnet,
        from_address: peguin.publicKey.toString(),
        to_address: publicKey.toString(),
        token_address: USDC_MINT,
        amount: 100,
        fee_payer: peguin.publicKey.toString(),
      })

      const decodedTransaction = Transaction.from(Buffer.from(result.encoded_transaction, "base64"))
      const signedTx = await wallet.signTransaction(decodedTransaction)
      const confirmTransaction = await connection.sendRawTransaction(signedTx.serialize())

      toast({
        title: "Successfully airdoped 100 USDC!",
        description: (
          <Link href={createExplorerURL(confirmTransaction, "tx")} className=" flex items-center gap-2 space-x-1">
            <Search size={16} />
            View on Solana.FM
          </Link>
        ),
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "Not yours, us. We are checking the problem.",
      })
    } finally {
      setLoading(false)
      setAirdroping(false)
    }
  }

  return (
    <Button variant={"outline"} className="space-x-2" onClick={airdrop} disabled={loading || airdroping}>
      {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Coins size={18} />}
      <span className="text-sm font-normal">{loading ? "Airdroping" : "Airdrop"} USDC</span>
    </Button>
  )
}
