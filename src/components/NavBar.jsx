import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL } from "../utils/constants";
import { removeUser } from "../utils/userSlice";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

const NavBar = () => {
    // subscribe to the user store using useSelector hook
    const user = useSelector(store => store.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const handleLogout = async () => {
        try {
            await axios.post(BASE_URL+'/logout', {}, {withCredentials: true});
            dispatch(removeUser());
            setIsDropdownOpen(false);
            return navigate('/login');
        } catch(err) {
            console.log("Error logging out", err);
        }
    }

    return (
        <div className="navbar bg-gray-800 text-white">
            <div className="flex-1">
            <img alt="logo" src="/logo.png" height="30px" width="40px" />
                <Link to='/' className="btn btn-ghost text-xl text-white">BuddyBeat</Link>
            </div>
            <div className="flex-none gap-2">
                {user && (
                    <>
                        <img alt="user requests" src="/request-icon.webp" height="35px" width="45px" className="cursor-pointer"
                            onClick={() => navigate("/requests")} />
                    <div onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="dropdown dropdown-end mx-5 flex">
                        <p className="px-4 text-sm text-white mt-2">Welcome, {user.firstName}</p>
                        <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                            <div className="w-10 rounded-full">
                                <img alt="user photo" src={user.photoUrl} />
                            </div>
                        </div>
                        {isDropdownOpen && (<ul
                            tabIndex={0}
                            className="menu menu-sm dropdown-content bg-gray-800 text-white rounded-box z-[1] mt-3 w-auto p-2 shadow">
                            <li><Link to='/profile' className="justify-between">Profile</Link></li>
                            <li onClick={() => setIsDropdownOpen(false)}><Link to='/premium'>Premium</Link></li>
                            <li><a onClick={() => handleLogout()}>Logout</a></li>
                        </ul>)}
                    </div>
                    </>
                )}
            </div>
        </div>
    )
}

export default NavBar;