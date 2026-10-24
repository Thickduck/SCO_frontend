import { useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { ThemeContext } from './theme-context'

type Theme = 'light' | 'dark'

function initialTheme(): Theme {
  const saved = localStorage.getItem('sco.theme')
  if (saved === 'light' || saved === 'dark') return saved
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(initialTheme)
  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem('sco.theme', theme)
  }, [theme])
  const value = useMemo(() => ({
    dark: theme === 'dark',
    toggle: () => setTheme((current) => current === 'dark' ? 'light' : 'dark'),
  }), [theme])
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
