import { PARIMUTUAL } from "@/providers/hrxo"
import * as sdk from "@hxronetwork/parimutuelsdk"
import * as web3 from "@solana/web3.js"

import { ParimutuelObject } from "@/types/paritumuel"
import { SOLANA_RPC } from "@/config/constants"

const useHrxo = () => {
  const { config } = PARIMUTUAL
  const rpc = SOLANA_RPC
  const connection = new web3.Connection(rpc, "confirmed")
  const parimutuelWeb3 = new sdk.ParimutuelWeb3(config, connection)
  const market = sdk.MarketPairEnum.BTCUSD
  const markets = sdk.getMarketPubkeys(config, market)
  const timeSecond = 60 // The expires are in seconds, so this would be the 1 min
  const marketsByTime = markets.filter((market) => market.duration === timeSecond)

  const Paris: ParimutuelObject | any = async () => {
    const parimutuels = await parimutuelWeb3.getParimutuels(marketsByTime, 5)

    const usdcDec = 1_000_000

    if (parimutuels.length) {
      const pariMarkets = parimutuels.filter((account) => {
        return (
          account.info.parimutuel.timeWindowStart.toNumber() > Date.now() &&
          account.info.parimutuel.timeWindowStart.toNumber() < Date.now() + timeSecond * 1000
        )
      })

      // console.log(pariMarkets)
      const longPool = pariMarkets[0].info.parimutuel.activeLongPositions.toNumber() / usdcDec
      const shortPool = pariMarkets[0].info.parimutuel.activeShortPositions.toNumber() / usdcDec

      const totalVolume = longPool + shortPool

      const longOdds = sdk.calculateNetOdd(longPool, totalVolume, 0.03)
      const shortOdds = sdk.calculateNetOdd(shortPool, totalVolume, 0.03)

      const locksTime = pariMarkets[0].info.parimutuel.timeWindowStart.toNumber()
      const pubkey = pariMarkets[0].pubkey.toString()

      const gameData = {
        pubkey,
        longPool: longPool.toFixed(2),
        shortPool: shortPool.toFixed(2),
        longOdds,
        shortOdds,
        locksTime,
        expired: pariMarkets[0].info.parimutuel.expired,
      }

      return gameData
    }
  }

  return { Paris }
}

export default useHrxo
