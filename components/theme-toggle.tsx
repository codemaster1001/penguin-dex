"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const { setTheme, theme } = useTheme()

  return (
    <Button variant={"outline"} onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
      <Sun size={18} className="dark:hidden" />
      <Moon size={18} className="hidden dark:block" />
      <span className="ml-2 text-sm font-normal">Switch to {theme === "light" ? "dark" : "light"}</span>
    </Button>
  )
}
