import { PositionSideEnum } from "@hxronetwork/parimutuelsdk"
import { create } from "zustand"

interface PlacePositionState {
  placed: boolean
  setPlaced: (placed: boolean) => void
  side: PositionSideEnum | undefined
  setSide: (side: PositionSideEnum | undefined) => void
  amount: number
  setAmount: (amount: number) => void
}

const usePlacePosition = create<PlacePositionState>((set) => ({
  placed: false,
  setPlaced: (placed: boolean) => set({ placed }),
  side: undefined,
  setSide: (side: PositionSideEnum | undefined) => set({ side }),
  amount: 0,
  setAmount: (amount: number) => set({ amount }),
}))

export default usePlacePosition
