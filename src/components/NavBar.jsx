import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL } from "../utils/constants";
import { removeUser } from "../utils/userSlice";
import { Link, useNavigate } from "react-router-dom";

const NavBar = () => {
    // subscribe to the user store using useSelector hook
    const user = useSelector(store => store.user);
    console.log("useeeeeer", user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await axios.post(BASE_URL+'/logout', {}, {withCredentials: true});
            dispatch(removeUser());
            return navigate('/login');
        } catch(err) {
            console.log("Error logging out", err);
        }
    }

    return (
        <div className="navbar bg-gray-800 text-white">
            <div className="flex-1">
            <img alt="logo" src="../public/logo.png" height="30px" width="40px"/>
                <Link to='/' className="btn btn-ghost text-xl text-white">BuddyBeat</Link>
            </div>
            <div className="flex-none gap-2">
                {user && (
                    <div className="dropdown dropdown-end mx-5 flex">
                        <p className="px-4 text-sm text-white mt-2">Welcome, {user.firstName}</p>
                        <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                            <div className="w-10 rounded-full">
                                <img alt="user photo" src={user.photoUrl} />
                            </div>
                        </div>
                        <ul
                            tabIndex={0}
                            className="menu menu-sm dropdown-content bg-gray-800 text-white rounded-box z-[1] mt-3 w-52 p-2 shadow">
                            <li>
                                <Link to='/profile' className="justify-between">
                                    Profile
                                    <span className="badge">New</span>
                                </Link>
                            </li>
                            <li><Link to='/connections'>Connections</Link></li>
                            <li><Link to='/requests'>Requests</Link></li>
                            <li><a onClick={() => handleLogout()}>Logout</a></li>
                        </ul>
                    </div>
                )}
            </div>
        </div>
    )
}

export default NavBar;