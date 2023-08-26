"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Toaster } from "@/components/ui/toaster"
import Culture from "@/components/culture"
import Leaderboard from "@/components/leaderboard"
import Live from "@/components/live"
import Marquee from "@/components/marquee"
import Portfolio from "@/components/portfolio"
import Price from "@/components/price"
import Tools from "@/components/tools"
import WalletModal from "@/components/wallet-modal"

export default function IndexPage({ params }: any) {
  return (
    <main className="h-[calc(100vh-64px)]">
      <Marquee />

      <div className="flex h-full flex-col">
        <div className="h-full flex-1 space-y-4 p-8 pt-6">
          <Tabs defaultValue="SOLUSDC" className="h-[calc(100%-40px)] space-y-4">
            <TabsList>
              <TabsTrigger value="SOLUSDC">BTC-USDC</TabsTrigger>
              <TabsTrigger value="BTCUSDC" disabled>
                SOL-USDC
              </TabsTrigger>
              <TabsTrigger value="ETHUSDC" disabled>
                ETH-USDC
              </TabsTrigger>
            </TabsList>

            <TabsContent value="SOLUSDC" className="h-[calc(100%-48px)] space-y-4">
              <div className="grid h-full grid-rows-10 gap-4 lg:grid-cols-12">
                <div className="col-span-4 row-span-5">
                  <Price country={params?.country} />
                </div>

                <div className="col-span-5 row-span-10">
                  <Live />
                </div>

                <div className="col-span-3 row-span-6">
                  <Leaderboard />
                </div>

                <div className="col-span-2 row-span-5">
                  <Tools />
                </div>

                <div className="col-span-2 row-span-5">
                  <Culture />
                </div>

                <div className="col-span-3 row-span-4">
                  <Portfolio />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Toaster />
      <WalletModal />
    </main>
  )
}
