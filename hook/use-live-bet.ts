import { create } from "zustand"

interface WalletModalState {
  long: number
  setLong: (long: number) => void
  short: number
  setShort: (short: number) => void
  totalJoin: number
  setTotalJoin: (totalJoin: number) => void
}

const useLiveBet = create<WalletModalState>((set) => ({
  long: 0,
  setLong: (long: number) => set({ long }),
  short: 0,
  setShort: (short: number) => set({ short }),
  totalJoin: 0,
  setTotalJoin: (totalJoin: number) => set({ totalJoin }),
}))

export default useLiveBet
