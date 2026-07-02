export type NotificationLevel = 'success' | 'info' | 'warning' | 'error'

export interface Notification {
  id: string
  level: NotificationLevel
  title: string
  message?: string
  duration: number
  timestamp: number
}

type NotificationCallback = (notification: Notification) => void

let nextId = 1

class NotificationService {
  private subscribers = new Set<NotificationCallback>()

  private emit(
    level: NotificationLevel,
    title: string,
    message?: string,
    duration?: number,
  ): Notification {
    const notification: Notification = {
      id: `notif-${nextId++}`,
      level,
      title,
      message,
      duration: duration ?? 5000,
      timestamp: Date.now(),
    }
    this.subscribers.forEach((cb) => cb(notification))
    return notification
  }

  success(title: string, message?: string): Notification {
    return this.emit('success', title, message)
  }

  info(title: string, message?: string): Notification {
    return this.emit('info', title, message)
  }

  warning(title: string, message?: string): Notification {
    return this.emit('warning', title, message)
  }

  error(title: string, message?: string): Notification {
    return this.emit('error', title, message)
  }

  notify(
    level: NotificationLevel,
    title: string,
    message?: string,
    duration?: number,
  ): Notification {
    return this.emit(level, title, message, duration)
  }

  subscribe(callback: NotificationCallback): () => void {
    this.subscribers.add(callback)
    return () => {
      this.subscribers.delete(callback)
    }
  }

  unsubscribe(callback: NotificationCallback): void {
    this.subscribers.delete(callback)
  }
}

export const notificationService = new NotificationService()
