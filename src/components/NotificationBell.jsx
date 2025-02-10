import { useEffect, useState, useRef } from "react";
import { createSocketConnection } from "../utils/socket";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import moment from "moment";

const socket = createSocketConnection();

// eslint-disable-next-line react/prop-types
const NotificationBell = ({ userId }) => {
    const [notifications, setNotifications] = useState([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    // ✅ Fetch ALL notifications (both read & unread)
    const fetchNotifications = async () => {
        if (!userId) return;
        try {
            const response = await axios.get(`${BASE_URL}/notifications/${userId}`, {
                withCredentials: true,
            });

            if (response.data.success) {
                setNotifications(response.data.notifications); // ✅ Keep all notifications
            }
        } catch (error) {
            console.error("Error fetching notifications:", error);
        }
    };

    // ✅ Mark notifications as read but KEEP them in the list
    const markNotificationsAsRead = async () => {
        try {
            if (notifications.some((notif) => !notif.is_read)) {
                await axios.post(`${BASE_URL}/notifications/mark-read`, { userId }, { withCredentials: true });

                // ✅ Update UI: Only change `is_read`, don't remove notifications
                setNotifications((prev) =>
                    prev.map((notif) => ({ ...notif, is_read: true }))
                );
            }
        } catch (error) {
            console.error("Error marking notifications as read:", error);
        }
    };

    useEffect(() => {
        if (!userId) {
            console.warn("User ID is undefined, skipping fetch");
            return;
        }
        fetchNotifications();

        const handleNewNotification = (newNotification) => {
            setNotifications((prev) => [newNotification, ...prev]);
        };

        socket.on("new_notification", handleNewNotification);

        return () => {
            socket.off("new_notification", handleNewNotification);
        };
    }, [userId]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // ✅ Calculate unread notification count
    const unreadCount = notifications.filter((notif) => !notif.is_read).length;

    return (
        <div className="notification-bell relative" ref={dropdownRef}>
            <button 
                className="bell-icon flex items-center space-x-1 relative" 
                onClick={() => {
                    setIsDropdownOpen((prev) => !prev);
                    markNotificationsAsRead(); // ✅ Only mark as read, don't remove
                }}
            >
                <img 
                    alt="notifications" 
                    src="/bell-icon.png" 
                    height="35px" 
                    width="35px" 
                    className="p-1 cursor-pointer"  
                />  

                {/* ✅ Show count only for unread notifications */}
                {unreadCount > 0 && (
                    <span className="text-white bg-red-600 rounded-full text-xs px-2 py-1 absolute -top-1 -right-1">
                        {unreadCount}
                    </span>
                )}
            </button>

            {isDropdownOpen && (
                <div className="dropdown absolute right-0 mt-2 w-64 bg-gray-700 text-white shadow-lg rounded-lg p-3 z-50">
                    {notifications.length === 0 ? (
                        <p className="text-gray-400">No notifications</p>
                    ) : (
                        notifications.map((notification, index) => (
                            <div 
                                key={index} 
                                className={`notification-item text-sm p-2 border border-gray-600 rounded-lg shadow-lg transition duration-200 ${
                                    notification.is_read ? "bg-gray-500 text-gray-300" : "bg-gray-400 text-white"
                                }`}
                            >
                                <p className="text-xs text-black">{notification.message}</p>
                                <span className="text-xs text-gray-700">{moment(notification.createdAt).fromNow()}</span>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default NotificationBell;
