"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart3, ChefHat, ClipboardList, Home, LogOut, Package, Settings, ShoppingCart, Users } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

interface SidebarLink {
  title: string
  href: string
  icon: React.ElementType
  badge?: number
}

const links: SidebarLink[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: Home,
  },
  {
    title: "Inventory",
    href: "/dashboard/inventory",
    icon: Package,
  },
  // {
  //   title: "Recipes",
  //   href: "/dashboard/recipes",
  //   icon: ClipboardList,
  // },
  {
    title: "Orders",
    href: "/dashboard/orders",
    icon: ShoppingCart,
  },
  // {
  //   title: "Analytics",
  //   href: "/dashboard/analytics",
  //   icon: BarChart3,
  // },
  {
    title: "Suppliers",
    href: "/dashboard/suppliers",
    icon: Users,
  },
  // {
  //   title: "Settings",
  //   href: "/dashboard/settings",
  //   icon: Settings,
  // },
]

export function DashboardSidebar() {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <div
      className={cn(
        "relative flex flex-col border-r bg-white transition-all duration-300",
        isCollapsed ? "w-[80px]" : "w-[280px]",
      )}
    >
      <div className="flex h-16 items-center border-b px-4">
        <Link href="/dashboard" className="flex items-center gap-2">
          <ChefHat className="h-6 w-6" />
          {!isCollapsed && <span className="font-bold">Restaurant Inventory</span>}
        </Link>
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-3 h-8 w-8 rounded-full"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? <ChefHat className="h-5 w-5" /> : <ChefHat className="h-5 w-5" />}
          <span className="sr-only">Toggle Sidebar</span>
        </Button>
      </div>
      <ScrollArea className="flex-1 py-4">
        <nav className="grid gap-1 px-2">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-gray-100",
                pathname === link.href ? "bg-gray-100 text-gray-900" : "text-gray-500",
              )}
            >
              <link.icon className="h-5 w-5" />
              {!isCollapsed && <span>{link.title}</span>}
              {!isCollapsed && link.badge && (
                <span className="ml-auto flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-xs font-medium">
                  {link.badge}
                </span>
              )}
            </Link>
          ))}
        </nav>
      </ScrollArea>
      <div className="mt-auto border-t p-4">
        <Button variant="outline" className={cn("w-full justify-start", isCollapsed && "justify-center px-0")}>
          <LogOut className="mr-2 h-4 w-4" />
          {!isCollapsed && <span>Log out</span>}
        </Button>
      </div>
    </div>
  )
}

