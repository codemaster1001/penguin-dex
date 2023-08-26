import Lottie, { LottieComponentProps } from "lottie-react"

import { cn } from "@/lib/utils"

import flame from "./flame.json"

interface FlameProps extends Omit<LottieComponentProps, "animationData"> {}

export default function Flame({ className, ...props }: FlameProps) {
  return <Lottie className={cn("mb-2 h-6 w-6", className)} animationData={flame} loop={true} {...props} />
}
