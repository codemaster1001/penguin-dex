import { useState } from "react"

import { countryConfig } from "@/config/country"
import { utilPrice } from "@/lib/utils"

import useApi from "./use-api"

const useConvertFiat = (country?: string) => {
  const defaultSetting = {
    currency: "USDC",
    price: 1,
    fixed: 4,
  }
  const [countryPrice, setCountryPrice] = useState(utilPrice.countryPrice)
  const fetch = useApi()
  const getListCurrency = async () => {
    const res: any = await fetch.get(
      "https://api.coingecko.com/api/v3/simple/price?ids=usd-coin&vs_currencies=vnd,mxn,eur,inr"
    )

    return res["usd-coin"]
  }

  const getCountryPrice = async () => {
    const listCurrency = await getListCurrency()

    if (country) {
      const countryCurrency = countryConfig[country]?.currency
      const fixed = countryConfig[country]?.fixed
      const flag = countryConfig[country]?.flag || countryPrice.flag
      const gm = countryConfig[country]?.gm || countryPrice.gm

      // for (let key in listCurrency) {
      //   if (key === countryCurrency) {
      utilPrice.set({
        currency: "USDC",
        price: 1,
        fixed: 4,
        flag,
        gm,
      })
      // }
      // }
    }
  }

  const returnToUSD = () => {
    setCountryPrice(defaultSetting)
  }

  const convertToInternationalCurrencySystem = (input: any) => {
    // Nine Zeroes for Billions
    return Math.abs(Number(input)) >= 1.0e9
      ? (Math.abs(Number(input)) / 1.0e9).toFixed(2) + "B"
      : // Six Zeroes for Millions
      Math.abs(Number(input)) >= 1.0e6
      ? (Math.abs(Number(input)) / 1.0e6).toFixed(2) + "M"
      : // Three Zeroes for Thousands
      Math.abs(Number(input)) >= 1.0e3
      ? (Math.abs(Number(input)) / 1.0e3).toFixed(2) + "K"
      : Math.abs(Number(input))
  }

  return { countryPrice, getCountryPrice, returnToUSD, convertToInternationalCurrencySystem }
}

export default useConvertFiat
