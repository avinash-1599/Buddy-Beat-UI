import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useNavigate } from "react-router-dom";

const AuthCallback = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`${BASE_URL}/profile/view`, { withCredentials: true })
            .then((res) => {
                dispatch(addUser(res.data.data));
                navigate("/"); // ✅ Redirect to home
            })
            .catch((err) => {
                console.error("Error fetching user:", err);
                navigate("/login"); // ✅ Redirect to login on failure
            });
    }, []);

    return <h2>Logging in...</h2>;
};

export default AuthCallback;
