"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

const SheetContext = React.createContext<{ open: boolean; onOpenChange: (v: boolean) => void }>({
  open: false,
  onOpenChange: () => {},
})

function Sheet({ children, open, onOpenChange }: { children: React.ReactNode; open?: boolean; onOpenChange?: (v: boolean) => void }) {
  return (
    <SheetContext.Provider value={{ open: open ?? false, onOpenChange: onOpenChange ?? (() => {}) }}>
      {children}
    </SheetContext.Provider>
  )
}

const SheetContent = React.forwardRef<HTMLDivElement, { className?: string; style?: React.CSSProperties; side?: "left" | "right"; children: React.ReactNode }>(
  ({ className, style, children }, ref) => (
    <div ref={ref} className={cn("fixed inset-y-0 right-0 z-50 w-80 bg-white shadow-lg", className)} style={style}>{children}</div>
  )
)
SheetContent.displayName = "SheetContent"

const SheetHeader = ({ className, children }: { className?: string; children: React.ReactNode }) => <div className={cn("p-4", className)}>{children}</div>
const SheetTitle = ({ children }: { children: React.ReactNode }) => <h2 className="text-lg font-semibold">{children}</h2>
const SheetDescription = ({ children }: { children: React.ReactNode }) => <p className="text-sm text-muted-foreground">{children}</p>

export { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription }
