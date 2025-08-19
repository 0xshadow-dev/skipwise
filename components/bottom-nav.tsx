'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, RotateCcw, BarChart3, Settings } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  {
    href: "/",
    label: "Home",
    icon: Home
  },
  {
    href: "/history",
    label: "History",
    icon: RotateCcw
  },
  {
    href: "/insights",
    label: "Insights",
    icon: BarChart3
  },
  {
    href: "/settings",
    label: "Settings",
    icon: Settings
  }
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-md border-t">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center min-w-16 py-2 px-3 rounded-lg transition-colors",
                isActive 
                  ? "text-primary" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon size={20} />
              <span className="text-xs mt-1 font-medium">
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}