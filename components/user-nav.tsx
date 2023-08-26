import { useWallet } from "@solana/wallet-adapter-react"
import { Copy, LogOut } from "lucide-react"
import { useCopyToClipboard } from "react-use"

import { createAvatarURL, truncateWallet } from "@/lib/utils"

import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Button } from "./ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"

export default function UserNav() {
  const { publicKey, disconnect } = useWallet()
  // eslint-disable-next-line no-unused-vars
  const [state, copyToClipboard] = useCopyToClipboard()

  return (
    <>
      {publicKey && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src={createAvatarURL(publicKey?.toString()).href} />
                <AvatarFallback>{publicKey.toString().slice(0, 2)}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-2">
                <p className="text-md font-medium leading-none text-primary">{truncateWallet(publicKey.toString())}</p>
                <p className="text-sm font-normal leading-none">{truncateWallet(publicKey?.toString())}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => copyToClipboard(publicKey.toString())}>
                <Copy className="mr-2 h-3.5 w-3.5" />
                <span>Copy address</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={disconnect}>
              <LogOut className="mr-2 h-3.5 w-3.5" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </>
  )
}
