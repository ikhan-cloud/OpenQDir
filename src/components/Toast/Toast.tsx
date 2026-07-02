import { useEffect, useState } from 'react'

import { cn } from '@/lib/utils'
import type { NotificationLevel } from '@/services'

interface ToastItem {
  id: string
  level: NotificationLevel
  title: string
  message?: string
  duration: number
}

interface ToastProps {
  toast: ToastItem
  onDismiss: (id: string) => void
}

const levelStyles: Record<NotificationLevel, string> = {
  success: 'border-l-green-500 bg-green-50 dark:bg-green-950/20',
  info: 'border-l-blue-500 bg-blue-50 dark:bg-blue-950/20',
  warning: 'border-l-amber-500 bg-amber-50 dark:bg-amber-950/20',
  error: 'border-l-red-500 bg-red-50 dark:bg-red-950/20',
}

const levelIcons: Record<NotificationLevel, string> = {
  success: 'M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z',
  info: 'm11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z',
  warning: 'M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z',
  error: 'M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z',
}

export function Toast({ toast, onDismiss }: ToastProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const enter = requestAnimationFrame(() => setVisible(true))
    return () => cancelAnimationFrame(enter)
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false)
      setTimeout(() => onDismiss(toast.id), 200)
    }, toast.duration)
    return () => clearTimeout(timer)
  }, [toast.id, toast.duration, onDismiss])

  return (
    <div
      className={cn(
        'flex items-start gap-3 border-l-4 bg-background p-3 shadow-lg ring-1 ring-border transition-all duration-200',
        levelStyles[toast.level],
        visible ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0',
      )}
      role="alert"
    >
      <svg
        className="mt-0.5 h-4 w-4 shrink-0 text-foreground"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d={levelIcons[toast.level]} />
      </svg>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground">{toast.title}</p>
        {toast.message && (
          <p className="mt-0.5 text-xs text-muted-foreground">{toast.message}</p>
        )}
      </div>
      <button
        onClick={() => {
          setVisible(false)
          setTimeout(() => onDismiss(toast.id), 200)
        }}
        className="shrink-0 rounded p-0.5 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
        aria-label="Dismiss"
      >
        <svg
          className="h-3.5 w-3.5"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  )
}
