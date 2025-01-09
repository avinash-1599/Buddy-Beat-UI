import { Outlet, useNavigate } from "react-router-dom";
import NavBar from "./NavBar";
import Footer from "./Footer";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useEffect } from "react";

const Body = () => {
    // on page refresh, user should be logged in
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const userData = useSelector(store => store.user);

    const fetchUser = async () => {
        if(userData) return;
        try {
            const res = await axios.get(BASE_URL+'/profile/view', {withCredentials: true});
            dispatch(addUser(res.data.data));
        } catch(err) {
            if(err.status === 401) {
                navigate('/login');
            }
            console.log(err);
        }
    }

    useEffect(() => {
        fetchUser();
    }, []);

    return (
        <div className="min-h-screen flex flex-col">
            <NavBar />
            <main className="flex-grow bg-cover bg-center" style={{ backgroundImage: "url('../public/bg-img.png')" }}>
                <div className="bg-gray-800 bg-opacity-30 p-8 min-h-screen">
                    <Outlet />
                </div>
            </main>
            <Footer />
        </div>
    );
}

export default Body;