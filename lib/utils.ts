import { Connection, ParsedAccountData, PublicKey } from "@solana/web3.js"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

import { AvatarColors, AvatarVariant } from "@/types/boring-avatar"
import { BORING_AVATAR_COLOR_PALETTE, BORING_AVATAR_ENDPOINT } from "@/config/constants"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function truncateWallet(str: string | undefined | null, length = 4): string {
  if (!str) return "..."

  const first = str.slice(0, length)
  const last = str.slice(-length)

  return `${first}....${last}`
}

export function createAvatarURL(
  wallet: string | undefined | null,
  size: number = 120,
  variant: AvatarVariant = "marble",
  colors: AvatarColors = BORING_AVATAR_COLOR_PALETTE
) {
  if (!wallet) return new URL(`${variant}/${size}/default?colors=${colors.join(",")}`, BORING_AVATAR_ENDPOINT)

  return new URL(`${variant}/${size}/${wallet}?colors=${colors.join(",")}`, BORING_AVATAR_ENDPOINT)
}

export async function getDecimals(connection: Connection, mint: string) {
  const info = await connection.getParsedAccountInfo(new PublicKey(mint))
  const result = (info.value?.data as ParsedAccountData).parsed.info.decimals as number

  return result
}

export function createExplorerURL(id: string, type: "address" | "tx" = "address") {
  return `https://solana.fm/${type}/${id}?cluster=devnet-qn1`
}

export function formatBalance(number: number) {
  return new Intl.NumberFormat("en-EN").format(Number(number.toFixed(2)))
}

export const utilPrice: any = {
  countryPrice: {
    currency: "USDC",
    price: 1,
    fixed: 4,
    flag: "https://img.icons8.com/?size=512&id=63766&format=png",
    gm: "GM 🤘",
  },
  get: () => {
    return utilPrice.countryPrice
  },
  set: (data: any) => {
    console.log(data)
    utilPrice.countryPrice = data
    utilPrice.updateCallbacks.forEach((callback: any) => callback(utilPrice.countryPrice))
  },
  updateCallbacks: [], // Array to store update callbacks
  subscribeToUpdate: (callback: any) => {
    utilPrice.updateCallbacks.push(callback)
  },
  unsubscribeFromUpdate: (callback: any) => {
    utilPrice.updateCallbacks = utilPrice.updateCallbacks.filter((cb: any) => cb !== callback)
  },
}
