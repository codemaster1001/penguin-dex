import { useMemo } from "react"
import { AxiosHeaders, AxiosRequestConfig } from "axios"

import { TransferResponse, TransferTokenPayload } from "@/types/shyft"
import { SHYFT_API_KEY, SHYFT_ENDPOINT } from "@/config/constants"

import useApi from "./use-api"

export const useShyft = () => {
  const { call } = useApi()
  const headers = useMemo<AxiosHeaders>(
    () =>
      new AxiosHeaders({
        "Content-Type": "application/json",
        "x-api-key": SHYFT_API_KEY,
        Accept: "*/*",
        "Access-Control-Allow-Origin": "*",
      }),
    []
  )

  const transferToken = async (payload: TransferTokenPayload) => {
    const config: AxiosRequestConfig = {
      method: "POST",
      url: new URL("token/transfer_detach", SHYFT_ENDPOINT).href,
      headers,
      data: payload,
    }

    try {
      const response = await call<TransferResponse>(config)

      return response
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  return { transferToken }
}
