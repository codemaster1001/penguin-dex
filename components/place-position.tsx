import { useCallback, useState } from "react"
import usePlacePosition from "@/hook/use-place-position"
import { useToast } from "@/hook/use-toast"
import { database } from "@/providers/firebase"
import { PARIMUTUAL } from "@/providers/hrxo"
import { ParimutuelWeb3, PositionSideEnum, WalletSigner } from "@hxronetwork/parimutuelsdk"
import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import { PublicKey } from "@solana/web3.js"
import { ref, update } from "firebase/database"
import { ArrowDown, ArrowUp, Minus, Plus } from "lucide-react"

import { BETS_COLLECTION } from "@/config/constants"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function PlacePosition({ gameData, countryPrice }: { gameData: any; countryPrice: any }) {
  const { toast } = useToast()
  const { connection } = useConnection()
  const { publicKey, signTransaction } = useWallet()
  const wallet = useWallet()
  const [goal, setGoal] = useState(350)
  const { config } = PARIMUTUAL
  const parimutuelWeb3 = new ParimutuelWeb3(config, connection)
  const [placed, setPlaced, setAmount, setSide] = usePlacePosition((s) => [
    s.placed,
    s.setPlaced,
    s.setAmount,
    s.setSide,
  ])
  const [loading, setLoading] = useState(false)

  function onClick(adjustment: number) {
    setGoal(Math.max(200, Math.min(400, goal + adjustment)))
  }

  const onPlace = useCallback(
    async (amount: string, pariPubkey: string, side: PositionSideEnum) => {
      setLoading(true)
      if (!publicKey) {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "Wallet not connected!",
        })
        console.error("Send Transaction: Wallet not connected!")

        return
      }
      let transactionId = ""

      try {
        transactionId = await parimutuelWeb3.placePosition(
          wallet as WalletSigner,
          new PublicKey(pariPubkey),
          parseFloat(amount) * (10 ** 9 / 1),
          side,
          Date.now()
        )

        if (transactionId) {
          toast({
            title: "Success Placed!",
            description: `Placed ${side === PositionSideEnum.LONG ? "LONG" : "SHORT"} Position`,
          })

          setPlaced(true)
          setSide(side)
          setAmount(Number(amount))
          update(ref(database, `${BETS_COLLECTION}/current/${publicKey.toString()}`), {
            amount: Number(amount),
            side,
            wallet: publicKey.toString(),
            timestamp: Date.now(),
          })
        }
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: error.message,
        })
        console.error(`Transaction failed! ${error.message}`, transactionId)
      } finally {
        setLoading(false)
      }
    },
    [publicKey, connection, signTransaction]
  )

  return (
    <Card className="w-full p-0">
      <CardHeader className="pb-4">
        <CardTitle className="text-base">Place Position ({countryPrice.currency.toUpperCase()})</CardTitle>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex items-center justify-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 shrink-0 rounded-full"
            onClick={() => onClick(-10)}
            disabled={goal <= 200}
          >
            <Minus className="h-4 w-4" />
            <span className="sr-only">Decrease</span>
          </Button>
          <div className="flex-1 text-center">
            <div className="text-2xl font-bold tracking-tighter">
              {Number((Number(goal) * Number(countryPrice.price)).toFixed(countryPrice.fixed)).toLocaleString()}{" "}
            </div>
          </div>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 shrink-0 rounded-full"
            onClick={() => onClick(10)}
            disabled={goal >= 400}
          >
            <Plus className="h-4 w-4" />
            <span className="sr-only">Increase</span>
          </Button>
        </div>
      </CardContent>
      <CardFooter className="mt-2 gap-3">
        <Button
          className="w-full hover:bg-long-foreground hover:text-long"
          variant={"secondary"}
          disabled={loading || placed}
          onClick={() => {
            gameData && onPlace(goal.toString(), gameData.pubkey, PositionSideEnum.LONG)
          }}
        >
          <ArrowUp className="-ml-1.5 mr-1.5" size={16} /> Long
        </Button>
        <Button
          disabled={loading || placed}
          className="w-full hover:bg-short-foreground hover:text-short"
          variant={"secondary"}
          onClick={() => {
            gameData && onPlace(goal.toString(), gameData.pubkey, PositionSideEnum.SHORT)
          }}
        >
          <ArrowDown className="-ml-1.5 mr-1.5" size={16} /> Short
        </Button>
      </CardFooter>
    </Card>
  )
}
