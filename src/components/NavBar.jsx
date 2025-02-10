import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL } from "../utils/constants";
import { removeUser } from "../utils/userSlice";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import NotificationBell from "./NotificationBell";

const NavBar = () => {
    const user = useSelector(store => store.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const handleLogout = async () => {
        try {
            await axios.post(BASE_URL + "/logout", {}, { withCredentials: true });
            dispatch(removeUser());
            setIsDropdownOpen(false);
            return navigate("/login");
        } catch (err) {
            console.log("Error logging out", err);
        }
    };

    return (
        <div className="navbar bg-gray-800 text-white flex items-center justify-between px-6 py-2">
            {/* Left Side - Logo & Brand */}
            <div className="flex items-center space-x-3">
                <img alt="logo" src="/logo.png" height="30px" width="40px" />
                <Link to="/" className="text-xl font-bold text-white">BuddyBeat</Link>
            </div>

            {/* Center - Welcome Message */}
            <div className="hidden md:flex flex-1 justify-center">
                {user && (
                    <p className="text-sm text-white">
                        Welcome, <span className="text-lg font-semibold text-yellow-300">{user.firstName}</span>
                    </p>
                )}
            </div>

            {/* Right Side - Icons & Profile */}
            <div className="flex items-center space-x-5">
                {user && (
                    <>
                        <NotificationBell userId={user?._id} />
                        <img
                            alt="user requests"
                            src="/request-icon.webp"
                            height="35px"
                            width="45px"
                            className="cursor-pointer"
                            onClick={() => navigate("/requests")}
                        />
                        {/* Profile & Dropdown */}
                        <div className="relative">
                            <div
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="cursor-pointer flex items-center space-x-2"
                            >
                                <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-300">
                                    <img alt="user photo" src={user.photoUrl} className="w-full h-full object-cover" />
                                </div>
                            </div>
                            {isDropdownOpen && (
                                <ul className="absolute right-0 mt-3 w-40 bg-gray-800 text-white rounded-md shadow-lg p-2 z-50">
                                    <li><Link to="/profile" className="block p-2 hover:bg-gray-700">Profile</Link></li>
                                    <li onClick={() => setIsDropdownOpen(false)}>
                                        <Link to="/premium" className="block p-2 hover:bg-gray-700">Premium</Link>
                                    </li>
                                    <li>
                                        <button onClick={handleLogout} className="w-full text-left p-2 hover:bg-gray-700">Logout</button>
                                    </li>
                                </ul>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default NavBar;
