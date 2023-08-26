"use client"

import { useWallet } from "@solana/wallet-adapter-react"
import { Bell, Cable, Gift } from "lucide-react"

import ConnectButton from "./connect-button"
import MainNav from "./main-nav"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import UserNav from "./user-nav"

export default function Header() {
  const { publicKey } = useWallet()

  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4">
        <span>🐧🐧</span>
        <MainNav className="mx-6" />
        <div className="ml-auto flex items-center space-x-2">
          <div className="ml-auto flex items-center gap-1">
            <Button variant="outline" size="sm" className="space-x-1 rounded-full p-2 pr-2.5">
              <Cable size={15} />
              <span className="text-xs">Devnet</span>
            </Button>

            <Button variant="outline" size="sm" className=" rounded-full p-2">
              <Bell size={15} className="origin-top animate-swing" />
              <Badge
                variant="default"
                className="ml-1.5 h-[18px] w-[18px] items-center justify-center bg-white p-1 text-[10px]"
              >
                12
              </Badge>
            </Button>

            <Button variant="outline" size="sm" className=" rounded-full p-2">
              <Gift size={15} />
              <Badge
                variant="default"
                className="ml-1.5 h-[18px] w-[18px] items-center justify-center bg-white p-1 text-[10px]"
              >
                2
              </Badge>
            </Button>
          </div>
          {publicKey ? <UserNav /> : <ConnectButton />}
        </div>
      </div>
    </div>
  )
}
