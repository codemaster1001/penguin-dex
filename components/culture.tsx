import { useEffect, useState } from "react"

import { utilPrice } from "@/lib/utils"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"

export default function Culture() {
  const [countryData, setCountryData] = useState<any>(() => utilPrice.get())

  useEffect(() => {
    const updateCallback = (updatedCountryPrice: any) => {
      setCountryData(updatedCountryPrice)
    }

    utilPrice.subscribeToUpdate(updateCallback)

    return () => utilPrice.unsubscribeFromUpdate(updateCallback)
  }, [])

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>
          <img className="h-8 w-8" src={countryData?.flag} alt="" />
        </CardTitle>
        <CardDescription>{countryData?.gm}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2"></div>
      </CardContent>
    </Card>
  )
}
