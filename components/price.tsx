import { useEffect, useState } from "react"
import useConvertFiat from "@/hook/use-convert-fiat"
import { PythCluster, PythHttpClient, getPythClusterApiUrl, getPythProgramKeyForCluster } from "@pythnetwork/client"
import { Connection } from "@solana/web3.js"
import { ArrowDown, ArrowUp, DollarSign } from "lucide-react"
import { Area, AreaChart, ResponsiveContainer, Tooltip, YAxis } from "recharts"

import { formatBalance, utilPrice } from "@/lib/utils"

import { Badge } from "./ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"

interface Props {
  country?: string
}

export default function Price({ country = "us" }: Props) {
  const [priceData, setPriceData] = useState<any>([])
  const [currentPrice, setCurrentPrice] = useState("12.22")
  const [percent, setPercent] = useState<any>("0")
  const { getCountryPrice } = useConvertFiat(country)
  const countryPrice = utilPrice.countryPrice

  useEffect(() => {
    getCountryPrice()
  }, [country])

  useEffect(() => {
    const PYTHNET_CLUSTER_NAME: PythCluster = "pythnet"
    const connection = new Connection(getPythClusterApiUrl(PYTHNET_CLUSTER_NAME))
    const pythPublicKey = getPythProgramKeyForCluster(PYTHNET_CLUSTER_NAME)

    async function fetchPrice(): Promise<void> {
      const pythClient = new PythHttpClient(connection, pythPublicKey)
      const data = await pythClient.getData()

      for (const symbol of data.symbols) {
        if (symbol === "Crypto.BTC/USD") {
          const price: any = data.productPrice.get(symbol)!

          if (price.price && price.confidence) {
            setPriceData((prev: any) => {
              const newData = [
                ...prev,
                {
                  name: "price",
                  uv: price.price?.toFixed(4),
                  pv: 0,
                },
              ].slice(-20)

              const checkArr = newData.slice(-2)

              if (checkArr.length >= 2) {
                const confidence = checkArr[1]?.uv - checkArr[0]?.uv

                setPercent({
                  confidence: confidence === 0 ? "0" : (price.confidence / 100)?.toFixed(3),
                  type: confidence >= 0 ? "long" : "short",
                })
              }

              return newData
            })
            setCurrentPrice(price.price?.toFixed(4))
          } else {
          }
        }
      }
    }

    const intervalPrice = setInterval(() => {
      fetchPrice()
    }, 1000)

    return () => clearInterval(intervalPrice)
  }, [])

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="flex text-sm font-medium">
          Price
          <Badge className=" ml-2 bg-[#FFEDD5] pl-1 pr-[7px] font-medium text-[#F97316]">BTC/USDC</Badge>
        </CardTitle>
        <DollarSign size={20} className="text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {Number((Number(currentPrice) * Number(countryPrice.price)).toFixed(countryPrice.fixed)).toLocaleString()}{" "}
          {countryPrice.currency.toUpperCase() || "USDC"}
        </div>
        {percent.type === "long" ? (
          <span className="mt-2 flex text-xs text-long">
            <ArrowUp size={16} />
            {percent.confidence}%
          </span>
        ) : (
          <span className="mt-2 flex text-xs text-short">
            <ArrowDown size={16} />
            {percent.confidence}%
          </span>
        )}
        <div className="h-[230px]">
          <ResponsiveContainer width="100%" height="90%">
            <AreaChart
              data={priceData}
              margin={{
                top: 24,
              }}
            >
              <defs>
                <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F97316" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#F97316" stopOpacity={0} />
                </linearGradient>
              </defs>
              <YAxis domain={["auto", "auto"]} orientation="right" className="text-xs" />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-lg border bg-background p-2 shadow-sm">
                        <div className="flex flex-col">
                          <span className="text-[0.70rem] uppercase text-[#11B981]">$USDC</span>
                          <span className="font-bold ">{payload[0].value} $</span>
                        </div>
                      </div>
                    )
                  }

                  return null
                }}
              />
              <Area
                type="monotone"
                dataKey="uv"
                stroke="#F97316"
                fillOpacity={1}
                strokeWidth={3}
                fill="url(#colorUv)"
                isAnimationActive={false}
                animateNewValues
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
