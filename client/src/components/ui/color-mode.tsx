import type { ReactNode } from "react"

export interface ColorModeProviderProps {
  children?: ReactNode
  forcedTheme?: "light" | "dark"
}

export function ColorModeProvider(props: ColorModeProviderProps) {
  const { children, forcedTheme } = props
  
  if (forcedTheme) {
    return <div data-theme={forcedTheme}>{children}</div>
  }
  
  return <>{children}</>
}
