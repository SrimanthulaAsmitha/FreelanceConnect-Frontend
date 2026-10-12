
import { useEffect, useState } from "react";
import axios from "axios";

function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  const email = localStorage.getItem("email");
  const token = localStorage.getItem("token");

 const API_URL = (
  import.meta.env.VITE_API_URL ||
  "https://freelanceconnect-backend.onrender.com"
).replace(/\/+$/, "");

  const loadNotifications = async () => {
    if (!email || !token) {
      return;
    }

    try {
      const response = await axios.get(
        `${API_URL}/api/notifications?email=${encodeURIComponent(email)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setNotifications(response.data);
    } catch (error) {
      console.log("NOTIFICATION LOAD ERROR:", error);
    }
  };

  useEffect(() => {
    loadNotifications();

    const interval = setInterval(() => {
      loadNotifications();
    }, 10000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const unreadCount = notifications.filter(
    (notification) => !notification.readStatus
  ).length;

  const handleNotificationClick = async (notification) => {
    if (notification.readStatus) {
      return;
    }

    try {
      await axios.put(
        `${API_URL}/api/notifications/${notification.id}/read`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setNotifications((previous) =>
        previous.map((item) =>
          item.id === notification.id
            ? {
                ...item,
                readStatus: true,
              }
            : item
        )
      );
    } catch (error) {
      console.log("MARK NOTIFICATION ERROR:", error);
    }
  };

  return (
    <div className="notification-wrapper">
      <button
        type="button"
        className="notification-button"
        onClick={() => setShowNotifications(!showNotifications)}
        aria-label="Notifications"
      >
        <span className="notification-icon">🔔</span>

        {unreadCount > 0 && (
          <span className="notification-count">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {showNotifications && (
        <div className="notification-dropdown">
          <div className="notification-header">
            <div>
              <h3>Notifications</h3>

              <span>
                {unreadCount > 0
                  ? `${unreadCount} unread`
                  : "All caught up"}
              </span>
            </div>
          </div>

          <div className="notification-list">
            {notifications.length === 0 ? (
              <div className="notification-empty">
                <div className="notification-empty-icon">🔔</div>

                <h4>No notifications</h4>

                <p>You're all caught up.</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <button
                  type="button"
                  key={notification.id}
                  className={`notification-item ${
                    notification.readStatus ? "read" : "unread"
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="notification-item-icon">🔔</div>

                  <div className="notification-item-content">
                    <p>{notification.message}</p>

                    {!notification.readStatus && <span>New</span>}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default NotificationBell;