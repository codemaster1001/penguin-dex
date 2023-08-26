import { useEffect, useRef, useState } from "react"
import useConvertFiat from "@/hook/use-convert-fiat"
import useLiveBet from "@/hook/use-live-bet"
import { database } from "@/providers/firebase"
import { PARIMUTUAL } from "@/providers/hrxo"
import { ParimutuelWeb3, PositionSideEnum } from "@hxronetwork/parimutuelsdk"
import { useConnection } from "@solana/wallet-adapter-react"
import { Keypair } from "@solana/web3.js"
import { decode } from "bs58"
import clsx from "clsx"
import { onValue, query, ref, update } from "firebase/database"
import { random, reverse, size, sortBy } from "lodash-es"

import { BetCurrent } from "@/types/bets"
import { BETS_COLLECTION, BET_WALLETS } from "@/config/constants"
import { createAvatarURL, truncateWallet, utilPrice } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

interface LiveBettorProps {
  // parimutuel: ParimutuelObject
}

export default function LiveBettor(props: LiveBettorProps) {
  const { convertToInternationalCurrencySystem } = useConvertFiat()
  const [countryPrice, setCountryPrice] = useState(() => utilPrice.get())
  const [bettors, setBettors] = useState<BetCurrent[]>([])
  const [setLong, setShort, setTotalJoin] = useLiveBet((s) => [s.setLong, s.setShort, s.setTotalJoin])
  const { connection } = useConnection()
  const { config } = PARIMUTUAL
  const count = useRef(0)

  useEffect(() => {
    const updateCallback = (updatedCountryPrice: any) => {
      setCountryPrice(updatedCountryPrice)
    }

    utilPrice.subscribeToUpdate(updateCallback)

    return () => utilPrice.unsubscribeFromUpdate(updateCallback)
  }, [])

  useEffect(() => {
    onValue(query(ref(database, `${BETS_COLLECTION}/current`)), (snapshot) => {
      if (snapshot.val() && size(snapshot.val()) > 0) {
        const sorted = sortBy<BetCurrent>(snapshot.val(), [
          function (o) {
            return o.timestamp
          },
        ])

        setBettors(reverse(sorted))

        let longAmount = 0
        let shortAmount = 0

        sorted.forEach((obj) => {
          if (obj.side === PositionSideEnum.LONG) {
            longAmount += obj.amount
          } else if (obj.side === PositionSideEnum.SHORT) {
            shortAmount += obj.amount
          }
        })

        setLong(longAmount)
        setShort(shortAmount)
        setTotalJoin(sorted.length)
      }
    })
  }, [])

  useEffect(() => {
    const intervalPrice = setInterval(() => {
      simulate()
    }, random(2000, 5000))

    if (count.current >= BET_WALLETS.length) clearInterval(intervalPrice)

    return () => {
      clearInterval(intervalPrice)
    }
  }, [])

  const simulate = () => {
    const privateKey = BET_WALLETS[random(0, BET_WALLETS.length - 1)]
    const keypair = Keypair.fromSecretKey(decode(privateKey))

    update(ref(database, `${BETS_COLLECTION}/current/${keypair.publicKey.toString()}`), {
      wallet: keypair.publicKey.toString(),
      timestamp: Date.now(),
      side: random(0, 1),
      amount: random(1000),
    })
  }

  return (
    <div className=" h-[500px] w-full space-y-2 overflow-auto">
      {bettors &&
        bettors.length > 0 &&
        bettors.map((bettor, index) => (
          <div key={index} className="flex items-center rounded-lg border p-3.5">
            <Avatar className="h-9 w-9">
              <AvatarImage src={createAvatarURL(bettor.wallet).href} />
              <AvatarFallback>{bettor.wallet.slice(0, 2)}</AvatarFallback>
            </Avatar>
            <div className="ml-4 space-y-1">
              <p className="text-xs font-medium leading-none text-muted-foreground">{truncateWallet(bettor.wallet)}</p>
              <div className="flex items-center gap-2">
                <Badge
                  className={clsx(
                    "px-1.5 text-xs font-medium capitalize leading-3",
                    bettor.side === PositionSideEnum.LONG
                      ? "bg-long-foreground text-long"
                      : "bg-short-foreground text-short"
                  )}
                >
                  {PositionSideEnum[bettor.side].toLowerCase()}
                </Badge>
                <span className="text-md font-medium">
                  {convertToInternationalCurrencySystem(
                    (Number(bettor.amount) * Number(countryPrice.price)).toFixed(countryPrice.fixed)
                  )}{" "}
                  {countryPrice.currency.toUpperCase() || "USD"}
                </span>
              </div>
            </div>
          </div>
        ))}
    </div>
  )
}
