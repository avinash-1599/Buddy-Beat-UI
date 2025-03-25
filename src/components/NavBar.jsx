import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL } from "../utils/constants";
import { removeUser } from "../utils/userSlice";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import NotificationBell from "./NotificationBell";

const NavBar = () => {
    const user = useSelector((store) => store.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const handleLogout = async () => {
        try {
            await axios.post(`${BASE_URL}/logout`, {}, { withCredentials: true });
            dispatch(removeUser());
            setIsDropdownOpen(false);
            navigate("/login");
        } catch (err) {
            console.error("Error logging out", err);
        }
    };

    return (
        <nav className="bg-gray-800 text-white flex items-center justify-between px-6 py-3 shadow-md z-50">
            {/* Left Section - Logo & Brand */}
            <div className="flex items-center space-x-3">
                <img src="/logo.png" alt="logo" className="h-8 w-8" />
                <Link to="/post/feed" className="text-xl font-bold hover:text-gray-300">BuddyBeat</Link>
            </div>

            {/* Center Section - Welcome Message */}
            {user && (
                <div className="hidden md:flex flex-1 justify-center items-center space-x-4">
                    <p className="text-sm">
                        Welcome, <span className="text-lg font-semibold text-yellow-300">{user.firstName}</span>
                    </p>
                    <img
                        src="/explore-users.webp"
                        alt="explore users"
                        className="h-8 w-8 cursor-pointer border border-black rounded-lg bg-cyan-400"
                        onClick={() => navigate("/")}
                    />
                </div>
            )}

            {/* Right Section - Icons & Profile */}
            <div className="flex items-center space-x-5">
                {user && (
                    <>
                        <img
                            src="/home-icon.jpg"
                            alt="posts feed"
                            className="h-8 w-8 cursor-pointer border border-black rounded-lg"
                            onClick={() => navigate("/post/feed")}
                        />
                        <NotificationBell userId={user?._id} />
                        <img
                            src="/request-icon.webp"
                            alt="user requests"
                            className="h-10 w-10 cursor-pointer"
                            onClick={() => navigate("/requests")}
                        />
                        {/* Profile Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="flex items-center space-x-2 focus:outline-none"
                            >
                                <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-300">
                                    <img src={user.photoUrl} alt="user photo" className="w-full h-full object-cover" />
                                </div>
                            </button>
                            {isDropdownOpen && (
                                <ul className="absolute right-0 mt-3 w-40 bg-gray-800 text-white rounded-md shadow-lg p-2">
                                    <li>
                                        <Link to="/profile" className="block p-2 hover:bg-gray-700">Profile</Link>
                                    </li>
                                    <li>
                                        <Link to="/premium" className="block p-2 hover:bg-gray-700" onClick={() => setIsDropdownOpen(false)}>
                                            Premium
                                        </Link>
                                    </li>
                                    <li>
                                        <button onClick={handleLogout} className="w-full text-left p-2 hover:bg-gray-700">
                                            Logout
                                        </button>
                                    </li>
                                </ul>
                            )}
                        </div>
                    </>
                )}
            </div>
        </nav>
    );
};

export default NavBar;