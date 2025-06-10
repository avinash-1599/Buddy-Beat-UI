import {
  Home,
  Bookmark,
  UsersRoundIcon,
  Settings,
  UsersIcon,
  UserSearchIcon,
  GemIcon,
  User,
  LogOut,
  MessageCircle,
  LayoutDashboardIcon
} from "lucide-react";

import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { removeUser } from "../utils/userSlice";


// eslint-disable-next-line react/prop-types
const SideBar = ( {onClose}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user);
  const isPremium = user?.isPremium || false;
  const membershipType = user?.membershipType;

  const navItems = [
    ...(isPremium && (membershipType === "Gold" || membershipType === "Platinum")
      ? [{ name: "Dashboard", icon: <LayoutDashboardIcon />, path: "/dashboard" }]
      : []),
    { name: "Home", icon: <Home />, path: "/post/feed" },
    { name: "Explore", icon: <UserSearchIcon />, path: "/explore" },
    { name: "Saved", icon: <Bookmark />, path: "/saved" },
    { type: "divider" },
    { name: "Profile", icon: <User />, path: `/user/profile/${user?._id}` },
    { name: "Requests", icon: <UsersIcon />, path: "/user-requests" },
    { name: "Connections", icon: <UsersRoundIcon />, path: "/connections" },
    { name: "Messages", icon: <MessageCircle />, path: "/messages" },
    { type: "divider" },
    { name: "Premium", icon: <GemIcon />, path: "/premium" },
    { name: "Settings", icon: <Settings />, path: "/settings" },
    { name: "Logout", icon: <LogOut />, path: "/logout" }
  ];

  const handleClick = async (item) => {
    if (item.name === "Logout") {
        try {
            await axios.post(`${BASE_URL}/logout`, {}, { withCredentials: true });
            dispatch(removeUser());
            navigate("/login");
        } catch (err) {
            console.error("Error logging out", err);
        }
    } else {
      navigate(item.path);
    }
    if (onClose) onClose();
  };

  return (
    <div className="bg-gray-900 text-white p-4 rounded-lg shadow-lg sticky mt-5">
      <h2 className="text-xl font-bold mb-6">Quick Links</h2>
      <ul className="space-y-6">
        {navItems.map((item, index) =>
          item.type === "divider" ? (
            <div key={index} className="border-t border-gray-600 my-4" />
          ) : (
            <li
              key={index}
              onClick={() => handleClick(item)}
              className="flex items-center gap-3 cursor-pointer hover:text-yellow-400 transition-colors"
            >
              {item.icon}
              <span>{item.name}</span>
            </li>
          )
        )}
      </ul>
    </div>
  );
};

export default SideBar;