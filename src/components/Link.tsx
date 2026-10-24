import type { MouseEvent, ReactNode } from 'react'
import { navigateTo } from '../utils/navigation'

export function Link({ to, children }: { to: string; children: ReactNode }) {
  return (
    <a href={to} onClick={(event: MouseEvent<HTMLAnchorElement>) => {
      event.preventDefault()
      navigateTo(to)
    }}>
      {children}
    </a>
  )
}
