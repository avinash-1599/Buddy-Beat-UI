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

    const fetchNotifications = async () => {
        if (!userId) return;
        try {
            const response = await axios.get(`${BASE_URL}/notifications/${userId}`, { withCredentials: true });
            if (response.data.success) {
                setNotifications(response.data.notifications);
            }
        } catch (error) {
            console.error("Error fetching notifications:", error);
        }
    };

    const markNotificationsAsRead = async () => {
        try {
            if (notifications.some((notif) => !notif.is_read)) {
                await axios.post(`${BASE_URL}/notifications/mark-read`, { userId }, { withCredentials: true });

                setNotifications((prev) =>
                    prev.map((notif) => ({ ...notif, is_read: true }))
                );
            }
        } catch (error) {
            console.error("Error marking notifications as read:", error);
        }
    };

    useEffect(() => {
        if (!userId) return;
        fetchNotifications();

        const handleNewNotification = (newNotification) => {
            setNotifications((prev) => [newNotification, ...prev]);
        };

        socket.on("new_notification", handleNewNotification);

        return () => {
            socket.off("new_notification", handleNewNotification);
        };
    }, [userId]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const unreadCount = notifications.filter((notif) => !notif.is_read).length;

    return (
        <div className="relative" ref={dropdownRef}>
            <button 
                className="relative flex items-center justify-center p-2 rounded-full hover:bg-gray-200 transition"
                onClick={() => {
                    setIsDropdownOpen((prev) => !prev);
                    markNotificationsAsRead();
                }}
            >
                <img 
                    alt="notifications" 
                    src="/bell-icon.png" 
                    height="30px" 
                    width="30px" 
                    className="cursor-pointer"
                />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                        {unreadCount}
                    </span>
                )}
            </button>

            {isDropdownOpen && (
                <div className="absolute right-0 mt-3 w-72 bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200 z-50">
                    <div className="p-3 text-gray-700 font-semibold border-b">
                        Notifications
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <p className="p-4 text-gray-500 text-sm text-center">No new notifications</p>
                        ) : (
                            notifications.map((notification, index) => (
                                <div 
                                    key={index} 
                                    className={`p-3 text-sm flex flex-col border-b transition hover:bg-gray-100 ${
                                        notification.is_read ? "bg-gray-50 text-gray-600" : "bg-white text-black"
                                    }`}
                                >
                                    <p>{notification.message}</p>
                                    <span className="text-xs text-gray-400">{moment(notification.createdAt).fromNow()}</span>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationBell;