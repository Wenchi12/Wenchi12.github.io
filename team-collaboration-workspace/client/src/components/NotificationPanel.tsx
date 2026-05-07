import React from 'react';
import './NotificationPanel.css';

interface Notification {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: Date;
}

interface NotificationPanelProps {
  notifications: Notification[];
}

export const NotificationPanel: React.FC<NotificationPanelProps> = ({ notifications }) => {
  return (
    <div className="notification-panel">
      <h3>Recent Activity</h3>
      <div className="notifications-list">
        {notifications.length === 0 ? (
          <p className="no-notifications">No recent activity</p>
        ) : (
          notifications.map(notification => (
            <div key={notification.id} className={`notification notification-${notification.type}`}>
              <div className="notification-content">
                <p>{notification.message}</p>
                <span className="notification-time">
                  {notification.timestamp.toLocaleTimeString()}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};