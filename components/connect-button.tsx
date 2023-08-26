import React from "react"
import useWalletModal from "@/hook/use-wallet-modal"

import { Button } from "./ui/button"

export default function ConnectButton() {
  const { setVisible } = useWalletModal()

  return (
    <Button variant="default" size="sm" className="space-x-1 rounded-full" onClick={() => setVisible(true)}>
      <span className="text-xs">Connect</span>
    </Button>
  )
}
