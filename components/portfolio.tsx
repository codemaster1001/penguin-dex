import { useEffect, useState } from "react"
import { useAirdrop } from "@/hook/use-airdrop"
import { TOKEN_PROGRAM_ID } from "@solana/spl-token"
import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import { GetProgramAccountsFilter, LAMPORTS_PER_SOL } from "@solana/web3.js"
import { ArrowDown } from "lucide-react"
import { Line, LineChart, ResponsiveContainer, Tooltip } from "recharts"

import { HXRO_MINT, USDC_MINT } from "@/config/constants"
import { formatBalance } from "@/lib/utils"

import { Badge } from "./ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Skeleton } from "./ui/skeleton"

const data = [
  {
    hxro: 400,
    usdc: 240,
    sol: 140,
  },
  {
    hxro: 300,
    usdc: 139,
    sol: 139,
  },
  {
    hxro: 200,
    usdc: 980,
    sol: 580,
  },
  {
    hxro: 278,
    usdc: 390,
    sol: 290,
  },
  {
    hxro: 189,
    usdc: 480,
    sol: 880,
  },
  {
    hxro: 239,
    usdc: 380,
    sol: 80,
  },
  {
    hxro: 349,
    usdc: 430,
    sol: 130,
  },
]

export default function Portfolio() {
  const [usdc, setUsdc] = useState(0)
  const [hxro, setHxro] = useState(0)
  const [sol, setSol] = useState(0)
  const [loading, setLoading] = useState(false)

  const { publicKey } = useWallet()
  const { connection } = useConnection()
  const [airdroping] = useAirdrop((s) => [s.airdroping])

  const getBalance = async () => {
    if (!publicKey) return

    setLoading(true)
    const filters: GetProgramAccountsFilter[] = [
      {
        dataSize: 165,
      },
      {
        memcmp: {
          offset: 32,
          bytes: publicKey.toString(),
        },
      },
    ]
    const accounts = connection.getParsedProgramAccounts(TOKEN_PROGRAM_ID, { filters: filters })
    const balance = connection.getBalance(publicKey)

    const responses = await Promise.all([accounts, balance])

    responses[0].forEach((account) => {
      const parsedAccountInfo: any = account.account.data
      const mintAddress: string = parsedAccountInfo["parsed"]["info"]["mint"]
      const tokenBalance: number = parsedAccountInfo["parsed"]["info"]["tokenAmount"]["uiAmount"]

      if (mintAddress === USDC_MINT) setUsdc(tokenBalance)
      if (mintAddress === HXRO_MINT) setHxro(tokenBalance)
    })

    setSol(responses[1] / LAMPORTS_PER_SOL)

    setLoading(false)
  }

  useEffect(() => {
    if (!publicKey) return

    if (!airdroping) {
      getBalance()
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connection, publicKey, airdroping])

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span>Portfolio</span>
            <Badge className="bg-[#6366F1] text-[#FAE8FF]">🔥 7 Streak</Badge>
            <Badge className="bg-[#6366F1] text-[#FAE8FF]">🔥 7 Streak</Badge>
          </div>
          <div className="flex">
            <Badge className="ml-auto bg-short-foreground pl-1 pr-[7px] font-medium text-short">
              <ArrowDown size={12} /> 12%
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-6">
          <div className="h-[80px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={data}
                margin={{
                  top: 5,
                  right: 10,
                  left: 10,
                  bottom: 0,
                }}
              >
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="rounded-lg border bg-background p-2 shadow-sm">
                          <div className="grid grid-cols-2 gap-2">
                            <div className="flex flex-col">
                              <span className="text-[0.70rem] uppercase text-[#11B981]">$HXRO</span>
                              <span className="font-bold ">{payload[0].value}</span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[0.70rem] uppercase text-[#0DA5E9]">$USDC</span>
                              <span className="font-bold">{payload[1].value}</span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[0.70rem] uppercase text-[#D946EF]">$SOL</span>
                              <span className="font-bold">{payload[2].value}</span>
                            </div>
                          </div>
                        </div>
                      )
                    }

                    return null
                  }}
                />
                <Line type="monotone" strokeWidth={2} dataKey="hxro" stroke="#11B981" />
                <Line type="monotone" dataKey="usdc" strokeWidth={2} stroke="#0DA5E9" />
                <Line type="monotone" dataKey="sol" strokeWidth={2} stroke="#D946EF" />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="flex grow gap-2">
            <div className="flex flex-col rounded-lg border p-4">
              <span className="text-xs text-[#11B981]">$HXRO</span>
              {loading ? (
                <Skeleton className="h-6 w-20" />
              ) : (
                <span className="text-lg font-medium text-primary">{formatBalance(hxro)}</span>
              )}
            </div>
            <div className="flex flex-col rounded-lg border p-4">
              <span className="text-xs  text-[#0DA5E9]">$USDC</span>
              {loading ? (
                <Skeleton className="h-6 w-20" />
              ) : (
                <span className="text-lg font-medium text-primary">{formatBalance(usdc)}</span>
              )}
            </div>
            <div className="flex flex-col rounded-lg border p-4">
              <span className="text-xs  text-[#D946EF]">$SOL</span>
              {loading ? (
                <Skeleton className="h-6 w-20" />
              ) : (
                <span className="text-lg font-medium text-primary">{formatBalance(sol)}</span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
