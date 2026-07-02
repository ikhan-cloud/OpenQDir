import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'

import { notificationService } from '@/services'
import type { NotificationLevel } from '@/services'

import type { ToastContextValue } from './ToastContext'
import { ToastContext } from './ToastContext'
import { ToastContainer } from './ToastContainer'

export interface ToastItem {
  id: string
  level: NotificationLevel
  title: string
  message?: string
  duration: number
}

interface ToastProviderProps {
  children: ReactNode
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const toastIdRef = useRef(0)

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  useEffect(() => {
    const unsubscribe = notificationService.subscribe((notification) => {
      toastIdRef.current++
      const toast: ToastItem = {
        id: `toast-${toastIdRef.current}`,
        level: notification.level,
        title: notification.title,
        message: notification.message,
        duration: notification.duration,
      }
      setToasts((prev) => [...prev, toast])
    })
    return unsubscribe
  }, [])

  const contextValue = useMemo<ToastContextValue>(
    () => ({
      success: (title, message) => notificationService.success(title, message),
      info: (title, message) => notificationService.info(title, message),
      warning: (title, message) => notificationService.warning(title, message),
      error: (title, message) => notificationService.error(title, message),
    }),
    [],
  )

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  )
}
