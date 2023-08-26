import { PositionSideEnum } from "@hxronetwork/parimutuelsdk"

export type BetCurrent = {
  side: PositionSideEnum
  amount: number
  wallet: string
  timestamp: number
}

export type BetPrevious = {
  id: string
}

export type BetData = {
  long: number
  short: number
}
