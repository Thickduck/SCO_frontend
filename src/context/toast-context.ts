import { createContext } from 'react'

export type ToastTone = 'success' | 'error' | 'info'
export interface ToastItem { id: number; message: string; tone: ToastTone }
export const ToastContext = createContext<(message: string, tone?: ToastTone) => void>(() => {})
