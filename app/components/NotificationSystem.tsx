"use client";
import { useState, useEffect } from 'react';
import { CheckCircle, X, AlertCircle, Info } from 'lucide-react';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  duration?: number;
}

interface NotificationSystemProps {
  notifications: Notification[];
  onRemove: (id: string) => void;
}

export function NotificationSystem({ notifications, onRemove }: NotificationSystemProps) {
  useEffect(() => {
    notifications.forEach(notification => {
      if (notification.duration && notification.duration > 0) {
        const timer = setTimeout(() => {
          onRemove(notification.id);
        }, notification.duration);

        return () => clearTimeout(timer);
      }
    });
  }, [notifications, onRemove]);

  const getNotificationStyles = (type: NotificationType) => {
    switch (type) {
      case 'success':
        return {
          container: 'alert-success',
          icon: <CheckCircle className="w-5 h-5" />,
        };
      case 'error':
        return {
          container: 'alert-error',
          icon: <AlertCircle className="w-5 h-5" />,
        };
      case 'warning':
        return {
          container: 'alert-warning',
          icon: <AlertCircle className="w-5 h-5" />,
        };
      case 'info':
        return {
          container: 'alert-info',
          icon: <Info className="w-5 h-5" />,
        };
      default:
        return {
          container: 'alert-info',
          icon: <Info className="w-5 h-5" />,
        };
    }
  };

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map((notification) => {
        const { container, icon } = getNotificationStyles(notification.type);
        
        return (
          <div
            key={notification.id}
            className={`alert ${container} shadow-lg max-w-sm animate-pulse`}
          >
            {icon}
            <div className="flex-1">
              <h3 className="font-bold">{notification.title}</h3>
              <div className="text-xs">{notification.message}</div>
            </div>
            <button
              onClick={() => onRemove(notification.id)}
              className="btn btn-ghost btn-xs"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}

// Hook pour gérer les notifications
export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (
    type: NotificationType,
    title: string,
    message: string,
    duration: number = 5000
  ) => {
    const id = `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newNotification: Notification = {
      id,
      type,
      title,
      message,
      duration,
    };

    setNotifications(prev => [...prev, newNotification]);
    return id;
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  return {
    notifications,
    addNotification,
    removeNotification,
    clearAllNotifications,
  };
}
