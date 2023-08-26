import { create } from "zustand"

interface AirdropState {
  airdroping: boolean
  setAirdroping: (airdroping: boolean) => void
}

export const useAirdrop = create<AirdropState>()((set) => ({
  airdroping: false,
  setAirdroping: (airdroping: boolean) => set({ airdroping }),
}))
