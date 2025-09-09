import React, { useState, useEffect } from 'react';
import { useNotification as useNotificationContext } from '@/contexts/NotificationContext';

interface NotificationProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
  duration?: number;
}

export const Notification: React.FC<NotificationProps> = ({ 
  message, 
  type, 
  onClose, 
  duration = 5000 
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Wait for animation to complete
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  const handleLinkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Extract URL from message and open it
    const urlMatch = message.match(/https:\/\/[^\s]+/);
    if (urlMatch) {
      window.open(urlMatch[0], '_blank');
    }
  };

  return (
    <div 
      className={`w-full max-w-2xl transform transition-all duration-500 ${
        isVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-2 opacity-0 scale-95'
      }`}
      style={{ zIndex: 10000 }}
    >
      <div className={`rounded-xl shadow-2xl border-2 p-6 ${
        type === 'success' 
          ? 'bg-gradient-to-r from-emerald-600 to-green-700 border-emerald-300 text-white shadow-emerald-500/50' 
          : 'bg-gradient-to-r from-red-600 to-rose-700 border-red-300 text-white shadow-red-500/50'
      }`}>
        <div className="flex items-start justify-between">
          <div className="flex items-start flex-1">
            <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center mr-4 mt-1 ${
              type === 'success' ? 'bg-white/20' : 'bg-white/20'
            }`}>
              {type === 'success' ? (
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-3">
                <p className="text-lg font-bold">
                  {type === 'success' ? '🎉 Transaction Successful!' : '❌ Transaction Failed!'}
                </p>
                <button
                  onClick={handleClose}
                  className="flex-shrink-0 ml-3 text-white/70 hover:text-white hover:bg-white/20 rounded-full p-1 transition-all duration-200"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
              <div className="text-sm break-words leading-relaxed overflow-hidden">
                {message.split('View on Explorer:').map((part, index) => {
                  if (index === 0) {
                    return (
                      <p key={index} className="break-words overflow-wrap-anywhere mb-3">
                        {part}
                      </p>
                    );
                  }
                  const urlMatch = part.match(/https:\/\/[^\s]+/);
                  if (urlMatch) {
                    return (
                      <div key={index} className="mt-3">
                        <button
                          onClick={handleLinkClick}
                          className="inline-flex items-center px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-all duration-200 border border-white/30 hover:border-white/50"
                        >
                          <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                          <span>View on Explorer</span>
                        </button>
                      </div>
                    );
                  }
                  return (
                    <p key={index} className="break-words overflow-wrap-anywhere">
                      {part}
                    </p>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const NotificationContainer = () => {
  const { notifications, removeNotification } = useNotificationContext();

  return (
    <div 
      className="fixed top-4 left-1/2 transform -translate-x-1/2 space-y-3 pointer-events-none w-full max-w-2xl px-4"
      style={{ zIndex: 9999 }}
    >
      {notifications.map(notification => (
        <div key={notification.id} className="pointer-events-auto w-full">
          <Notification
            message={notification.message}
            type={notification.type}
            onClose={() => removeNotification(notification.id)}
          />
        </div>
      ))}
    </div>
  );
};
