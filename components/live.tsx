import { useEffect, useState } from "react"
import useLiveBet from "@/hook/use-live-bet"
import usePlacePosition from "@/hook/use-place-position"
import useHrxo from "@/hook/useHxro"
import { database } from "@/providers/firebase"
import { PositionSideEnum } from "@hxronetwork/parimutuelsdk"
import clsx from "clsx"
import { ref, remove } from "firebase/database"
import { Variants, motion } from "framer-motion"
import { User2 } from "lucide-react"
import { Bar, BarChart, ResponsiveContainer } from "recharts"

import { BetData } from "@/types/bets"
import { ParimutuelObject } from "@/types/paritumuel"
import { BETS_COLLECTION } from "@/config/constants"
import { utilPrice } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import LiveBettor from "./live-bettor"
import PlacePosition from "./place-position"

const defaultBetData: Array<BetData> = [
  {
    long: 0,
    short: 0,
  },
]

const variants: Variants = {
  show: {
    opacity: 1,
    height: 90,
  },
  hide: {
    opacity: 0,
    height: 0,
  },
}

export default function Live({ country }: any) {
  const { Paris } = useHrxo()
  const [pariObj, setPariObj] = useState<ParimutuelObject | null>(null)
  const [countDownTime, setCountDownTime] = useState<string>("")
  const [countryPrice, setCountryPrice] = useState(() => utilPrice.get())
  const [liveBetData, setLiveBetData] = useState<Array<BetData>>(defaultBetData)
  const [long, short, totalJoin] = useLiveBet((s) => [s.long, s.short, s.totalJoin])
  const [placed, amount, side, setPlaced, setAmount, setSide] = usePlacePosition((s) => [
    s.placed,
    s.amount,
    s.side,
    s.setPlaced,
    s.setAmount,
    s.setSide,
  ])

  useEffect(() => {
    const updateCallback = (updatedCountryPrice: any) => {
      setCountryPrice(updatedCountryPrice)
    }

    utilPrice.subscribeToUpdate(updateCallback)

    return () => utilPrice.unsubscribeFromUpdate(updateCallback)
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      const gameData: ParimutuelObject = await Paris()

      if (gameData) {
        setPariObj(gameData)
        createCountdown(gameData)
      }
    }

    const interval = setInterval(() => fetchData(), 1000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    setLiveBetData([{ long, short }])
  }, [long, short])

  const createCountdown = (data: ParimutuelObject) => {
    let formattedTime = "00:00:00"

    if (data.locksTime) {
      const currentTime = new Date().getTime()

      const timeDiff = data.locksTime - currentTime

      if (timeDiff <= 1000) {
        setPlaced(false)
        setAmount(0)
        setSide(undefined)
        remove(ref(database, `${BETS_COLLECTION}/current`))
      }
      const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000)

      formattedTime = `00:${seconds < 10 ? `0${seconds}` : seconds}`

      setCountDownTime(formattedTime)
    }
  }

  return (
    <Card className="flex h-full flex-col">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="relative select-none overflow-hidden text-sm font-medium">
          <Badge
            variant={"outline"}
            className="flex items-center gap-1.5 overflow-hidden pl-2 text-white hover:bg-red-400"
          >
            <span className="relative flex h-3 w-3 items-center">
              <span className="absolute inline-flex h-full w-full animate-ripple rounded-full bg-red-500 opacity-75"></span>
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-600"></span>
            </span>
            Live
          </Badge>
        </CardTitle>
        <User2 size={20} className="text-muted-foreground" />
      </CardHeader>
      <CardContent className="h-full w-full">
        <div className="flex h-full w-full flex-col">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">
                {Number(
                  (Number(long + short) * Number(countryPrice.price)).toFixed(countryPrice.fixed)
                ).toLocaleString()}{" "}
                {countryPrice.currency.toUpperCase() || "USDC"}
              </span>
              <span className="text-xl font-medium">{countDownTime ? countDownTime : "00:59"}</span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">{totalJoin} people join this round</p>
          </div>

          <div className="grid h-full w-full grid-cols-10 grid-rows-10 gap-4 overflow-auto">
            <div className="col-span-6 row-span-6 -mb-5">
              <ResponsiveContainer width="100%" height={350}>
                <BarChart
                  data={liveBetData}
                  barGap={28}
                  margin={{
                    top: 44,
                  }}
                >
                  <defs>
                    <linearGradient id="colorLong" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#D1FAE5" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#11B981" stopOpacity={0.8} />
                    </linearGradient>
                    <linearGradient id="colorShort" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#FCE7F3" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#EC4999" stopOpacity={0.8} />
                    </linearGradient>
                  </defs>
                  <Bar dataKey="long" fill="url(#colorLong)" radius={12} />
                  <Bar dataKey="short" fill="url(#colorShort)" radius={12} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="col-span-4 row-span-10 flex flex-col space-y-4 overflow-hidden">
              <motion.div
                variants={variants}
                animate={placed ? "show" : "hide"}
                className=" row-span-1 flex flex-col space-y-1 rounded-lg border p-3.5"
              >
                <span className="text-sm text-muted-foreground">
                  Your Position
                  {placed && (
                    <Badge
                      className={clsx(
                        "ml-2  px-1.5 font-medium leading-3 text-short capitalize",
                        side === PositionSideEnum.SHORT
                          ? "bg-short-foreground text-short"
                          : "bg-long-foreground text-long"
                      )}
                    >
                      {PositionSideEnum[side!].toLowerCase()}
                    </Badge>
                  )}
                </span>
                <span className="text-2xl font-medium">
                  {Number((Number(amount) * Number(countryPrice.price)).toFixed(countryPrice.fixed)).toLocaleString()}{" "}
                  {countryPrice.currency.toUpperCase() || "USDC"}
                </span>
              </motion.div>
              <div className="w-full overflow-auto">
                <LiveBettor />
              </div>
            </div>

            <div className="col-span-6 row-span-4 flex items-end">
              <PlacePosition gameData={pariObj} countryPrice={countryPrice} />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
