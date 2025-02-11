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
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get("token");
        console.log("🔹 Token from URL:", token);

        if (token) {
            // 🔹 Store token in localStorage (if needed)
            localStorage.setItem("authToken", token);

            axios.get(`${BASE_URL}/profile/view`, {
                withCredentials: true
            })
            .then((res) => {
                dispatch(addUser(res.data.data));
                navigate("/"); // Redirect to home page
            })
            .catch((err) => console.error("Error fetching user:", err));
        } else {
            console.error("No token found in URL");
            navigate("/login"); // Redirect to login if token missing
        }
    }, []);

    return <h2>Logging in...</h2>;
};

export default AuthCallback;
