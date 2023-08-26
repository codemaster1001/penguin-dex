import { useEffect, useState } from "react"
import useApi from "@/hook/use-api"
import useConvertFiat from "@/hook/use-convert-fiat"
import { database } from "@/providers/firebase"
import clsx from "clsx"
import { onValue, query, ref, update } from "firebase/database"
import { random, reverse, size, sortBy } from "lodash-es"
import { Minus, Plus } from "lucide-react"

import { Leaderboard as LeaderboardType } from "@/types/leaderboard"
import { EARNS_COLLECTION, WALLETS } from "@/config/constants"
import { cn, createAvatarURL, formatBalance, truncateWallet, utilPrice } from "@/lib/utils"

import Flame from "./lottie/flame"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Badge } from "./ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card"

const tokenProfile: any = {
  "11111111111111111111111111111111":
    "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png",
  EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v:
    "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png",
}

const tokenAddressFilter = ["11111111111111111111111111111111", "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"]

export default function Leaderboard({ country }: any) {
  const { convertToInternationalCurrencySystem } = useConvertFiat()
  const [leaderboard, setLeaderboard] = useState<LeaderboardType[]>()
  const [userCount, setUserCount] = useState(0)
  const [countryPrice, setCountryPrice] = useState(() => utilPrice.get())
  const [listPortfolio, setListPortfolio] = useState<any>()
  const { get } = useApi()

  useEffect(() => {
    const updateCallback = (updatedCountryPrice: any) => {
      setCountryPrice(updatedCountryPrice)
    }

    utilPrice.subscribeToUpdate(updateCallback)

    return () => utilPrice.unsubscribeFromUpdate(updateCallback)
  }, [])

  useEffect(() => {
    onValue(query(ref(database, EARNS_COLLECTION)), (snapshot) => {
      setUserCount(size(snapshot.val()))
      setLeaderboard(reverse(sortBy<LeaderboardType>(snapshot.val(), [(o) => o.win - o.lose]).slice(0, 5)))
    })
  }, [])

  useEffect(() => {
    let leaderboardPortfolioList: any = {}

    if (leaderboard?.length) {
      ;(async () => {
        await Promise.all(
          await leaderboard?.map(async (item: any, idx) => {
            if (idx < 5) {
              // enable when mainnet
              // const data: any = await get(
              //   `https://api-main.sonar.watch/v1/portfolio/${item.wallet}?networkId=solana&platformIds=*&useCache=true`
              // )

              // leaderboardPortfolioList[item.wallet] = data?.elements[1]?.data?.assets.filter((dataItem: any) =>
              //   tokenAddressFilter.includes(dataItem.address)
              // )
              leaderboardPortfolioList[item.wallet] = [
                {
                  type: "token",
                  networkId: "solana",
                  address: "11111111111111111111111111111111",
                  amount: Math.random() * 10,
                  price: 20.36,
                  value: 352.8874922634,
                },
                {
                  type: "token",
                  networkId: "solana",
                  address: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
                  amount: Math.random() * 100,
                  price: 1,
                  value: 1.66915,
                },
              ]
            }
          })
        )
        setListPortfolio(leaderboardPortfolioList)
      })()
    }
  }, [leaderboard])

  useEffect(() => {
    const intervalPrice = setInterval(() => {
      simulate()
    }, random(2000, 5000))

    return () => clearInterval(intervalPrice)
  }, [])

  const simulate = () => {
    const wallet = WALLETS[random(0, WALLETS.length - 1)]

    update(ref(database, `${EARNS_COLLECTION}/${wallet}`), {
      wallet,
      win: random(10000, 50000),
      lose: random(1000),
    })
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Leaderboard</CardTitle>
        <CardDescription className="flex items-center gap-0.5">
          {userCount} people are burning this <Flame />
        </CardDescription>
      </CardHeader>

      <CardContent className="-mt-6 h-[100%]">
        <div className="space-y-1">
          {leaderboard &&
            leaderboard.map((user, index) => (
              <HoverCard key={user.wallet}>
                <HoverCardTrigger asChild>
                  <div
                    className={clsx(
                      "relative flex items-center justify-between overflow-hidden rounded-lg p-3 hover:bg-foreground/10",
                      index + 1 === 1 && "shine-effect"
                    )}
                  >
                    <div className="flex select-none">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={createAvatarURL(user.wallet).href} />
                        <AvatarFallback>{user.wallet.slice(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div className="ml-4 flex flex-col space-y-1">
                        <span className="text-sm font-medium leading-none">{truncateWallet(user.wallet)}</span>
                        <span className="text-sm text-muted-foreground">
                          <Badge className="bg-[#FAE8FF] text-[#6366F1]">🔥 7 Streak</Badge>
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <div
                        className={cn(
                          "ml-auto flex items-center gap-0.5 font-medium ",
                          user.win - user.lose > 0 ? "text-long" : "text-short"
                        )}
                      >
                        {user.win - user.lose > 0 ? <Plus size={12} /> : <Minus size={12} />}{" "}
                        {convertToInternationalCurrencySystem(
                          (Number(Math.abs(user.win - user.lose)) * Number(countryPrice.price)).toFixed(
                            countryPrice.fixed
                          )
                        )}
                      </div>
                      <Badge
                        className={cn(
                          "ml-auto pl-1 pr-[7px] font-medium",
                          index + 1 === 1 && "bg-[#FAE8FF] text-[#D946EF]",
                          index + 1 === 2 && "bg-[#e8ecff] text-[#6366F1]",
                          index + 1 === 3 && "bg-[#FFEDD5] text-[#F97316]",
                          index + 1 > 3 && "bg-long-foreground text-long"
                        )}
                      >
                        # {index + 1}
                      </Badge>
                    </div>
                  </div>
                </HoverCardTrigger>
                <HoverCardContent className="w-fit">
                  <div className="flex justify-between space-x-4">
                    <Avatar>
                      <AvatarImage src={createAvatarURL(user.wallet).href} />
                      <AvatarFallback>{user.wallet.slice(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      <h4 className="text-sm font-semibold">@{truncateWallet(user.wallet)}</h4>
                      <div className="flex gap-3">
                        {listPortfolio && listPortfolio[user.wallet] && listPortfolio[user.wallet].length ? (
                          listPortfolio[user.wallet].map((item: any) => (
                            <div className="flex items-center gap-1">
                              <Avatar style={{ height: 20, width: 20 }}>
                                <AvatarImage src={tokenProfile[item.address]} />
                                <AvatarFallback>VC</AvatarFallback>
                              </Avatar>
                              <p className="text-sm">{Number(item.amount).toFixed(2)}</p>
                            </div>
                          ))
                        ) : (
                          <p className="text-sm">No data avaiable.</p>
                        )}
                      </div>
                    </div>
                  </div>
                </HoverCardContent>
              </HoverCard>
            ))}
        </div>
      </CardContent>
    </Card>
  )
}
