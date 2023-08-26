import AirdropSol from "./airdrop-sol"
import AirdropUsdc from "./airdrop-usdc"
import JpSwap from "./jp-swap"
import { ThemeToggle } from "./theme-toggle"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"

export default function Tools() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Tools</CardTitle>
        <CardDescription>Help you quickly enjoy the betting with others</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          <JpSwap />
          <AirdropUsdc />
          <AirdropSol />

          <ThemeToggle />
        </div>
      </CardContent>
    </Card>
  )
}
