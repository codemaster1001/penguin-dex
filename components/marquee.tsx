import { useEffect, useRef, useState } from "react"
import { random } from "lodash-es"
import MQ from "react-fast-marquee"

import { WALLETS } from "@/config/constants"
import { truncateWallet, utilPrice } from "@/lib/utils"

import { Separator } from "./ui/separator"

export type InformationType = "streak" | "earn"

type Information = {
  type: string
  wallet: string
  amount: number
}

export default function Marquee() {
  const [countryPrice, setCountryPrice] = useState(() => utilPrice.get())
  const [informations, setInformation] = useState<Array<Information>>([])
  const current = useRef(0)

  useEffect(() => {
    const updateCallback = (updatedCountryPrice: any) => {
      setCountryPrice(updatedCountryPrice)
    }

    utilPrice.subscribeToUpdate(updateCallback)

    return () => utilPrice.unsubscribeFromUpdate(updateCallback)
  }, [])

  useEffect(() => {
    const intervalPrice = setInterval(() => {
      simulate()
    }, random(2000, 5000))

    return () => {
      clearInterval(intervalPrice)
    }
  }, [])

  const simulate = () => {
    current.current++
    const wallet = WALLETS[current.current % WALLETS.length]
    const randomType: InformationType = random(0, 1) === 0 ? "earn" : "streak"
    const randomInformation: Information = {
      type: randomType,
      wallet,
      amount: randomType === "earn" ? random(1000, 5000) : random(1, 10),
    }

    setInformation((prev) => [...prev, randomInformation])
  }

  return (
    <MQ className="border-b bg-muted-foreground/10 py-[2px]" speed={13}>
      <div className="flex items-center gap-2">
        {informations &&
          informations.length > 0 &&
          informations.map((infor, index) => (
            <>
              {infor.type === "earn" ? (
                <div key={index} className="space-x-3 text-sm font-normal text-muted-foreground">
                  <span>{truncateWallet(infor.wallet)}</span>
                  <span className="text-long">
                    +
                    {Number(
                      (Number(infor.amount) * Number(countryPrice.price)).toFixed(countryPrice.fixed)
                    ).toLocaleString()}{" "}
                    {countryPrice.currency.toUpperCase() || "USD"}
                  </span>
                </div>
              ) : (
                <div className="space-x-2 text-sm font-normal text-muted-foreground">
                  <span>{truncateWallet(infor.wallet)}</span>
                  <span className="text-red-200">{infor.amount} streaks 🔥</span>
                </div>
              )}

              <Separator orientation="vertical" className="h-4" />
            </>
          ))}
      </div>
    </MQ>
  )
}
