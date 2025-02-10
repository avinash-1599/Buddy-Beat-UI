import { useEffect, useState } from "react";
import { createSocketConnection } from "../utils/socket";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import moment from "moment";

const socket = createSocketConnection();


// eslint-disable-next-line react/prop-types
const NotificationBell = ({ userId }) => {
    const [notifications, setNotifications] = useState([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    // Fetch unread notifications from backend
    const fetchNotifications = async () => {
        try {
            const response = await axios.get(BASE_URL + "/notifications/" + userId, {
                withCredentials: true,
              });
            
            if (response.data.success) {
                setNotifications(response.data.notifications);
            }
        } catch (error) {
            console.error("Error fetching notifications:", error);
        }
    };

    useEffect(() => {

        if (!userId) {
            console.warn("User ID is undefined, skipping fetch");
            return;
        }
        fetchNotifications(); // Fetch on component mount

        // Listen for real-time notifications via WebSocket
        if (socket) {
            socket.on("new_notification", (newNotification) => {
                setNotifications((prev) => [newNotification, ...prev]);
            });
        }

        return () => {
            if (socket) {
                socket.off("new_notification");
            }
        };
    }, [userId, socket]);
    

    return (
        <div className="notification-bell relative">
            <button className="bell-icon flex items-center space-x-1 relative" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                <img 
                    alt="notifications" 
                    src="/bell-icon.png" 
                    height="35px" 
                    width="35px" 
                    className="p-1 cursor-pointer"  
                />  
    
                {/* ✅ Notification count as a small badge */}
                {notifications.length > 0 && (
                    <span className="text-white bg-red-600 rounded-full text-xs px-2 py-1 absolute top-0 right-0">
                        {notifications.length}
                    </span>
                )}
            </button>

            {/* ✅ Show dropdown only when `isDropdownOpen` is true */}
            {isDropdownOpen && (
                <div className="dropdown absolute right-0 mt-2 w-64 bg-gray-600 shadow-lg rounded-lg p-3 z-50">
                    {notifications.length === 0 ? (
                        <p className="text-gray-500">No new notifications</p>
                    ) : (
                        notifications.map((notification, index) => (
                            <div key={index} className="notification-item text-black text-sm p-1 border border-gray-500 rounded-lg bg-gray-400 shadow-lg hover:bg-gray-300 transition duration-200">
                                <p>{notification.message}</p>
                                <span className="text-xs text-gray-600">{moment(notification.createdAt).fromNow()}</span>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}


export default NotificationBell;
