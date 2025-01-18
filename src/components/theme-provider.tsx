// components/theme-provider.tsx  (Create this new file)
'use client'

import { ThemeProvider as NextThemesProvider } from "next-theme"

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return <NextThemesProvider attribute="class">{children}</NextThemesProvider>
}