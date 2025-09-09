import React, { createContext, useContext, useState, ReactNode } from 'react';

interface NotificationItem {
  id: string;
  message: string;
  type: 'success' | 'error';
}

interface NotificationContextType {
  showNotification: (message: string, type?: 'success' | 'error') => void;
  notifications: NotificationItem[];
  removeNotification: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    const id = Math.random().toString(36).substr(2, 9);
    setNotifications(prev => [...prev, { id, message, type }]);
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  return (
    <NotificationContext.Provider value={{ showNotification, notifications, removeNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};
